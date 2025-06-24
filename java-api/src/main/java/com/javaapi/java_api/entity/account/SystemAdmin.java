package com.javaapi.java_api.entity.account;

import jakarta.persistence.*;

@Entity
public class SystemAdmin extends Employee{

    //Constructor

    public SystemAdmin() {}

    public SystemAdmin(String fname, String lname, String phone, Account account) {
        super(fname, lname, phone, account);
    }

    
}
