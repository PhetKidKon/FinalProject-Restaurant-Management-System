package com.javaapi.java_api.entity.account;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import java.time.chrono.ThaiBuddhistDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    private String fname;
    private String lname;
    private String phone;

    @CreationTimestamp
    private LocalDateTime created_at;

    //Constructor
    
    public Person(String fname, String lname, String phone){ 
        this.fname=fname; 
        this.lname=lname; 
        this.phone=phone;
    }

    public Person(){}

    // Getter and Setter

    public int getId() {
        return id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @JsonIgnore
    public LocalDateTime getCreated_by() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    public void setCreated_by(LocalDateTime created_at) {
        this.created_at = created_at;
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

    public String getRole(){
        return this.getClass().getSimpleName();
    }


}
