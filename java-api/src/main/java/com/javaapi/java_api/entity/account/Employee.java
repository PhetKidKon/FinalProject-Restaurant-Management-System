package com.javaapi.java_api.entity.account;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
public class Employee extends Person{

    @Embedded
    @Column(updatable = false)
    private Account account;

    //Constructor
    
    public Employee() {}

    public Employee(String fname, String lname, String phone,Account account) {
        super(fname, lname, phone);
        this.account=account;
    }


    //Behavior

    public int getId() {
        return super.getId();
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account=account;
    }


    
    
}