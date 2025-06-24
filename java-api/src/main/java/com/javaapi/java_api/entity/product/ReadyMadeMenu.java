package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.InventorySupervisor;

import jakarta.persistence.*;


@Entity
public class ReadyMadeMenu extends MenuItem{

    @OneToMany(mappedBy = "readyMadeMenu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stock> stock;

    //Constructor

    public ReadyMadeMenu() {}

    public ReadyMadeMenu(String name, double price, String category_name,String unit, String status, String description, String imgFilePath, InventorySupervisor created_by, List<Stock> stock){
        super(name,price,category_name,unit,status,description,imgFilePath,created_by);
        this.stock=stock;
    }

    //Getter and Setter

    public List<Stock> getStock() {
        return stock;
    }

    public void setStock(List<Stock> stock) {
        this.stock = stock;
    }
    
    
    //Behavior

    //Add New Stock
    public void addNewStock(Stock stock){

        this.stock.add(stock);
        stock.setReadyMadeMenu(this);

    }

    //Remove Stock
    public void removeStock(Stock stock){

        this.stock.remove(stock);
        stock.setReadyMadeMenu(null);

    }

    //Avaliable Stock Qty
    @Override
    public double getAvailableStockQty(){

        if(stock == null) return 0;
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nowbe = now.plusYears(543);
        
        double total = stock.stream()
                .filter(s -> s.getExpired() != null && s.getExpired().isAfter(nowbe) )
                .mapToDouble(Stock::getQty)
                .sum();

        return Math.floor(total);

    }
    
}
