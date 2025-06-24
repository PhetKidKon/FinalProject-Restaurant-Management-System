package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.InventorySupervisor;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class MenuItem {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    private String name;
    private double price;
    private String category_name;
    private String unit;
    private String status;
    private String description;
    private String imgFilePath;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    @ManyToOne
    @JoinColumn(name="created_by")
    private InventorySupervisor createdby;

    //Constructor

    public MenuItem() {}

    public MenuItem(String name, double price, String category_name, String unit, String status, String description, String imgFilePath, InventorySupervisor createdby) {
        this.name = name;
        this.price = price;
        this.category_name = category_name;
        this.unit = unit;
        this.status = status;
        this.description = description;
        this.imgFilePath = imgFilePath;
        this.createdby = createdby;
    }

    //Getter and Setter

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit){
        this.unit=unit;
    }

    public String getStatus(){
        return this.status;
    }

    public void setStatus(String status){
        this.status=status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgFilePath() {
        return imgFilePath;
    }

    public void setImgFilePath(String imgFilePath) {
        this.imgFilePath = imgFilePath;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    public InventorySupervisor getCreated_by() {
        return createdby;
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

    public String getType(){
        return this.getClass().getSimpleName();
    }

    public String getCategory_name() {
        return category_name;
    }

    public void setCategory_name(String category_name) {
        this.category_name = category_name;
    }

    //Behavior

    

    public String checkType(){
        return getClass().getName();
    }

    public void updatableMenu(String name, double price, String description){
        if(name!="") this.name=name;
        if(price!=0.00) this.price=price;
        if(description!="") this.description=description;
    }

    public double getAvailableStockQty(){
        return 0; 
    }
    
}
