package com.javaapi.java_api.payload.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.javaapi.java_api.entity.reservation.OrderItem;

public class ResOrder {

    private int order_id;
    private int customer_id;
    private String customer_role;
    private String customer_fname;
    private String customer_lname;
    private String customer_phone;
    private String status;
    private double total_price;
    private int cashier_id;
    private String cashier_name;
    private String cashier_email;
    private int reserve_id;
    private int table_id;
    private String table_name;
    private List<ResOrderItem> orderitems;
    private int created_year;
    private int created_month;
    private int created_day;

    

    public ResOrder(int order_id, int customer_id, String customer_role, String customer_fname, String customer_lname, String customer_phone, String status, double total_price, int cashier_id,
            String cashier_name, String cashier_email, int reserve_id, int table_id, String table_name, List<OrderItem> orderitems,
            int created_year, int created_month, int created_day) {
            this.order_id = order_id;
            this.customer_id = customer_id;
            this.customer_role = customer_role;
            this.customer_fname = customer_fname;
            this.customer_lname = customer_lname;
            this.customer_phone = customer_phone;
            this.status = status;
            this.total_price = total_price;
            this.cashier_id = cashier_id;
            this.cashier_name = cashier_name;
            this.cashier_email = cashier_email;
            this.reserve_id = reserve_id;
            this.table_id = table_id;
            this.table_name = table_name;
            this.orderitems = this.OrderItemToRes(orderitems);
            this.created_year = created_year;
            this.created_month = created_month;
            this.created_day = created_day;
    }

    public int getOrder_id() {
        return order_id;
    }

    public int getCustomer_id() {
        return customer_id;
    }

    public String getCustomer_role(){
        return customer_role;
    }

    public String getCustomer_fname(){
        return customer_fname;
    }

    public String getCustomer_lname(){
        return customer_lname;
    }

    public String getCustomer_phone() {
        return customer_phone;
    }

    public String getStatus() {
        return status;
    }

    public double getTotal_price() {
        return total_price;
    }

    public int getCashier_id() {
        return cashier_id;
    }

    public String getCashier_name() {
        return cashier_name;
    }

    public String getCashier_email() {
        return cashier_email;
    }

    public int getReserve_id() {
        return reserve_id;
    }

    public int getTable_id() {
        return table_id;
    }

    public String getTable_name() {
        return table_name;
    }

    public List<ResOrderItem> getOrderitems() {
        return orderitems;
    }

    public int getCreated_year() {
        return created_year;
    }


    public int getCreated_month() {
        return created_month;
    }

    public int getCreated_day() {
        return created_day;
    }

    public String getCreated_date(){
        return this.getCreated_day()+"/"+this.getCreated_month()+"/"+this.getCreated_year();
    }

    public List<ResOrderItem> OrderItemToRes(List<OrderItem> new_orderItems){
        List<ResOrderItem> res_oi = new ArrayList<>();
        for(OrderItem oi : new_orderItems){
            ResOrderItem new_orderitem = new ResOrderItem(oi.getId(), oi.getMenuItem().getName(), oi.getMenuItem().getUnit(),
            oi.getMenuItem().getDescription(), oi.getQty(), oi.getTotal_price(), oi.getMenuItem().getPrice(), oi.getComment(),
            oi.getDay(), oi.getMonth(), oi.getYears());
            res_oi.add(new_orderitem);
        }
        return res_oi;
    }
    
}
