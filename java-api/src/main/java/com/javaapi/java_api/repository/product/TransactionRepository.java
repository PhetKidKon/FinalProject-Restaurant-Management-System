package com.javaapi.java_api.repository.product;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.Transaction;
import java.util.List;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer>{

    //Get All Transaction
    List<Transaction> findAll();

    //Find By Id
    Optional<Transaction> findById(int id);

    //Delete By Id
    void deleteById(int id);

    //Find By Containing Descrption
    List<Transaction> findByDescriptionContainingIgnoreCase(String description);
    
} 