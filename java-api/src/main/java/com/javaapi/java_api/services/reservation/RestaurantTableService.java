package com.javaapi.java_api.services.reservation;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.reservation.RestaurantTable;
import com.javaapi.java_api.repository.reservation.RestaurantTableRepository;

@Service
public class RestaurantTableService {

    RestaurantTableRepository restablerepository;

    @Autowired
    public RestaurantTableService(RestaurantTableRepository restaurantTableRepository){
        this.restablerepository = restaurantTableRepository;
    }

    //Behavior

    //Get All Table Restaurant Table
    public List<RestaurantTable> getAll(){ return restablerepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public RestaurantTable getById(int id){ return restablerepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant Table id :" + id + " Not Found"));}

    //Get From Table name
    public RestaurantTable getByTableName(String tablename){ return restablerepository.findByName(tablename) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant Table id :" + tablename + " Not Found"));}


    //Save to RestaurantTable 
    public RestaurantTable save(RestaurantTable table){ return restablerepository.save(table); }

    //Save to RestaurantTable 
    public RestaurantTable saveAndFlush(RestaurantTable table){ return restablerepository.saveAndFlush(table); }

    //Delete From Id
    public void deleteById(int id){
        restablerepository.deleteById(id);
    }
    
}
