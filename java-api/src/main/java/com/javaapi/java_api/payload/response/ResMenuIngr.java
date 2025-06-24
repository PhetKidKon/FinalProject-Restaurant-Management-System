package com.javaapi.java_api.payload.response;

public class ResMenuIngr {

    private int menuingr_id;
    private double qty;
    private int ingredient_id;
    private String ingredient_name;
    private double available_stock_qty;

    // Constructor
    public ResMenuIngr(int menuingr_id, double qty, int ingredient_id, String ingredient_name, double available_stock_qty) {
        this.menuingr_id = menuingr_id;
        this.qty = qty;
        this.ingredient_id = ingredient_id;
        this.ingredient_name = ingredient_name;
        this.available_stock_qty = available_stock_qty;
    }

    public ResMenuIngr() {}

    // Getters and Setters
    public int getMenuingr_id() {
        return menuingr_id;
    }

    public double getQty() {
        return qty;
    }
    
    public int getIngredient_id() {
        return ingredient_id;
    }

    public String getIngredient_name() {
        return ingredient_name;
    }

    public double getAvailable_stock_qty() {
        return available_stock_qty;
    }

}
