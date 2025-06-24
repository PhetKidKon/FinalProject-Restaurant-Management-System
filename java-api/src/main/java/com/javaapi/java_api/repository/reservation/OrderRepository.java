package com.javaapi.java_api.repository.reservation;

import java.util.*;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer.OpaqueTokenConfigurer;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.reservation.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    //Get All Order
    List<Order> findAll();

    //Find By Id
    Optional<Order> findById(int id);

    //Find By Status
    List<Order> findByStatus(String status, Sort sort);

    //Delete By Id
    void deleteById(int id);
    
} 