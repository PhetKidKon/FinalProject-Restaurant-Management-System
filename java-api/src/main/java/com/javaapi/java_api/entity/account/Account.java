package com.javaapi.java_api.entity.account;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Embeddable
public class Account {

    private String password;

    private String email;

    private String status;


    //Constructor

    public Account(String password, String email){ 
        this.password=password; 
        this.email=email;
        this.status="active";
    }

    public Account(String password, String email, String status){ 
        this.password=password; 
        this.email=email;
        this.status=status;
    }

    public Account() {}

    //Getter and Setter
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    //Behavior
    
}
