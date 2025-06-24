package com.javaapi.java_api.services.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.reservation.OrderItem;
import com.javaapi.java_api.repository.reservation.OrderItemRepository;

import java.util.*;

@Service
public class OrderItemService {

    OrderItemRepository orderitemRepository;

    @Autowired
    public OrderItemService(OrderItemRepository orderitemRepository){
        this.orderitemRepository = orderitemRepository;
    }

    //Behavior

    //Get All Table Order Item
    public List<OrderItem> getAll(){ return orderitemRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public OrderItem getById(int id){ return orderitemRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order id :" + id + " Not Found"));}

    //Save to Order
    public OrderItem save(OrderItem menuItem){ return orderitemRepository.save(menuItem); }

    //Save to Order
    public OrderItem saveAndFlush(OrderItem menuItem){ return orderitemRepository.saveAndFlush(menuItem); }

    //Delete From Id
    public void deleteById(int id){
        orderitemRepository.deleteById(id);
    
    }
}
