package com.javaapi.java_api.services.account;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.Member;
import com.javaapi.java_api.repository.account.MemberRepository;

@Service
public class MemberService {

    MemberRepository memberrepository;

    @Autowired
    public MemberService(MemberRepository memberrepository){
        this.memberrepository = memberrepository;
    }

    //Behavior

    //Get All Member
    public List<Member> getAll(){ return memberrepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Member getById(int id){ return memberrepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member id :" + id + " Not Found")); }

    //Get From Email
    public Member getByEmail(String email){ return memberrepository.findByAccountEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member email :" + email + " Not Found"));  }

    //Save to Member
    public Member save(Member member){ return memberrepository.save(member); }

    //Save to Member
    public Member saveAndFlush(Member member){ return memberrepository.saveAndFlush(member); }
    
}
