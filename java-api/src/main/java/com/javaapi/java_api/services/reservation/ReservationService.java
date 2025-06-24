package com.javaapi.java_api.services.reservation;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.reservation.Reservation;
import com.javaapi.java_api.repository.reservation.ReservationRepository;

@Service
public class ReservationService {

    ReservationRepository reservationrepository;

    @Autowired
    public ReservationService(ReservationRepository reservationrepository){
        this.reservationrepository = reservationrepository;
    }

    //Behavior

    //Get All Table Reservation
    public List<Reservation> getAll(){ return reservationrepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Reservation getById(int id){ return reservationrepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation id :" + id + " Not Found"));}

    //Get From Status
    public List<Reservation> getByStatus(String status){
        List<Reservation> reservations = reservationrepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));
        return reservations;
    }

    //Save to Reservation 
    public Reservation save(Reservation table){ return reservationrepository.save(table); }

    //Save to Reservation 
    public Reservation saveAndFlush(Reservation table){ return reservationrepository.saveAndFlush(table); }

    //Delete From Id
    public void deleteById(int id){
        reservationrepository.deleteById(id);
    }
    
}
