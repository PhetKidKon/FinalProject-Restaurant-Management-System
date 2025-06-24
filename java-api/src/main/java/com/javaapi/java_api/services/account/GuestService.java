package com.javaapi.java_api.services.account;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Guest;
import com.javaapi.java_api.repository.account.GuestRepository;

@Service
public class GuestService {

    GuestRepository guestrepository;

    @Autowired
    public GuestService(GuestRepository guestrepository){
        this.guestrepository = guestrepository;
    }

    //Behavior

    //Get All Employee
    public List<Guest> getAll(){ return guestrepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Guest getById(int id){ return guestrepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guest id :" + id + " Not Found")); }

    //Save to Guest
    public Guest save(Guest guest){ return guestrepository.save(guest); }

    //Save And Flush to Guest
    public Guest saveAndFlush(Guest guest){ return guestrepository.saveAndFlush(guest); }

    public Guest createWithoutInput(){
        Guest guest = new Guest(null, null, null);
        return guestrepository.save(guest);
    }
    
}
