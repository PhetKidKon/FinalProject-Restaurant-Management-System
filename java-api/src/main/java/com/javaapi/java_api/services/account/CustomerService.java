package com.javaapi.java_api.services.account;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Customer;
import com.javaapi.java_api.repository.account.CustomerRepository;

@Service
public class CustomerService {

    CustomerRepository customerrepository;

    @Autowired
    public CustomerService(CustomerRepository customerrepository){
        this.customerrepository = customerrepository;
    }

    //Get All Customer
    public List<Customer> getAll(){ return customerrepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Customer getById(int id){ return customerrepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer id :" + id + " Not Found")); }

    //Save to Customer
    public Customer save(Customer customer){ return customerrepository.save(customer); }

    //Save to Customer
    public Customer saveAndFlush(Customer customer){ return customerrepository.saveAndFlush(customer); }

    //Delete From Id
    public void deleteById(int id){
        customerrepository.deleteById(id);
    }
    
}
