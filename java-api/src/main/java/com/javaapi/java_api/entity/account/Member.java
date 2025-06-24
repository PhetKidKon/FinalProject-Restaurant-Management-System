package com.javaapi.java_api.entity.account;

import com.javaapi.java_api.entity.reservation.Reservation;

import jakarta.persistence.*;


@Entity

public class Member extends Customer{

    @Embedded
    @Column(updatable = false)
    private Account account;

    private double point;

    //Constructor

    public Member() {}

    public Member(String fname, String lname, String phone, double point, Account account) {
        super(fname, lname, phone);
        this.account = account;
        this.point = point;
    }

    public Member(String fname, String lname, String phone, Account account) {
        super(fname, lname, phone);
        this.account = account;
        this.point = 0;
    }

    //Getter and Setter

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account=account;
    }

    public double getPoint() {
        return point;
    }

    public void setPoint(double point) {
        this.point = point;
    }

    //Behavior

    
}
