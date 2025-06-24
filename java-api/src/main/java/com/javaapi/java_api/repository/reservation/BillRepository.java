package com.javaapi.java_api.repository.reservation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.reservation.Bill;
import com.javaapi.java_api.entity.reservation.Order;
import com.javaapi.java_api.entity.reservation.OrderItem;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

    //Get All Table
    List<Bill> findAll();

    //Find By Id
    Optional<Bill> findById(int id);

    //Find By Order Id
    Optional<Bill> findByOrderId(int orderId);

    List<Bill> findByStatus(String status, Sort sort);

    //Delete By Id
    void deleteById(int id);

    
} 
