package com.javaapi.java_api.services.account;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Cashier;
import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.repository.account.EmployeeRepository;

@Service
public class EmployeeService {

    EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository){
        this.employeeRepository=employeeRepository;
    }

    //Behavior

    //Get All Employee
    public List<Employee> getAll(){ return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Employee getById(int id){ return employeeRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee id :" + id + " Not Found")); }
    
    //Get From Email
    public Employee getByEmail(String email){ return employeeRepository.findByAccountEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee email :" + email + " Not Found"));  }

    //Save to Table
    public Employee save(Employee employee){ return employeeRepository.save(employee); }

    //Save to Table
    public Employee saveAndFlush(Employee employee){ return employeeRepository.saveAndFlush(employee); }

    //Delete From Id
    public void deleteById(int id){
        this.getById(id);
        employeeRepository.deleteById(id);
    }
    
}
