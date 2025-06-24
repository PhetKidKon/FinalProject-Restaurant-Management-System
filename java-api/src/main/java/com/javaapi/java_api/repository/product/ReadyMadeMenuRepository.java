package com.javaapi.java_api.repository.product;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.product.ReadyMadeMenu;

@Repository
public interface ReadyMadeMenuRepository extends JpaRepository<ReadyMadeMenu, Integer>{

    //Get All Ready Made Menu
    List<ReadyMadeMenu> findAll();

    //Find By Id
    Optional<ReadyMadeMenu> findById(int id);

    //Delete By Id
    void deleteById(int id);

}