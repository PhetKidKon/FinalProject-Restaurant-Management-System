package com.javaapi.java_api.entity.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
public class MenuIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", insertable = false, updatable = false, nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "ingrbase_id")
    IngredientBaseMenu ingrbaseMenu;
    
    @ManyToOne
    @JoinColumn(name = "ingr_id")
    private Ingredients ingr_used;
    
    private double qty;

    //Constructor

    public MenuIngredient(Ingredients ingr_used, double qty) {
        this.ingr_used = ingr_used;
        this.qty = qty;
    }

    public MenuIngredient(){}

    //Getters and Setters

    public int getId(){
        return this.id;
    }

    @JsonIgnore
    public Ingredients getIngr_used() {
        return this.ingr_used;
    }

    @JsonProperty("ingredient_id")
    public int getIngr_used_id(){
        return ingr_used.getId();
    }

    @JsonProperty("ingredient_name")
    public String getIngr_used_name(){
        return ingr_used.getName();
    }

    public void setIngr_used(Ingredients ingr_used) {
        this.ingr_used = ingr_used;
    }

    public double getQty() {
        return this.qty;
    }


    public void setQty(double qty) {
        this.qty = qty;
    }

    @JsonIgnore
    public IngredientBaseMenu getIngrbaseMenu() {
        return ingrbaseMenu;
    }

    public void setIngrbaseMenu(IngredientBaseMenu ingrbaseMenu) {
        this.ingrbaseMenu = ingrbaseMenu;
    }

    

}
