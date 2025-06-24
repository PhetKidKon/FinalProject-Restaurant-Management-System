package com.javaapi.java_api.repository.reservation;

import java.util.*;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.javaapi.java_api.entity.reservation.Order;
import com.javaapi.java_api.entity.reservation.Reservation;
import java.util.List;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer>{

    //Get All Reservation
    List<Reservation> findAll();

    //Find By Id
    Optional<Reservation> findById(int id);

    //Delete By Id
    void deleteById(int id);

    //Find By Status
    List<Reservation> findByStatus(String status, Sort sort);
    
}
