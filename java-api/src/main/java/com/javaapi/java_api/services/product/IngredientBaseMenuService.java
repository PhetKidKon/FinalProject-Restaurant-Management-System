package com.javaapi.java_api.services.product;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.entity.product.IngredientBaseMenu;
import com.javaapi.java_api.entity.product.Ingredients;
import com.javaapi.java_api.entity.product.MenuIngredient;
import com.javaapi.java_api.entity.product.ReadyMadeMenu;
import com.javaapi.java_api.entity.product.Stock;
import com.javaapi.java_api.payload.response.StockUsage;
import com.javaapi.java_api.repository.product.IngredientBaseMenuRepository;
import com.javaapi.java_api.repository.product.MenuIngredientRepository;
import com.javaapi.java_api.repository.product.TransactionRepository;

@Service
public class IngredientBaseMenuService {

    MenuIngredientRepository menuIngredientRepository;
    
    IngredientBaseMenuRepository ingrmenuRepository;

    @Autowired
    IngredientService ingredientService;

    TransactionRepository transactionRepository;

    @Autowired
    public IngredientBaseMenuService(IngredientBaseMenuRepository ingrmenuRepository, MenuIngredientRepository menuIngredientRepository, TransactionRepository transactionRepository){
        this.ingrmenuRepository = ingrmenuRepository;
        this.menuIngredientRepository = menuIngredientRepository;
        this.transactionRepository = transactionRepository;
    }

    public IngredientBaseMenuService(){}

    //Behavior

    //Get All Table IngredientBaseMenu
    public List<IngredientBaseMenu> getAll(){ return ingrmenuRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public IngredientBaseMenu getById(int id){ return ingrmenuRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient Base Menu id : " + id + " Not Found"));}

    //Save to IngredientBaseMenu Table
    public IngredientBaseMenu save(IngredientBaseMenu ingrmenu){ return ingrmenuRepository.save(ingrmenu); }

    //Delete From Id
    public void deleteById(int id){
        ingrmenuRepository.deleteById(id);
    }

    //Add MenuIngredient To IngredientBaseMenu
    public void addStock(int id, Ingredients ingr_used, int qty){

        //Get ReadyMadeMenu By Id
        IngredientBaseMenu ingrbasemenu = this.getById(id);

        //Create new Stock and add Stock to ReadyMadeMenu
        MenuIngredient menu_ingr = new MenuIngredient(ingr_used, qty);
        ingrbasemenu.addMenuIngredient(menu_ingr);

        ingrmenuRepository.save(ingrbasemenu);

    }

    //Delete Stock From IngredientBaseMenu
    public void removeStock(int ingrbase_id, int menuingr_id){
        
        //Get ReadyMadeMenu By Id
        IngredientBaseMenu ingrbasemenu = this.getById(ingrbase_id);
        MenuIngredient menuIngredient = menuIngredientRepository.findById(menuingr_id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuIngredient id :" + menuingr_id + " Not Found"));

        //Remove From Ingredient and Save To Table
        ingrbasemenu.removeMenuIngredient(menuIngredient);
        
        ingrmenuRepository.save(ingrbasemenu);

    }
    
    //Decrease From MenuIngredient 

    public List<StockUsage> decreaseStockQtyFIFO(IngredientBaseMenu ingrbase, double qty){

        //Check Stock is Enough
        for(MenuIngredient mi : ingrbase.getIngr_used()){
            Ingredients ingr = mi.getIngr_used();
            double needQty = mi.getQty() * qty;
            double available = ingr.getAvailableStockQty();
            if(available < needQty){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ingredient Id : "+ingr.getId()+" name : "+ingr.getName()+" not Enough");
            }
        }

        List<StockUsage> stockUsage = new ArrayList<>();

        //Decrease Stock in Ingredient Base Menu
        for(MenuIngredient mi : ingrbase.getIngr_used()){
            Ingredients ingr = mi.getIngr_used();
            double needQty = mi.getQty() * qty;
            List<StockUsage> new_stockUsage = ingredientService.decreaseStockQtyFIFO(ingr.getId(), ingrbase.getName(), needQty, qty);
            stockUsage.addAll(new_stockUsage);
        }

        return stockUsage;

    }
    
    //Check is Enough & Return 

    public List<Map<String, Object>> avaliableqty(int ingrbase_id){

        IngredientBaseMenu ingrbase = this.getById(ingrbase_id);

        List<Map<String, Object>> ingrnotenough = new ArrayList<>();

        //Check Stock is Enough
        for(MenuIngredient mi : ingrbase.getIngr_used()){
            Ingredients ingr = mi.getIngr_used();
            double available = ingr.getAvailableStockQty();
            Map<String, Object> m = new HashMap<>();
            m.put("ingr_id", ingr.getId());
            m.put("ingr_name", ingr.getName());
            m.put("usage_qty", (int) (available / mi.getQty()));
            m.put("used_qty", mi.getQty());
            m.put("ingr_stock_avaliable", ingr.getAvailableStockQty());
            ingrnotenough.add(m);
        }

        return ingrnotenough;

    }


    //public Update MenuIngredient
    public IngredientBaseMenu updateMenuIngredient(List<MenuIngredient> new_menuingr, int ingrbase_id) {
        IngredientBaseMenu ingrbase = this.getById(ingrbase_id);
        List<MenuIngredient> old_menuingr = ingrbase.getIngr_used();

        Map<Integer, MenuIngredient> oldMenuIngrMap = new HashMap<>();

        for (MenuIngredient mi : old_menuingr) {
            oldMenuIngrMap.put(mi.getIngr_used_id(), mi);
        }

        List<MenuIngredient> updateList = new ArrayList<>();

        for (MenuIngredient newMi : new_menuingr){
            int ingrId = newMi.getIngr_used_id();
            if (oldMenuIngrMap.containsKey(ingrId)){
                // If the ingredient exists in the old list, update its quantity
                MenuIngredient oldMi = oldMenuIngrMap.get(ingrId);
                oldMi.setQty(newMi.getQty());
                updateList.add(oldMi);
            } else {
                // If the ingredient does not exist, add it as a new MenuIngredient
                newMi.setIngrbaseMenu(ingrbase);
                updateList.add(newMi);
            }
        }

        ingrbase.setIngr_used(updateList);
        return this.save(ingrbase);
    }

    public IngredientBaseMenu updateMenuIngredient(int ingrbase_id, int menuingr_id, int new_qty) {

        IngredientBaseMenu ingrbase = this.getById(ingrbase_id);

        MenuIngredient menuingr = ingrbase.getIngr_used().stream()
            .filter(mi -> mi.getId() == menuingr_id)
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuIngredient id : " + menuingr_id + " Not Found"));


        // Update the quantity of the existing MenuIngredient
        for(MenuIngredient mi : ingrbase.getIngr_used()){
            if(mi == menuingr){
                mi.setQty(new_qty);
                break;
            }
        }

        return this.save(ingrbase);
    }


    public IngredientBaseMenu addMenuIngredient(int ingrbase_id, int ingr_id, double qty) {

        IngredientBaseMenu ingrbase = this.getById(ingrbase_id);

        Ingredients ingr = ingredientService.getById(ingr_id);
        if (ingr == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient id : " + ingr_id + " Not Found");
        }

        for(MenuIngredient mi : ingrbase.getIngr_used()){
            if(mi.getIngr_used_id() == ingr_id){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ingredient id : " + ingr_id + " already exists in Ingredient Base Menu");
            }
        }

        MenuIngredient newMenuIngredient = new MenuIngredient(ingr, qty);

        ingrbase.addMenuIngredient(newMenuIngredient);

        return this.save(ingrbase);
    }

    public IngredientBaseMenu removeMenuIngredient(int ingrbase_id, int menuingr_id) {

        IngredientBaseMenu ingrbase = this.getById(ingrbase_id);

        MenuIngredient menuingr = ingrbase.getIngr_used().stream()
            .filter(mi -> mi.getId() == menuingr_id)
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuIngredient id : " + menuingr_id + " Not Found"));

        ingrbase.removeMenuIngredient(menuingr);

        return this.save(ingrbase);
    }

}