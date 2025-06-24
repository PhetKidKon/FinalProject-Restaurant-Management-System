package com.javaapi.java_api.payload.response;

public class ResOrderItem {

    private int orderitem_id;
    private String name;
    private String unit;
    private String description;
    private double qty;
    private double total_price;
    private double priceperitem;
    private String comment;
    private int created_day;
    private int created_month;
    private int created_year;
    
    public ResOrderItem(int orderitem_id, String name, String unit, String description, double qty, double total_price,
            double priceperitem, String comment, int created_day, int created_month, int created_year) {
        this.orderitem_id = orderitem_id;
        this.name = name;
        this.unit = unit;
        this.description = description;
        this.qty = qty;
        this.total_price = total_price;
        this.priceperitem = priceperitem;
        this.comment = comment;
        this.created_day = created_day;
        this.created_month = created_month;
        this.created_year = created_year;
    }

    public int getOrderitem_id() {
        return orderitem_id;
    }

    public String getName() {
        return name;
    }

    public String getUnit() {
        return unit;
    }

    public String getDescription() {
        return description;
    }

    public double getQty() {
        return qty;
    }

    public double getTotal_price() {
        return total_price;
    }

    public double getPriceperitem() {
        return priceperitem;
    }

    public String getComment() {
        return comment;
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

    public String getCreated_date(){
        return this.getCreated_day()+"/"+this.getCreated_month()+"/"+this.getCreated_year();
    }
    
}
