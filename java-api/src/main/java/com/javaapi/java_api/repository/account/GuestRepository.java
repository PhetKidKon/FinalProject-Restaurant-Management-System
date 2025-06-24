package com.javaapi.java_api.repository.account;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.Guest;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer>{

    //Get All Cashier
    List<Guest> findAll();

    //Find By Id
    Optional<Guest> findById(int id);
    
} 
