package com.javaapi.java_api.repository.account;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

import com.javaapi.java_api.entity.account.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer>{

    //Get All Employee
    List<Person> findAll();

    //Find By Id
    Optional<Person> findById(int id);

    
}
