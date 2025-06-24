package com.javaapi.java_api.services.account;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.SystemAdmin;
import com.javaapi.java_api.repository.account.SystemAdminRepository;


@Service
public class SystemAdminService {

    SystemAdminRepository systemAdminRepository;

    //Constuctor

    @Autowired
    public SystemAdminService(SystemAdminRepository systemAdminRepository){
        this.systemAdminRepository=systemAdminRepository;
    }

    //Behavior

    //Get All Table System Admin
    public List<SystemAdmin> getAll(){ return systemAdminRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public SystemAdmin getById(int id){ return systemAdminRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "System Admin id :" + id + " Not Found")); }

    //Get From Email
    public SystemAdmin getByEmail(String email){ return systemAdminRepository.findByAccountEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "System Admin id :" + email + " Not Found")); }

    //Save to Table
    public SystemAdmin save(SystemAdmin systemAdmin){ return systemAdminRepository.save(systemAdmin); }

    //Save to Table
    public SystemAdmin saveAndFlush(SystemAdmin systemAdmin){ return systemAdminRepository.saveAndFlush(systemAdmin); }

}
