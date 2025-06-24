package com.javaapi.java_api.repository.account;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer>{

    //Get All Cashier
    List<Customer> findAll();

    //Find By Id
    Optional<Customer> findById(int id);

    //Delete By Id
    void deleteById(int id);
    
} 
