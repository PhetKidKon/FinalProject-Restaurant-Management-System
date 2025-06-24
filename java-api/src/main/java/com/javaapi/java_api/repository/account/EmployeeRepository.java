package com.javaapi.java_api.repository.account;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.Employee;

import java.util.*;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer>{
    
    //Get All Employee
    List<Employee> findAll();

    //Find By Id
    Optional<Employee> findById(int id);

    //Find By Email 
    Optional<Employee> findByAccountEmail(String email);

    //Delete By Id
    void deleteById(int id);

    
} 
