package com.javaapi.java_api.payload.response;

import java.util.*;

import com.javaapi.java_api.entity.product.Stock;

public class ResGetIngredient {
    
    private int id;
    private String name;
    private String unit;
    private int account_id;
    private String account_email;
    private List<?> stocks = new ArrayList<>();
    private double available_qty;

    // Constructor
    public ResGetIngredient(int id, String name, String unit, int account_id, String account_email, List<Stock> stocks, double available_qty) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.account_id = account_id;
        this.account_email = account_email;
        this.stocks = createList(stocks);
        this.available_qty = available_qty;
    }

    public ResGetIngredient() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getAccount_id() {
        return account_id;
    }

    public void setAccount_id(int account_id) {
        this.account_id = account_id;
    }

    public String getAccount_email() {
        return account_email;
    }

    public void setAccount_email(String account_email) {
        this.account_email = account_email;
    }

    public List<?> getStocks() {
        return stocks;
    }

    public void setStocks(List<?> stocks) {
        this.stocks = stocks;
    }

    public double getAvailable_qty() {
        return available_qty;
    }

    public void setAvailable_qty(double available_qty) {
        this.available_qty = available_qty;
    }

    // Getter and Setter

    public List<Map<String, Object>> createList(List<Stock> stocks) {

        List<Map<String, Object>> stockList = new ArrayList<>();

        for(Stock stock : stocks) {
            Map<String, Object> stockMap = new HashMap<>();
            stockMap.put("stock_id", stock.getId());
            stockMap.put("qty", stock.getQty());
            stockMap.put("expired_date", stock.getDay()+"/"+stock.getMonth()+"/"+stock.getYears());
            stockMap.put("expired_year", stock.getYears());
            stockMap.put("expired_month", stock.getMonth());
            stockMap.put("expired_day", stock.getDay());
            stockList.add(stockMap);
        }

        return stockList;
    }


}
