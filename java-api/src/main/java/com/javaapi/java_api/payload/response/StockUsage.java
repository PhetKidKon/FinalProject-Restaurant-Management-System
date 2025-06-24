package com.javaapi.java_api.payload.response;
import java.time.LocalDateTime;
import java.util.*;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.product.Transaction;


public class StockUsage {

    private int ingr_id;
    private String ingr_name;
    private double qty_used;
    private double menu_qty_used;
    private LocalDateTime expired;
    
    public StockUsage(double qty_used, LocalDateTime expired) {
        this.qty_used = qty_used;
        this.expired = expired;
    }

    public StockUsage(int ingr_id, String ingr_name, double qty_used, double menu_qty_used, LocalDateTime expired) {
        this.ingr_id = ingr_id;
        this.ingr_name = ingr_name;
        this.qty_used = qty_used;
        this.menu_qty_used = menu_qty_used;
        this.expired = expired;
    }

    public int getIngr_id() {
        return ingr_id;
    }

    public void setIngr_id(int ingr_id) {
        this.ingr_id = ingr_id;
    }

    public String getIngr_name() {
        return ingr_name;
    }

    public void setIngr_name(String ingr_name) {
        this.ingr_name = ingr_name;
    }

    public double getQty_used() {
        return qty_used;
    }

    public void setQty_used(double qty_used) {
        this.qty_used = qty_used;
    }

    public double getMenu_qty_used() {
        return menu_qty_used;
    }

    public void setMenu_qty_used(double menu_qty_used) {
        this.menu_qty_used = menu_qty_used;
    }

    public LocalDateTime getExpired() {
        return expired;
    }

    public void setExpired(LocalDateTime expired) {
        this.expired = expired;
    }

    public Transaction getTransaction(String product_type, Employee employee, int product_id, String product_name, int order_id, int orderitem_id){
        Transaction tran = new Transaction();
        tran.setProductType(product_type);
        tran.setCreated_by(employee);
        tran.setProduct_id(product_id);
        tran.setQty(this.qty_used);
        tran.setExpired(this.expired);
        tran.setTransactionType("outbound");
        tran.setDescription("Order id : "+order_id+" | OrderItem id : "+orderitem_id+" | Menu : "+product_name+" | Qty : "+this.qty_used);
        return tran;
    }

    public Transaction getIngrTransaction(String product_type, Employee employee, int product_id, String product_name, int order_id, int orderitem_id){
        Transaction tran = new Transaction();
        tran.setProductType("ingredient");
        tran.setCreated_by(employee);
        tran.setProduct_id(this.ingr_id);
        tran.setQty(qty_used);
        tran.setExpired(this.expired);
        tran.setTransactionType("outbound");
        tran.setDescription("Order id : "+order_id+" | OrderItem id : "+orderitem_id+" | Menu : "+product_name+
                        " | Qty : "+this.menu_qty_used);
        return tran;
    }

    public Transaction updateTransaction(String product_type, Employee employee, int product_id, String product_name, int order_id, int orderitem_id){
        Transaction tran = new Transaction();
        tran.setProductType(product_type);
        tran.setCreated_by(employee);
        tran.setProduct_id(product_id);
        tran.setQty(this.qty_used);
        tran.setExpired(this.expired);
        tran.setTransactionType("inbound");
        tran.setDescription("Order id : "+order_id+" | OrderItem id : "+orderitem_id+" | Menu : "+product_name+" | Qty : "+this.qty_used);
        return tran;
    }

    public Transaction updateIngrTransaction(String product_type, Employee employee, int product_id, String product_name, int order_id, int orderitem_id){
        Transaction tran = new Transaction();
        tran.setProductType("ingredient");
        tran.setCreated_by(employee);
        tran.setProduct_id(this.ingr_id);
        tran.setQty(qty_used);
        tran.setExpired(this.expired);
        tran.setTransactionType("inbound");
        tran.setDescription("Order id : "+order_id+" | OrderItem id : "+orderitem_id+" | Menu : "+product_name+
                        " | Qty : "+this.menu_qty_used);
        return tran;
    }
    
}