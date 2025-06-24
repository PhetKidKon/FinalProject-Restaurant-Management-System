package com.javaapi.java_api.repository.product;

import java.util.*;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.MenuItem;
import java.util.List;



@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer>{
    
    //Get All MenuItem
    List<MenuItem> findAll();

    //Find By Id
    Optional<MenuItem> findById(int id);

    //Get All Available MenuItem
    List<MenuItem> findByStatus(String status, Sort sort);

    //Delete By Id
    void deleteById(int id);

}
