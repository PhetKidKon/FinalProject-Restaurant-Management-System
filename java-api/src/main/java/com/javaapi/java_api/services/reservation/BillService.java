package com.javaapi.java_api.services.reservation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.reservation.Bill;
import com.javaapi.java_api.entity.reservation.Order;
import com.javaapi.java_api.repository.reservation.BillRepository;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private OrderService orderService;

    public BillService(BillRepository billRepository, OrderService orderService) {
        this.billRepository = billRepository;
        this.orderService = orderService;
    }

    // Get All Bills

    //Get All Order
    public List<Bill> getAll(){ return billRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Bill getById(int id){ return billRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bill id :" + id + " Not Found"));}

    //Get Bill By Status
    public List<Bill> getByStatus(String status){ return billRepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));  }

    //Save to Bill
    public Bill save(Bill bill){ return billRepository.save(bill); }

    //Save to Bill
    public Bill saveAndFlush(Bill bill){ return billRepository.saveAndFlush(bill); }

    
}
