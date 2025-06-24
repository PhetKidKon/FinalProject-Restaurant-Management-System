package com.javaapi.java_api.services.account;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Cashier;
import com.javaapi.java_api.repository.account.CashierRepository;


@Service
public class CashierService {

    CashierRepository cashierRepository;

    //Constuctor

    @Autowired
    public CashierService(CashierRepository cashierRepository){
        this.cashierRepository=cashierRepository;
    }

    //Behavior

    //Get All Table System Admin
    public List<Cashier> getAll(){ return cashierRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Cashier getById(int id){ return cashierRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cashier id :" + id + " Not Found")); }

    //Get From Email
    public Cashier getByEmail(String email){ return cashierRepository.findByAccountEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cashier Email :" + email + " Not Found")); }

    //Save to Table
    public Cashier save(Cashier cashier){ return cashierRepository.save(cashier); }

    //Save to Table
    public Cashier saveAndFlush(Cashier cashier){ return cashierRepository.saveAndFlush(cashier); }

    //Create Order
    

}
