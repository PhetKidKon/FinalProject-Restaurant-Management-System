package com.javaapi.java_api.services.product;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.repository.product.IngredientRepository;
import com.javaapi.java_api.repository.product.StockRepository;
import com.javaapi.java_api.repository.product.TransactionRepository;
import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.ReadyMadeMenu;
import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.entity.product.Transaction;
import com.javaapi.java_api.payload.response.StockUsage;

@Service
public class IngredientService {

    StockRepository stockRepository;
    
    IngredientRepository ingredientRepository;

    TransactionRepository transactionRepository;

    //Constructor

    @Autowired
    public IngredientService(IngredientRepository ingredientRepository, StockRepository stockRepository, TransactionRepository transactionRepository){
        this.ingredientRepository = ingredientRepository;
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
    }

    public IngredientService(){}

    //Behavior

    //Get All Ingredient
    public List<Ingredients> getAll(){ return ingredientRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Ingredients getById(int id){ return ingredientRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient id :" + id + " Not Found"));  }

    public Stock getStockById(int ingr_id, int stock_id) {
        Ingredients ingr = this.getById(ingr_id);
        for (Stock stock : ingr.getStock()) {
            if (stock.getId() == stock_id) {
                return stock;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock id: " + stock_id + " not found in Ingredient id: " + ingr_id);
    }

    //Save to Table
    public Ingredients save(Ingredients ingredient){ return ingredientRepository.save(ingredient);  }

    //Delete From Id
    public void deleteById(int id){
        Ingredients ingr = this.getById(id);

        //Delete Stock
        for(Stock i : ingr.getStock()){
            stockRepository.delete(i);
        }

        ingredientRepository.deleteById(id);
    }


    

    //Add Stock To Ingredient
    public void addStock(int id, double qty, int exp_year, int exp_month, int exp_day){

        //Get Ingredient By Id
        Ingredients ingr = this.getById(id);

        //Create new Stock and add Stock to Ingredient
        Stock newstock = new Stock(qty, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0));
        
        //Check Same Local Date
        boolean ishave = false;
        for(Stock stock : ingr.getStock()){
            if(stock.getExpired().isEqual(newstock.getExpired())){
                stock.increaseQty(qty);
                ishave = true;
            }
        }
        if(!ishave){
            ingr.addNewStock(newstock);
        }

        ingredientRepository.save(ingr);

    }

    //Decrease Quantity Stock from Ingredient
    public void decreaseStockQty(int ingr_id, int stock_id, double qty){

        //Get Ingredient By Id
        Ingredients ingr = this.getById(ingr_id);

        //Find Stock by Id
        boolean ishave=false;
        boolean isout=false;
        Stock stock_empty = new Stock();
        for(Stock stock : ingr.getStock()){
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
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+ingr_id);
        }
        if(isout){
            ingr.removeStock(stock_empty);
        }

        this.save(ingr);

    }

    //Decrease Quantity Stock In Ingredient Stock 
    public List<StockUsage> decreaseStockQtyFIFO(int ingr_id, String menu_name, double qty, double menu_qty){

        Ingredients ingr = this.getById(ingr_id);

        LocalDateTime datenow = LocalDateTime.now();
        LocalDateTime datenowbe = datenow.withYear(datenow.getYear() + 543);

        //Sort All StockIn Ingredient
        List<Stock>availableStocks = ingr.getStock().stream()
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
            
            StockUsage usage = new StockUsage(stock.getIngr().getId(), stock.getIngr().getName(), stock_used , menu_qty, stock.getExpired());
            stock_usage.add(usage);

            if(stock.getQty() == 0){
                ingr.removeStock(stock);
            }

            if(remaining == 0){
                break;
            }
        }

        ingredientRepository.save(ingr);
        return stock_usage;

    }

    //Update Stock
    public Stock updateStock(int ingr_id, int stock_id, double new_qty, LocalDateTime new_expired_date){
        //Get Ingredient By Id
        Ingredients ingr = this.getById(ingr_id);

        Stock s = new Stock();
        //Find Stock by Id
        boolean ishave=false;
        for(Stock stock : ingr.getStock()){
            if(stock.getId()==stock_id){
                s = stock;
                ishave=true;
                stock.setQty(new_qty);
                stock.setExpired(new_expired_date);
            }
        }


        if(!ishave){
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+ingr_id);
        }

        this.save(ingr);
        return s;
    }

    //Delete Stock From Ingredient
    public void removeStock(int ingr_id, int stock_id){
        
        //Get ReadyMadeMenu and Stock By Id
        Ingredients ingr = this.getById(ingr_id);

        //Find Stock by Id
        boolean ishave=false;
        for(Stock stock : ingr.getStock()){
            if(stock.getId()==stock_id){
                ishave=true;
                ingr.removeStock(stock);
            }
        }

        if(!ishave){
            ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot find Stock id : "+stock_id+" From Ingredient id : "+ingr_id);
        }

        ingredientRepository.save(ingr);

    }


}
