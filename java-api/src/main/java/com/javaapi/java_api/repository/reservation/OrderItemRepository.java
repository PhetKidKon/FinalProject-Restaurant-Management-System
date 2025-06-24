package com.javaapi.java_api.repository.reservation;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.reservation.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>{

    //Get All Table
    List<OrderItem> findAll();

    //Find By Id
    Optional<OrderItem> findById(int id);

    //Delete By Id
    void deleteById(int id);
    
} 
