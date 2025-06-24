package com.javaapi.java_api.entity.reservation;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private double total_price;
    private String status;
    private String type;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    private LocalDateTime payment_date;

    //Constructor

    public Bill(Order order, double total_price, String status, String type, LocalDateTime payment_date) {
        this.order = order;
        this.total_price = total_price;
        this.status = status;
        this.type = type;
        this.payment_date = payment_date;
    }

    public Bill(Order order, double total_price, String status) {
        this.order = order;
        this.total_price = total_price;
        this.status = status;
    }

    public Bill() {}


    //Getter and Setter

    public int getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    @JsonProperty("created_year")
    public int getCreatedYears(){
        return created_at.getYear()+543;
    }

    @JsonProperty("created_month")
    public int getCreatedMonth(){
        return created_at.getMonthValue();
    }

    @JsonProperty("created_day")
    public int getCreatedDay(){
        return created_at.getDayOfMonth();
    }

    @JsonIgnore
    public int getCreatedHour(){
        return created_at.getHour();
    }

    @JsonIgnore
    public int getCreatedMinute(){
        return created_at.getMinute();
    }

    @JsonProperty("created_date")
    public String getCreatedDate() {
        return this.getCreatedDay()+"/"+this.getCreatedMonth()+"/"+this.getCreatedYears()+" "+this.getCreatedHour()+":"+
        (this.getCreatedMinute()==0 ? "00" : this.getCreatedMinute() < 10 ? "0"+this.getCreatedMinute() :  this.getCreatedMinute());
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    @JsonIgnore
    public LocalDateTime getPayment_date() {
        return payment_date;
    }

    public void setPayment_date(LocalDateTime payment_date) {
        this.payment_date = payment_date;
    }

    @JsonProperty("paid_year")
    public int getPaidYear(){
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getYear();
    }

    @JsonProperty("paid_month")
    public int getPaidMonth(){
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getMonthValue();
    }

    @JsonProperty("paid_day")
    public int getPaidDay(){
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getDayOfMonth();
    }

    @JsonIgnore
    public int getPaidHour(){
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getHour();
    }

    @JsonIgnore
    public int getPaidMinute(){
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getMinute();
    }

    @JsonProperty("paid_date")
    public String getPaidDate() {
        return this.getPaidDay()+"/"+this.getPaidMonth()+"/"+this.getPaidYear()+" "+this.getPaidHour()+":"+
        (this.getPaidMinute()==0 ? "00" : this.getPaidMinute() < 10 ? "0"+this.getPaidMinute() :  this.getPaidMinute());
    }

    
}
