package com.javaapi.java_api.payload.response;

import java.time.LocalDateTime;

public class ResBill {

    private int id;
    private double total_price;
    private String status;
    private LocalDateTime created_date;
    private LocalDateTime payment_date;
    private ResOrder order;

    public ResBill(int id, double total_price, String status, LocalDateTime created_date, LocalDateTime payment_date, ResOrder order) {
        this.id = id;
        this.total_price = total_price;
        this.status = status;
        this.created_date = created_date;
        this.payment_date = payment_date;
        this.order = order;
    }

    public int getId() {
        return id;
    }

    public double getTotal_price() {
        return total_price;
    }

    public String getStatus() {
        return status;
    }

    public String getCreated_date() {
        return this.created_date.getDayOfMonth() + "/" + this.created_date.getMonthValue() + "/" + this.created_date.getYear();
    }

    public String getPayment_date() {
        return this.payment_date.getDayOfMonth() + "/" + this.payment_date.getMonthValue() + "/" + this.payment_date.getYear();
    }

    public ResOrder getOrder() {
        return order;
    }

    public int getCreated_year() {
        return created_date.getYear();
    }


    public int getCreated_month() {
        return created_date.getMonthValue();
    }

    public int getCreated_day() {
        return  created_date.getDayOfMonth();
    }

    public int getPaidYear(){
        if (payment_date == null) {
            return 0;
        }
        return payment_date.getYear();
    }

    public int getPaidMonth() {
        if (payment_date == null) {
            return 0; 
        }
        return payment_date.getMonthValue();
    }

    public int getPaidDay() {
        if (payment_date == null) {
            return 0;
        }
        return payment_date.getDayOfMonth();
    }

    
}
