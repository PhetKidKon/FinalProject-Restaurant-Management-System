package com.javaapi.java_api.payload.response;
import java.time.LocalDateTime;
import java.util.*;

public class ResGetTransaction {
    
    private int id;
    private double qty;
    private int product_id;
    private String product_type;
    private String product_name;
    private String transaction_type;
    private String description;
    private int account_id;
    private String account_email;
    private int expired_day;
    private int expired_month;
    private int expired_year;
    private int created_day;
    private int created_month;
    private int created_year;

    //Constructor

    public ResGetTransaction(int id, double qty, int product_id, String product_type, String product_name, String transaction_type,
            String description, int account_id, String account_email, LocalDateTime expired, LocalDateTime created) {
        this.id = id;
        this.qty = qty;
        this.product_id = product_id;
        this.product_type = product_type;
        this.product_name = product_name;
        this.transaction_type = transaction_type;
        this.description = description;
        this.account_id = account_id;
        this.account_email = account_email;
        this.expired_day = expired.getDayOfMonth();
        this.expired_month = expired.getMonthValue();
        this.expired_year = expired.getYear();
        this.created_day = created.getDayOfMonth();
        this.created_month = created.getMonthValue();
        this.created_year = created.getYear();
    }
    
    public ResGetTransaction() {}

    //Getter and Setter

    public int getId() {
        return id;
    }

    public double getQty() {
        return qty;
    }

    public int getProduct_id() {
        return product_id;
    }

    public String getProduct_type() {
        return product_type;
    }

    public String getTransaction_type() {
        return transaction_type;
    }

    public String getDescription() {
        return description;
    }

    public int getAccount_id() {
        return account_id;
    }

    public String getAccount_email() {
        return account_email;
    }

    public String getExpried_date(){
        return this.getExpired_day()+"/"+this.getExpired_month()+"/"+this.getExpired_year();
    }

    public int getExpired_day() {
        return expired_day;
    }

    public int getExpired_month() {
        return expired_month;
    }

    public int getExpired_year() {
        return expired_year;
    }

    public String getCreate_date(){
        return this.getCreated_day()+"/"+this.getCreated_month()+"/"+this.getCreated_year();
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

    public String getProduct_name() {
        return product_name;
    }

    
    
    

}
