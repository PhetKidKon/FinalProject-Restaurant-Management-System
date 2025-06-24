package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.InventorySupervisor;

import jakarta.persistence.*;

@Entity
public class Ingredients {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    private String name;
    private String type;
    private String unit;
    private String status;

    @OneToMany(mappedBy = "ingr", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stock> stock;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;


    @ManyToOne
    @JoinColumn(name = "created_by")
    private InventorySupervisor createdby;

    //Constructor

    public Ingredients() {}

    public Ingredients(String name, String type, String unit, String status, List<Stock> stock,InventorySupervisor createdby) {
        this.name = name;
        this.type = type;
        this.unit= unit;
        this.status = status;
        this.stock = stock;
        this.createdby = createdby;
    }

    //Getter And Setter

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Stock> getStock() {
        return stock;
    }

    public void setStock(List<Stock> stock) {
        this.stock = stock;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    @JsonProperty("created_date")
    public String getCreated_Date(){
        return this.getDay()+"/"+this.getMonth()+"/"+this.getYears();
    }

    @JsonProperty("year")
    public int getYears(){
        return created_at.getYear()+543;
    }

    @JsonProperty("month")
    public int getMonth(){
        return created_at.getMonthValue();
    }

    @JsonProperty("day")
    public int getDay(){
        return created_at.getDayOfMonth();
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public InventorySupervisor getCreated_by() {
        return createdby;
    }

    public void setCreated_by(InventorySupervisor createdby) {
        this.createdby = createdby;
    }

    //Behavior

    //Add New Stock
    public void addNewStock(Stock stock){

        this.stock.add(stock);
        stock.setIngr(this);

    }

    //Remove Stock
    public void removeStock(Stock stockItem){

        this.stock.remove(stockItem);
        stockItem.setIngr(null);

    }

    //Avaliable Stock Qty
    public double getAvailableStockQty(){

        if(stock == null) return 0;
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nowbe = LocalDateTime.of(now.getYear()+543, now.getMonthValue(), now.getDayOfMonth(),
                                            now.getHour(), now.getMinute(), now.getSecond());
        
        return stock.stream()
                .filter(s -> s.getExpired() != null && s.getExpired().isAfter(nowbe) )
                .mapToDouble(Stock::getQty)
                .sum();

    }

}
