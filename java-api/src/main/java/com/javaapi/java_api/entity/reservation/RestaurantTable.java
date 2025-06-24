package com.javaapi.java_api.entity.reservation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.SystemAdmin;
import com.javaapi.java_api.entity.reservation.Reservation;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_table")
public class RestaurantTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "table_name")
    private String name;

    private String status;

    private int capacity;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private SystemAdmin createdby;

    // Constructor

    public RestaurantTable() {}

    public RestaurantTable(String name, String status, int capacity, SystemAdmin createdby) {
        this.name = name;
        this.status = status;
        this.capacity = capacity;
        this.createdby = createdby;
    }


    // Getters and Setters

    public int getId() {
        return id;
    }

    public String getTable_name() {
        return name;
    }

    public void setTable_name(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
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

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public SystemAdmin getCreated_by() {
        return createdby;
    }
    
    public void setCreated_by(SystemAdmin createdby) {
        this.createdby = createdby;
    }

    //Behavior

}

