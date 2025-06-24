package com.javaapi.java_api.services.reservation;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.entity.reservation.Order;
import com.javaapi.java_api.entity.reservation.OrderItem;
import com.javaapi.java_api.repository.reservation.OrderItemRepository;
import com.javaapi.java_api.repository.reservation.OrderRepository;

@Service
public class OrderService {
    
    OrderRepository orderRepository;

    OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository){
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    //Behavior

    //Get All Table Order
    public List<Order> getAll(){ return orderRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Order getById(int id){ return orderRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order id :" + id + " Not Found"));}

    //Get OrderItem By Order Id
    public List<OrderItem> getOrderItemById(int id){
        Order orderItems = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order id :" + id + " Not Found"));
        return orderItems.getOrderItems();
    }

    //
    public List<Order> getByStatus(String status){ return orderRepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));  }

    //Save to Order
    public Order save(Order order){ return orderRepository.save(order); }

    //Save to Order
    public Order saveAndFlush(Order order){ return orderRepository.saveAndFlush(order); }

    //Delete From Id
    public void deleteById(int id){
        orderRepository.deleteById(id);
    }

    //Get OrderItem
    public Order getOrderItem(OrderItem oi, int id){
        Order order = this.getById(id);
        order.getOrderItems().add(oi);
        order.setTotal_price(order.getTotal_price()+oi.getTotal_price());
        return this.save(order);
    }

    //Remove Order
    public Order removeOrderItem(Order order, int orderitem_id){

        boolean ishave=false;
        for(OrderItem oi : order.getOrderItems()){
            if(oi.getId()==orderitem_id){
                order.setTotal_price(order.getTotal_price()-oi.getTotal_price());
                order.getOrderItems().remove(oi);
                ishave=true;
                break;
            }
        }

        if(!ishave){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Error : Cannot find Order Item id : "+orderitem_id+" From Order id : "+order.getId());
        }

        return this.saveAndFlush(order);
    }


}
