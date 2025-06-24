package com.javaapi.java_api.services.product;

import java.time.LocalDateTime;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.ReadyMadeMenu;
import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.entity.product.Transaction;
import com.javaapi.java_api.repository.product.TransactionRepository;
import com.javaapi.java_api.repository.product.IngredientRepository;
import com.javaapi.java_api.repository.product.ReadyMadeMenuRepository;
import com.javaapi.java_api.repository.product.StockRepository;

@Service
public class TransactionService {

    StockRepository stockRepository;

    TransactionRepository transactionRepository;

    IngredientRepository ingredientRepository;

    ReadyMadeMenuRepository readyMadeMenuRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, StockRepository stockRepository, 
                            IngredientRepository ingredientRepository, ReadyMadeMenuRepository readyMadeMenuRepository){
        this.transactionRepository = transactionRepository;
        this.stockRepository = stockRepository;
        this.ingredientRepository = ingredientRepository;
        this.readyMadeMenuRepository = readyMadeMenuRepository;
    }

    public TransactionService(){}

    //Behavior

    //Get All Table Stock
    public List<Transaction> getAll(){ return transactionRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public Transaction getById(int id){ return transactionRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transactions id :" + id + " Not Found"));}

    //Save to Stock Table
    public Transaction save(Transaction transaction){ return transactionRepository.save(transaction); }
    
    //Update to Stock Table
    public Transaction updateInfo(int id, double qty, String productType, String transactionType, int exp_year, int exp_month, int exp_day){
        Transaction transaction = getById(id);

        transaction.setQty(qty);
        transaction.setProductType(productType);
        transaction.setTransactionType(transactionType);
        transaction.setExpired(LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0));

        
        return transactionRepository.save(transaction); 
    }

    //Delete From Id
    public void deleteById(int id){
        transactionRepository.deleteById(id);
    }

    //Get Product Name
    public String findProductNameById(int id){

        Transaction tran = transactionRepository.findById(id).orElse(null);
        int product_id = tran.getProduct_id();
        if("ingredient".equalsIgnoreCase(tran.getProductType())){
            Ingredients ingr = ingredientRepository.findById(product_id).orElse(null);
            return ingr.getName();
        }else if("readymademenu".equalsIgnoreCase(tran.getProductType())){
            ReadyMadeMenu readymade = readyMadeMenuRepository.findById(product_id).orElse(null);
            return readymade.getName();
        }

        return "null";

    }

    //Get Product From Descrption
    public List<Transaction> findByDescription(String des){
        return transactionRepository.findByDescriptionContainingIgnoreCase(des); }
    
}
