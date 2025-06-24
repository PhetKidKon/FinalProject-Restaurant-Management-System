package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.InventorySupervisor;

import jakarta.persistence.*;

@Entity
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    private double qty;

    private String productType;

    private int product_id;

    private String transactionType;
    
    private String description;

    private LocalDateTime expired;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    @ManyToOne
    @JoinColumn(name="created_by")
    private Employee createdby;

    public Transaction(double qty, String productType, int product_id, String transactionType, String description, LocalDateTime expired, Employee createdby) {
        this.qty = qty;
        this.productType=productType;
        this.product_id=product_id;
        this.transactionType=transactionType;
        this.description = description;
        this.expired = expired;
        this.createdby = createdby;
    }

    public Transaction(){}

    //Getter and Setter

    public int getId() {
        return id;
    }

    public double getQty() {
        return qty;
    }

    public void setQty(double qty) {
        this.qty = qty;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public int getProduct_id(){
        return product_id;
    }

    public void setProduct_id(int product_id){
        this.product_id=product_id;
    }

    public String getTransactionType(){
        return transactionType;
    }

    public void setTransactionType(String transactionType){
        this.transactionType=transactionType;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description=description;
    }

    @JsonIgnore
    public LocalDateTime getExpired() {
        return expired;
    }

    public void setExpired(LocalDateTime expired) {
        this.expired = expired;
    }

    @JsonProperty("expired_date")
    public String getExpired_Date(){
        return this.getExpiredDay()+"/"+this.getExpiredMonth()+"/"+this.getExpiredYears();
    }

    @JsonProperty("expired_year")
    public int getExpiredYears(){
        return expired.getYear();
    }

    @JsonProperty("expired_month")
    public int getExpiredMonth(){
        return expired.getMonthValue();
    }

    @JsonProperty("expired_day")
    public int getExpiredDay(){
        return expired.getDayOfMonth();
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    @JsonProperty("created_date")
    public String getCreated_Date(){
        return this.getCreatedDay()+"/"+this.getCreatedMonth()+"/"+this.getCreatedYears();
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

    public Employee getCreated_by() {
        return createdby;
    }

    public void setCreated_by(Employee createdby) {
        this.createdby = createdby;
    }

    //Behavior

    public Stock addStock(){
        return new Stock(qty, expired);
    }

}
