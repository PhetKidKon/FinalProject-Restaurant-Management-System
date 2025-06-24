package com.javaapi.java_api.entity.account;


import java.time.LocalDateTime;

import com.javaapi.java_api.entity.reservation.Reservation;

import jakarta.persistence.*;


@Entity
public class Cashier extends Employee{

    //Constructor

    public Cashier() {}

    public Cashier(String fname, String lname, String phone, Account account){
        super(fname, lname, phone, account);
    }


    //Behavior

}