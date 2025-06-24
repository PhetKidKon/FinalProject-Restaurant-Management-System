package com.javaapi.java_api.payload.response;

import java.time.LocalDateTime;
import java.util.*;

import com.javaapi.java_api.entity.product.Stock;

public class ResGetIDReadyMade {

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
    private List<?> stocks;
    private String category_name;

    //Constructor

    public ResGetIDReadyMade(int id, String name, double price, String unit, String status, String description, String imgpath,
            String menu_type, int account_id, String account_email, String account_status, LocalDateTime created_at, List<Stock> stock, String category_name) {
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
        this.stocks = this.createList(stock);
        this.category_name = category_name;
    }

    public ResGetIDReadyMade() {}

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

    public List<?> getStocks(){
        return stocks;
    }


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

    public String getCategory_name() {
        return category_name;
    }

    
    
}
