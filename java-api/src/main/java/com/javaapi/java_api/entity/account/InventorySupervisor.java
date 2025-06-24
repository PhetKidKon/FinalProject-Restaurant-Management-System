package com.javaapi.java_api.entity.account;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.Stock;

import jakarta.persistence.*;


@Entity
public class InventorySupervisor extends Employee {

    //Constructor

    public InventorySupervisor() {}

    public InventorySupervisor(String fname, String lname, String phone, Account account) {
        super(fname, lname, phone, account);
    }

    //Behavior

    public Ingredients createIngredients(String name, String type, String unit, List<Stock> stock,String status){
        if (stock == null) {
            stock = new ArrayList<>();
        }
        return new Ingredients(name, type, unit, status, stock, this);
    }
    
    
    

}
