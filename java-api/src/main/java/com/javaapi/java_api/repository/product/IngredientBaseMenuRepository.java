package com.javaapi.java_api.repository.product;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.IngredientBaseMenu;

@Repository
public interface IngredientBaseMenuRepository  extends JpaRepository<IngredientBaseMenu, Integer>{

    //Get All Ingredient Base Menu
    List<IngredientBaseMenu> findAll();

    //Find By Id
    Optional<IngredientBaseMenu> findById(int id);

    //Delete By Id
    void deleteById(int id);

   
}