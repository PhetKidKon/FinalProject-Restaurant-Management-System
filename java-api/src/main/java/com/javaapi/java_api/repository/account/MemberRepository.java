package com.javaapi.java_api.repository.account;


import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.account.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer>{

    //Get All Cashier
    List<Member> findAll();

    //Find By Id
    Optional<Member> findById(int id);

    //Find By Email
    Optional<Member> findByAccountEmail(String email);

    //Delete By Id
    void deleteById(int id);
    
} 