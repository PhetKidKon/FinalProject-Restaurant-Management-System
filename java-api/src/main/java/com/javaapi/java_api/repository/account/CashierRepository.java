package com.javaapi.java_api.repository.account;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.Cashier;
import com.javaapi.java_api.entity.account.Employee;

import java.util.*;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Integer>{
    
    //Get All Cashier
    List<Cashier> findAll();

    //Find By Id
    Optional<Cashier> findById(int id);

    //Find By Email 
    Optional<Cashier> findByAccountEmail(String email);

}
