package com.javaapi.java_api.entity.product;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.javaapi.java_api.entity.account.InventorySupervisor;

import jakarta.persistence.*;


@Entity
public class IngredientBaseMenu extends MenuItem{
    
    @OneToMany(mappedBy = "ingrbaseMenu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuIngredient> ingr_used;

    //Constructor

    public IngredientBaseMenu() {}

    public IngredientBaseMenu(String name, double price, String category_name, String unit, String status, String description, String imgFilePath, InventorySupervisor created_by, List<MenuIngredient> ingr_used){
        super(name,price,category_name,unit,status,description,imgFilePath,created_by);
        this.ingr_used=ingr_used;
    }

    public List<MenuIngredient> getIngr_used() {
        return ingr_used;
    }

    public void setIngr_used(List<MenuIngredient> ingr_used) {
        this.ingr_used = ingr_used;
    }

    //Behavior

    //Add New Stock
    public void addMenuIngredient(MenuIngredient menuIngredient){

        ingr_used.add(menuIngredient);
        menuIngredient.setIngrbaseMenu(this);

    }

    //Remove Stock
    public void removeMenuIngredient(MenuIngredient menuIngredient){

        ingr_used.remove(menuIngredient);
        menuIngredient.setIngrbaseMenu(null);

    }

    //Avaliable Stock Qty
    @Override
    public double getAvailableStockQty(){

        List<Double> ingr_availableqty = new ArrayList<>();

        for(MenuIngredient mi : ingr_used){
            Ingredients ingr = mi.getIngr_used();
            double needQty = mi.getQty();
            double availableingr = ingr.getAvailableStockQty();
            ingr_availableqty.add(availableingr/needQty);
        }

        double total = ingr_availableqty.stream()
                    .mapToDouble(Double::doubleValue)
                    .min()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No available ingredients found"));

        return Math.floor(total);
    }

}
