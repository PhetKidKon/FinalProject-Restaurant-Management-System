package com.javaapi.java_api.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.Ingredients;

import java.util.*;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredients, Integer>{

    //Get All Ingredients
    List<Ingredients> findAll();

    //Find By Id
    Optional<Ingredients> findById(int id);

    //Delete By Id
    void deleteById(int id);

} 
