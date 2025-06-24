package com.javaapi.java_api.repository.account;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.SystemAdmin;

import java.util.*;

@Repository
public interface SystemAdminRepository extends JpaRepository<SystemAdmin, Integer>{
    
    //Find All System Admin
    List<SystemAdmin> findAll();

    //Find By Email
    Optional<SystemAdmin> findById(int id);

    //Find By Email 
    Optional<SystemAdmin> findByAccountEmail(String email);

} 