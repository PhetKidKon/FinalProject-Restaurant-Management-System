package com.javaapi.java_api.entity.reservation;

import java.time.LocalDateTime;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.product.MenuItem;

import jakarta.persistence.*;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private MenuItem menuItem;

    private double qty;

    private double total_price;

    private String comment;

    @CreationTimestamp
    private LocalDateTime created_at;

    //Constructor

    public OrderItem(){}

    public OrderItem(MenuItem menuItem, double qty, double total_price, String comment) {
        this.menuItem = menuItem;
        this.qty = qty;
        this.total_price = total_price;
        this.comment = comment;
    }

    //Getter and Setter

    public int getId() {
        return id;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public double getQty() {
        return qty;
    }

    public void setQty(double qty) {
        this.qty = qty;
    }

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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


}
