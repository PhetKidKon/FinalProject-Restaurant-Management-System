package com.javaapi.java_api.services.account;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.repository.account.InventorySupervisorRepository;




@Service
public class InventorySupervisorService {
    
    InventorySupervisorRepository InventorySupervisorRepo;

    //Constructor

    @Autowired
    public InventorySupervisorService(InventorySupervisorRepository InventorySupervisorRepo){
        this.InventorySupervisorRepo=InventorySupervisorRepo;
    }

    //Behavior

    //Get All Table InventorySupervisor Detail
    public List<InventorySupervisor> getAll(){ return InventorySupervisorRepo.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From id
    public InventorySupervisor getByid(int id){ return InventorySupervisorRepo.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory Supervisor id :" + id + " Not Found")); }

    //Get From Email
    public InventorySupervisor getByEmail(String email){ return InventorySupervisorRepo.findByAccountEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory Supervisor id :" + email + " Not Found")); }
    

    //Save to Table
    public InventorySupervisor save(InventorySupervisor inventorySupervisor){ return InventorySupervisorRepo.save(inventorySupervisor); }

    //Save to Table
    public InventorySupervisor saveAndFlush(InventorySupervisor inventorySupervisor){ return InventorySupervisorRepo.saveAndFlush(inventorySupervisor); }


}
