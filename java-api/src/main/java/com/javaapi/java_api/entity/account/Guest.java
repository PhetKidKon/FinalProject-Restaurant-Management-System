package com.javaapi.java_api.entity.account;

import com.javaapi.java_api.entity.reservation.Reservation;

import jakarta.persistence.*;

@Entity
public class Guest  extends Customer{

    

    //Constructor

    public Guest() {}

    public Guest(String fname, String lname, String phone) {
        super(fname, lname, phone);
    }


    //Behavior
    

}
