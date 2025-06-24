package com.javaapi.java_api.repository.reservation;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.reservation.RestaurantTable;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {

    //Get All Table
    List<RestaurantTable> findAll();

    //Find By Id
    Optional<RestaurantTable> findById(int id);

    //Find By Name
    Optional<RestaurantTable> findByName(String name);

    //Delete By Id
    void deleteById(int id);
    
}
