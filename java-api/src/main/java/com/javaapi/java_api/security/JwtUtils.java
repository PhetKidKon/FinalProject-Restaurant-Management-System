package com.javaapi.java_api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private static final Set<String> tokenBlacklist = new HashSet<>();

    public static String generateToken(int personId, String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("Id", personId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (60 * 60 * 1000))) // 5 นาที
                .signWith(key)
                .compact();
    }

    public static Jws<Claims> validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }


    public static Claims getClaims(String token) {
        return validateToken(token).getBody();
    }

    public boolean validateJwtToken(String authToken) {
        try {
          if (tokenBlacklist.contains(authToken)) {
            logger.error("JWT token is revoked (blacklisted)");
            return false;
        }
          Jwts.parserBuilder().setSigningKey(key).build().parse(authToken);
          return true;
        } catch (MalformedJwtException e) {
          logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
          logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
          logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
          logger.error("JWT claims string is empty: {}", e.getMessage());
        }
    
        return false;
    }
    
    public static void revokeToken(String token) {
      tokenBlacklist.add(token);
  }

}