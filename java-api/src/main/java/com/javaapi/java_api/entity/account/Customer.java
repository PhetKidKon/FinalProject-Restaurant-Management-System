package com.javaapi.java_api.entity.account;

import com.javaapi.java_api.entity.reservation.Reservation;

import jakarta.persistence.*;

@Entity

public class Customer extends Person{

    //Constructor

    public Customer(String fname, String lname, String phone) {
        super(fname, lname, phone);
    }

    public Customer() {}

    //Behavior
    
}
