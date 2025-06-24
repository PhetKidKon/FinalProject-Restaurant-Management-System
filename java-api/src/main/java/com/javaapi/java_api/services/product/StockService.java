package com.javaapi.java_api.services.product;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.repository.product.StockRepository;

@Service
public class StockService {

    StockRepository stockRepository;

    @Autowired
    public StockService(StockRepository stockRepository){
        this.stockRepository = stockRepository;
    }

    public StockService(){}

    //Behavior

    //Get All Table Stock
    public List<Stock> getAll(){ return stockRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Stock getById(int id){ return stockRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu id :" + id + " Not Found"));}

    //Save to Stock Table
    public Stock save(Stock stock){ return stockRepository.save(stock); }

    //Update to Stock Table
    public Stock updateInfo(int id, double qty, int exp_year, int exp_month, int exp_day){
        Stock stock = getById(id);

        stock.setQty(qty);
        stock.setExpired(LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0));

        
        return stockRepository.save(stock);
    }

    //Delete From Id
    public void deleteById(int id){
        stockRepository.deleteById(id);
    }
    
}
