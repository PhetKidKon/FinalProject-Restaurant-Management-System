package com.javaapi.java_api.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.repository.account.EmployeeRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    
    @Autowired
    private EmployeeRepository employeeRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{

        Employee employee=employeeRepository.findByAccountEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("Email Not Found with email"+email));
        
        String role ="ROLE_"+employee.getRole().toUpperCase();
        String password = employee.getAccount().getPassword();
        

        return new User(
            email,
            password,
            Collections.singletonList(new SimpleGrantedAuthority(role))
        );

    }

}
