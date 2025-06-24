package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    double qty;

    LocalDateTime expired;

    @ManyToOne
    @JoinColumn(name = "ingr_id")
    Ingredients ingr;

    @ManyToOne
    @JoinColumn(name = "readymademenu_id")
    ReadyMadeMenu readyMadeMenu;

    //Constructor

    public Stock(double qty, LocalDateTime expired){
        this.qty = qty;
        this.expired = expired;
    }

    public Stock(){}

    //Getters and Setters

    public int getId(){
        return id;
    }

    public double getQty() {
        return qty;
    }

    public void setQty(double qty) {
        this.qty = qty;
    }

    @JsonIgnore
    public LocalDateTime getExpired() {
        return expired;
    }

    @JsonProperty("expired_date")
    public String getExpired_Date(){
        return this.getDay()+"/"+this.getMonth()+"/"+this.getYears();
    }

    @JsonProperty("expired_year")
    public int getYears(){
        return expired.getYear();
    }

    @JsonProperty("expired_month")
    public int getMonth(){
        return expired.getMonthValue();
    }

    @JsonProperty("expried_day")
    public int getDay(){
        return expired.getDayOfMonth();
    }

    public void setExpired(LocalDateTime expired) {
        this.expired = expired;
    }

    @JsonIgnore
    public Ingredients getIngr() {
        return ingr;
    }

    public void setIngr(Ingredients ingr) {
        this.ingr = ingr;
    }

    @JsonIgnore
    public ReadyMadeMenu getReadyMadeMenu() {
        return readyMadeMenu;
    }

    public void setReadyMadeMenu(ReadyMadeMenu readyMadeMenu) {
        this.readyMadeMenu = readyMadeMenu;
    }
    
    //Behavior

    public void increaseQty(double increaseQty){
        this.qty+=increaseQty;
    }

    public boolean decreaseQty(double decreaseQty){
        if(this.qty>=decreaseQty){
            this.qty-=decreaseQty;
            return true;
        }else{
            return false;
        }
    }


}
