package com.javaapi.java_api.payload.response;

import java.time.LocalDateTime;
import java.util.*;

import com.javaapi.java_api.entity.product.MenuIngredient;
import com.javaapi.java_api.entity.product.Stock;

public class ResGetIdIngrbase {

    private int id;
    private String name;
    private double price;
    private String unit;
    private String status;
    private String description;
    private String imgpath;
    private String menu_type;
    private int account_id;
    private String account_email;
    private String account_status;
    private int created_day;
    private int created_month;
    private int created_year;
    private List<ResMenuIngr> ingr_used;
    private String category_name;

    //Constructor

    public ResGetIdIngrbase(int id, String name, double price, String unit, String status, String description, String imgpath,
            String menu_type, int account_id, String account_email, String account_status, LocalDateTime created_at, List<ResMenuIngr> ingr_used, String category_name) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.unit = unit;
        this.status = status;
        this.description = description;
        this.imgpath = imgpath;
        this.menu_type = menu_type;
        this.account_id = account_id;
        this.account_email = account_email;
        this.account_status = account_status;
        this.created_day = created_at.getDayOfMonth();
        this.created_month = created_at.getMonthValue();
        this.created_year = created_at.getYear();
        this.ingr_used = ingr_used;
        this.category_name = category_name;
    }

    public ResGetIdIngrbase() {}

    //Getter

    public int getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public double getPrice() {
        return price;
    }
    public String getUnit() {
        return unit;
    }
    public String getStatus() {
        return status;
    }
    public String getDescription() {
        return description;
    }
    public String getImgpath() {
        return imgpath;
    }
    public String getMenu_type() {
        return menu_type;
    }
    public int getAccount_id() {
        return account_id;
    }
    public String getAccount_email() {
        return account_email;
    }
    public String getAccount_status() {
        return account_status;
    }
    public int getCreated_day() {
        return created_day;
    }
    public int getCreated_month() {
        return created_month;
    }
    public int getCreated_year() {
        return created_year;
    }

    public String getCreate_date(){
        return this.getCreated_day()+"/"+this.getCreated_month()+"/"+this.getCreated_year();
    }

    public List<?> getIngr_used(){
        return ingr_used;
    }

    public String getCategory_name() {
        return category_name;
    }
    
}
