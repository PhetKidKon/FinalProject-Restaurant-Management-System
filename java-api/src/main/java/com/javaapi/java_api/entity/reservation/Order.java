package com.javaapi.java_api.entity.reservation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.Cashier;
import com.javaapi.java_api.entity.product.Stock;

import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(cascade =  CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;

    private double total_price;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private RestaurantTable table;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    private String status;

    @CreationTimestamp
    private LocalDateTime created_at;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private Cashier createdby;

    // Constructor

    public Order() {}

    public Order(double total_price, RestaurantTable table, Reservation reservation, Cashier created_by) {
        this.total_price = total_price;
        this.reservation = reservation;
        this.table = table;
        this.createdby = created_by;
    }

    public Order(List<OrderItem> orderItems, RestaurantTable table, Reservation reservation, Cashier created_by) {
        this.orderItems = orderItems;
        this.total_price = 0;
        this.reservation = reservation;
        this.table = table;
        this.status = "received";
        this.createdby = created_by;
    }

    public Order(List<OrderItem> orderItems, double total_price, RestaurantTable table, Reservation reservation, String status, Cashier created_by) {
        this.orderItems = orderItems;
        this.total_price = total_price;
        this.reservation = reservation;
        this.table = table;
        this.status = status;
        this.createdby = created_by;
    }

    public int getId() {
        return id;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    @JsonProperty("year")
    public int getYears(){
        return created_at.getYear()+543;
    }

    @JsonProperty("month")
    public int getMonth(){
        return created_at.getMonthValue();
    }

    @JsonProperty("day")
    public int getDay(){
        return created_at.getDayOfMonth();
    }

    public Cashier getCreated_by() {
        return createdby;
    }

    public void setCreated_by(Cashier createdby) {
        this.createdby = createdby;
    }
    
}
