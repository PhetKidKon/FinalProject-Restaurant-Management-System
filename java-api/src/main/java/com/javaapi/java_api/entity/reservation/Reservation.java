package com.javaapi.java_api.entity.reservation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaapi.java_api.entity.account.Customer;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "reservation")
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    private String status;

    private int people_count;


    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    private LocalDateTime checkInTime;

    // Constructor
    public Reservation() {}

    public Reservation(int people_count, Customer customer, LocalDateTime checkInTime) {
        this.status = "";
        this.people_count = people_count;
        this.customer = customer;
        this.checkInTime = checkInTime;
    }

    public Reservation(String status, int people_count, Customer customer, LocalDateTime checkInTime) {
        this.status = status;
        this.people_count = people_count;
        this.customer = customer;
        this.checkInTime = checkInTime;
    }


    // Getters and Setters

    public int getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getPeople_count() {
        return people_count;
    }

    public void setPeople_count(int people_count) {
        this.people_count = people_count;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        LocalDateTime created_date = created_at.withYear(created_at.getYear() + 543);
        return created_date;
    }

    @JsonProperty("created_year")
    public int getCreated_Years(){
        return created_at.getYear()+543;
    }

    @JsonProperty("created_month")
    public int getCreated_Month(){
        return created_at.getMonthValue();
    }

    @JsonProperty("created_day")
    public int getCreated_Day(){
        return created_at.getDayOfMonth();
    }

    @JsonProperty("created_date")
    public String getCreated_Date(){
        return this.getCreated_Day()+"/" + this.getCreated_Month()+ "/" +this.getCreated_Years() + " " + this.getCreated_at().getHour() +
        ":" + this.getCreated_at().getMinute();
    }

    @JsonIgnore
    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    @JsonProperty("checkin_year")
    public int getCheckin_Years(){
        return checkInTime.getYear()+543;
    }

    @JsonProperty("checkin_month")
    public int getCheckin_Month(){
        return checkInTime.getMonthValue();
    }

    @JsonProperty("checkin_day")
    public int getCheckin_Day(){
        return checkInTime.getDayOfMonth();
    }

    @JsonProperty("checkin_date")
    public String getCheckin_Date(){
        return this.getCheckin_Day()+"/" + this.getCheckin_Month()+ "/" +this.getCheckin_Years()+" " + this.getCheckInTime().getHour() + 
        ":" + this.getCheckInTime().getMinute();
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    // Getters and Setters
    

}
