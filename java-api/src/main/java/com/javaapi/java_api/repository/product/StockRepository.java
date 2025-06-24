package com.javaapi.java_api.repository.product;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer>{

    //Get All Stock
    List<Stock> findAll();

    //Find By Id
    Optional<Stock> findById(int id);

    //Delete By Id
    void deleteById(int id);

} 