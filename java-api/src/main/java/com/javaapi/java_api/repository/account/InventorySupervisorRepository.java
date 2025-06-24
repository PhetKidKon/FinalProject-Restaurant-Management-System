package com.javaapi.java_api.repository.account;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.InventorySupervisor;

import java.util.*;

@Repository
public interface InventorySupervisorRepository extends JpaRepository<InventorySupervisor, Integer>{
    
    //Get All Inventory Supervisor
    List<InventorySupervisor> findAll();

    //Find By Id
    Optional<InventorySupervisor> findById(int id);

    //Find By Email 
    Optional<InventorySupervisor> findByAccountEmail(String email);

} 