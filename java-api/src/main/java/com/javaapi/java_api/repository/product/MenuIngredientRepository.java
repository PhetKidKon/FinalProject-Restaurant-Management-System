package com.javaapi.java_api.repository.product;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.MenuIngredient;

@Repository
public interface MenuIngredientRepository extends JpaRepository<MenuIngredient, Integer>{

    //Get All Menu Ingredient
    List<MenuIngredient> findAll();

    //Find By Id
    Optional<MenuIngredient> findById(int id);

    //Delete By Id
    void deleteById(int id);
    
} 
