package com.javaapi.java_api.services.product;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.ReadyMadeMenu;
import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.entity.product.Transaction;
import com.javaapi.java_api.payload.response.StockUsage;
import com.javaapi.java_api.repository.product.ReadyMadeMenuRepository;
import com.javaapi.java_api.repository.product.StockRepository;
import com.javaapi.java_api.repository.product.TransactionRepository;

@Service
public class ReadyMadeMenuService {
    
    ReadyMadeMenuRepository readymademenuRepository;

    StockRepository stockRepository;

    TransactionRepository transactionRepository;

    @Autowired
    public ReadyMadeMenuService(ReadyMadeMenuRepository readymademenuRepository, StockRepository stockRepository, TransactionRepository transactionRepository){
        this.readymademenuRepository = readymademenuRepository;
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
    }

    public ReadyMadeMenuService(){}

    //Behavior

    //Get All Table ReadyMadeMenu
    public List<ReadyMadeMenu> getAll(){ return readymademenuRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public ReadyMadeMenu getById(int id){ return readymademenuRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ready Made Menu id :" + id + " Not Found"));}

    //Save to ReadyMadeMenu Table
    public ReadyMadeMenu save(ReadyMadeMenu menuItem){ return readymademenuRepository.save(menuItem); }

    //Delete From Id
    public void deleteById(int id){
        ReadyMadeMenu readyMadeMenu = this.getById(id);

        //Delete Stock
        for(Stock i : readyMadeMenu.getStock()){
            stockRepository.delete(i);
        }

        readymademenuRepository.deleteById(id);
    }

    public Stock getStockById(int readymade_id, int stock_id) {
        ReadyMadeMenu menu = this.getById(readymade_id);
        for (Stock stock : menu.getStock()) {
            if (stock.getId() == stock_id) {
                return stock;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock id: " + stock_id + " not found in ReadyMadeMenu id: " + readymade_id);
    }

    //Add Stock To ReadyMadeMenu
    public void addStock(int id, double qty, int exp_year, int exp_month, int exp_day){

        //Get ReadyMadeMenu By Id
        ReadyMadeMenu readyMadeMenu = this.getById(id);

        //Create new Stock and add Stock to ReadyMadeMenu
        Stock newstock = new Stock(qty, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0));

        //Check Same Local Date
        boolean ishave = false;
        for(Stock stock : readyMadeMenu.getStock()){
            if(stock.getExpired().isEqual(newstock.getExpired())){
                stock.increaseQty(qty);
                ishave = true;
            }
        }
        if(!ishave){
            readyMadeMenu.addNewStock(newstock);
        }

        readymademenuRepository.save(readyMadeMenu);

    }

    //Update Stock
    public Stock updateStock(int readymade_id, int stock_id, double new_qty, LocalDateTime new_expired_date){
        //Get Ingredient By Id
        ReadyMadeMenu readymade = this.getById(readymade_id);

        //Find Stock by Id
        boolean ishave=false;
        Stock s = new Stock();
        for(Stock stock : readymade.getStock()){
            if(stock.getId()==stock_id){
                s=stock;
                ishave=true;
                stock.setQty(new_qty);
                stock.setExpired(new_expired_date);
            }
        }

        if(!ishave){
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+readymade_id);
        }

        this.save(readymade);
        return s;
    }

    //Decrease Quantity Stock from Ready Made Menu
    public void decreaseStockQty(int readymade_id, int stock_id, double qty){

        //Get Ingredient By Id
        ReadyMadeMenu readymade = this.getById(readymade_id);

        //Find Stock by Id
        boolean ishave=false;
        boolean isout=false;
        Stock stock_empty = new Stock();
        for(Stock stock : readymade.getStock()){
            if(stock.getId()==stock_id){
                ishave=true;
                
                boolean ischanged = stock.decreaseQty(qty);
                if(ischanged && stock.getQty()==0){
                    isout=true;
                    stock_empty=stock;
                }else if(!ischanged){
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Stock Not have enough Quantity");
                }

            }
        }

        if(!ishave){
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+readymade_id);
        }
        if(isout){
            readymade.removeStock(stock_empty);
        }

        this.save(readymade);

    }

    //Decrease Quantity 
    public List<StockUsage> decreaseStockQtyFIFO(ReadyMadeMenu readymade, double qty){

        LocalDateTime datenow = LocalDateTime.now();
        LocalDateTime datenowbe = datenow.withYear(datenow.getYear() + 543);

        //Sort All Stock in ReadyMadeMenu
        List<Stock> availableStocks = readymade.getStock().stream()
                .filter(s -> s.getExpired() != null && s.getExpired().isAfter(datenowbe))
                .sorted(Comparator.comparing(Stock::getExpired))
                .toList();
        
        //Check Qty in Stock have enough
        double totalAvailable = availableStocks.stream().mapToDouble(Stock::getQty).sum();
        if(totalAvailable < qty){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock Quantity not enough");
        }

        List<StockUsage> stock_usage = new ArrayList<>();

        double remaining = qty;
        for(Stock stock : availableStocks){
            double stock_used = 0;
            if(stock.getQty() >= remaining){
                stock.decreaseQty(remaining);
                stock_used = remaining;
                remaining = 0;
            } else {
                remaining -=stock.getQty();
                stock_used = stock.getQty();
                stock.decreaseQty(stock.getQty());
            }
            
            StockUsage usage = new StockUsage(stock_used, stock.getExpired());
            stock_usage.add(usage);

            if(stock.getQty() == 0){
                readymade.removeStock(stock);
            }

            if(remaining == 0){
                break;
            }
        }



        readymademenuRepository.save(readymade);
        return stock_usage;

    }

    //Delete Stock From ReadyMadeMenu
    public void removeStock(int readymade_id, int stock_id){

        //Get ReadyMadeMenu and Stock By Id
        ReadyMadeMenu readymade = this.getById(readymade_id);

        //Find Stock by Id
        boolean ishave=false;
        for(Stock stock : readymade.getStock()){
            if(stock.getId()==stock_id){
                ishave=true;
                readymade.removeStock(stock);
            }
        }

        if(!ishave){
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+readymade);
        }

        readymademenuRepository.save(readymade);

    }
    
    
}