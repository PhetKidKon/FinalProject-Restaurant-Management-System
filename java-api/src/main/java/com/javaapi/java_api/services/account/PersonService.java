package com.javaapi.java_api.services.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

import com.javaapi.java_api.entity.account.Person;
import com.javaapi.java_api.repository.account.PersonRepository;

@Service
public class PersonService {

    PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository){
        this.personRepository = personRepository;
    }

    //Behavior

    //Get All Person
    public List<Person> getAll(){ return personRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Person getById(int id){ return personRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Person id :" + id + " Not Found")); }
    

    //Delete From Id
    public void deleteById(int id){
        this.getById(id);
        personRepository.deleteById(id);
    }
    
}
