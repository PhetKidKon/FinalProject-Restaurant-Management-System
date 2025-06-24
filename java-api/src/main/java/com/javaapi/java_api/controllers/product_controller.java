package com.javaapi.java_api.controllers;

import java.time.LocalDateTime;
import java.util.*;
import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Paths;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.*;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;

import com.javaapi.java_api.entity.account.Employee;
import com.javaapi.java_api.entity.account.InventorySupervisor;
import com.javaapi.java_api.entity.product.*;
import com.javaapi.java_api.entity.reservation.RestaurantTable;
import com.javaapi.java_api.payload.response.ResGetIDReadyMade;
import com.javaapi.java_api.payload.response.ResGetIdIngrbase;
import com.javaapi.java_api.payload.response.ResGetIngredient;
import com.javaapi.java_api.payload.response.ResGetMenu;
import com.javaapi.java_api.payload.response.ResGetTransaction;
import com.javaapi.java_api.payload.response.ResMenuIngr;
import com.javaapi.java_api.services.account.*;
import com.javaapi.java_api.services.product.*;
















@RestController
@RequestMapping("/api")
public class product_controller {

    //Service fields
    
    @Autowired
    private MenuitemService menuService;

    @Autowired
    private IngredientBaseMenuService ingrmenuService;

    @Autowired
    private ReadyMadeMenuService readymademenuService;

    @Autowired
    private IngredientService ingrService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CashierService cashierService;

    @Autowired
    private InventorySupervisorService invenService;

    @Autowired
    private SystemAdminService systemAdminService;

    @Autowired
    private EmployeeService employeeService;

    @Value("${file.upload-dir}")
    private String uploadDirectory;

    //Ingredient Controllers

    //Get All Ingredient 
    @GetMapping("/ingr")
    public List<Ingredients> getAllIngredient() {

        List<Ingredients> ingredients = ingrService.getAll();
        List<ResGetIngredient> res = new ArrayList<>();

        for(Ingredients ingr : ingredients){
            res.add(new ResGetIngredient(ingr.getId(), ingr.getName(), ingr.getUnit(), ingr.getCreated_by().getId(), ingr.getCreated_by().getAccount().getEmail(), ingr.getStock(), ingr.getAvailableStockQty()));
        }
        
        return ingrService.getAll();
    }

    //Get By Id
    @GetMapping("/ingr/{id}")
    public ResponseEntity<ResGetIngredient> get(@PathVariable("id") int id) {
        Ingredients ingr = ingrService.getById(id);
        ResGetIngredient res = new ResGetIngredient(ingr.getId(), ingr.getName(), ingr.getUnit(), ingr.getCreated_by().getId(), ingr.getCreated_by().getAccount().getEmail(), ingr.getStock(), ingr.getAvailableStockQty());
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    //Update Ingredient
    @PostMapping("/ingr/{id}/update")
    public ResponseEntity<?> UpdateTable(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("name", "type", "unit", "status");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        String name;
        String type;
        String unit;
        String status;

        if(reqMap.get("name") instanceof String){
            name = (String) reqMap.get("name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid name field. Expected String.");
        }
        if(reqMap.get("type") instanceof String){
            type = (String) reqMap.get("type");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type field. Expected String.");
        }
        if(reqMap.get("unit") instanceof String){
            unit = (String) reqMap.get("unit");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid unit field. Expected String.");
        }
        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }

        //Check if email already exists
        try {

            Ingredients ingr = ingrService.getById(id);
            ingr.setName(name);
            ingr.setType(type);
            ingr.setUnit(unit);
            ingr.setStatus(status);
            ingrService.save(ingr);


            return ResponseEntity.status(HttpStatus.OK).body("Update Ingredient Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Update Ingredient");
        }
    }

    //Add Ingredient
    @PostMapping("/ingr/addIngr")
    //@PreAuthorize("hasRole('INVENTORYSUPERVISOR')" )
    public ResponseEntity<?> addIngredients(@RequestBody Map<String, Object> reqMap) {
        
        List<String> requiredFields = Arrays.asList("name", "type", "unit", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String name;
        String type;
        String unit;
        String email;

        if(reqMap.get("name") instanceof String){
            name = (String) reqMap.get("name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid name field. Expected String.");
        }
        if(reqMap.get("type") instanceof String){
            type = (String) reqMap.get("type");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type field. Expected String.");
        }
        if(reqMap.get("unit") instanceof String){
            unit = (String) reqMap.get("unit");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid unit field. Expected String.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        try {
            InventorySupervisor inven = invenService.getByEmail(email);
            List<Stock> stock = new ArrayList<>();
            Ingredients new_ingr = inven.createIngredients(name, type, unit, stock, "available");//String name, String type, String unit, List<Stock> stock,String status
            ingrService.save(new_ingr);
            return ResponseEntity.status(HttpStatus.OK).body("Add New Ingredient Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error to Add New Ingredients");
        }


    }
    
    @DeleteMapping("/ingr/{id}/delete")
    public ResponseEntity<?> deleteIngredientsById(@PathVariable int id){

        try {
            
            ingrService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Delete Ingredient Id : "+id+" Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Delete Ingredient Id : "+id);
        }

    }

    //Decrease Ingredient Stock By Id
    @PostMapping("/ingr/{id}/decreasestock/{stock_id}") //"/ingr/{id}/decreasestock/{stock_id}"  "qty", "description" , "email")
    public ResponseEntity<?> DecreaseStockIngredient(@PathVariable int id, @PathVariable int stock_id, @RequestBody Map<String, Object> reqMap) {
        
        List<String> requiredFields = Arrays.asList("qty", "description", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //Transaction trans = new Transaction(qty, product_type, product_id, product_type, description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
        
        double qty;
        String description;
        String email;
        

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if(reqMap.get("description") instanceof String){
            description = (String) reqMap.get("description");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid description field. Expected String.");
        }

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        Employee employee = employeeService.getByEmail(email);

        ingrService.decreaseStockQty(id, stock_id, qty);
        Ingredients ingr = ingrService.getById(id);
        Transaction trans = new Transaction(qty, "ingredient", id, "outbound", description, ingr.getCreated_at(), employee);
        transactionService.save(trans);

        return ResponseEntity.status(HttpStatus.OK).body("Decrease Stock Successful");
    }

    //Update Ready Made Menu By Id
    @PostMapping("/ingr/{id}/updatestock")
    public ResponseEntity<?> updateIngredientStock(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {
        
        List<String> requiredFields = Arrays.asList("stock_id", "qty", "expired_year", "expired_month", "expired_day", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //Transaction trans = new Transaction(qty, product_type, product_id, product_type, description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
        
        int stock_id;
        double qty;
        int expired_year;
        int expired_month;
        int expired_day;
        String email;

        if(reqMap.get("stock_id") instanceof Integer){
            stock_id = (Integer) reqMap.get("stock_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid stock id field. Expected Integer.");
        }

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if(reqMap.get("expired_year") instanceof Integer){
            expired_year = (Integer) reqMap.get("expired_year");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired year field. Expected Integer.");
        }

        if(reqMap.get("expired_month") instanceof Integer){
            expired_month = (Integer) reqMap.get("expired_month");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired month field. Expected Integer.");
        }

        if(reqMap.get("expired_day") instanceof Integer){
            expired_day = (Integer) reqMap.get("expired_day");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired day field. Expected Integer.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        
        try {
            Employee employee = employeeService.getByEmail(email);
            Stock old_stock = ingrService.getStockById(id, stock_id);
            String desc = "Update Stock ID :"+old_stock.getId()+" Old Qty : "+old_stock.getQty()+" Expired Date : "+old_stock.getExpired_Date();
            Stock s = ingrService.updateStock(id, stock_id, qty, LocalDateTime.of(expired_year, expired_month, expired_day, 0, 0, 0));
            Transaction tran = new Transaction(qty, "ingredient", id, "updated", desc, LocalDateTime.of(expired_year, expired_month, expired_day, 0, 0), employee);
            transactionService.save(tran);

            return ResponseEntity.status(HttpStatus.OK).body("Update Stock Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot Update Stock Id : "+stock_id+" from Ingredient Id :"+id);
        }
    }

    //MenuItem Controllers

    //Get All Menu
    @GetMapping("/menu")
    public List<?> getAllMenu() {

        List<MenuItem> menus = menuService.getAll();
        List<ResGetMenu> res = new ArrayList<>();
        
        for(MenuItem menu : menus){
            res.add(new ResGetMenu(menu.getId(), menu.getName(), menu.getType(), menu.getPrice(), menu.getUnit(), menu.getStatus(), menu.getDescription(), menu.getImgFilePath(), menu.getType()
            , menu.getCreated_by().getId(), menu.getCreated_by().getAccount().getEmail(), menu.getCreated_by().getAccount().getStatus(), menu.getCreated_at(), menu.getCategory_name(), menu.getAvailableStockQty()));
        }

        return res;
    }

    //Get All Available
    @GetMapping("/menu/available")
    public List<?> getAllAvailableMenu() {

        List<MenuItem> menus = menuService.getByStatus("available");
        List<ResGetMenu> res = new ArrayList<>();
        
        for(MenuItem menu : menus){
            res.add(new ResGetMenu(menu.getId(), menu.getName(), menu.getType(), menu.getPrice(), menu.getUnit(), menu.getStatus(), menu.getDescription(), menu.getImgFilePath(), menu.getType()
            , menu.getCreated_by().getId(), menu.getCreated_by().getAccount().getEmail(), menu.getCreated_by().getAccount().getStatus(), menu.getCreated_at(), menu.getCategory_name(), menu.getAvailableStockQty()));
        }

        return res;
    }

    //Get Menu By Id
    @GetMapping("/menu/{id}")
    public ResGetMenu getByIdMenu(@PathVariable int id){

        MenuItem menu = menuService.getById(id);
        ResGetMenu res = new ResGetMenu(menu.getId(), menu.getName(), menu.getType(), menu.getPrice(), menu.getUnit(), menu.getStatus(), menu.getDescription(), menu.getImgFilePath(), menu.getType()
            , menu.getCreated_by().getId(), menu.getCreated_by().getAccount().getEmail(), menu.getCreated_by().getAccount().getStatus(), menu.getCreated_at(), menu.getCategory_name(), menu.getAvailableStockQty());

        return res;
    }
    
    //Add New Menu
    @PostMapping(path = "/menu/createmenu", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    //@PreAuthorize("hasRole('INVENTORYSUPERVISOR')" )
    public ResponseEntity<?> CreateMenu(@RequestPart("data") Map<String, Object> reqMap, @RequestPart("image") MultipartFile imgFile) {


        
        List<String> requiredFields = Arrays.asList("name", "price", "unit", "description", "menu_type", "email", "category_name");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }
        
        String name;
        double price; 
        String unit;
        String description;
        String menu_type;
        String email;
        String category_name;

        if(reqMap.get("name") instanceof String){
            name = (String) reqMap.get("name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid name field. Expected String.");
        }

        if(reqMap.get("price") instanceof Double){
            price = (Double) reqMap.get("price");
        } else if(reqMap.get("price") instanceof Integer){
            price = ((Integer) reqMap.get("price")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid price field. Expected Number");
        }

        if(reqMap.get("unit") instanceof String){
            unit = (String) reqMap.get("unit");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid unit field. Expected String.");
        }

        if(reqMap.get("description") instanceof String){
            description = (String) reqMap.get("description");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid description field. Expected String.");
        }

        if(reqMap.get("menu_type") instanceof String){
            menu_type = (String) reqMap.get("menu_type");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid menu type field. Expected String.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        if(reqMap.get("category_name") instanceof String){
            category_name = (String) reqMap.get("category_name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid category name field. Expected String.");
        }



        String imgName = imgFile.getOriginalFilename();

        //transfer File To Server
        try {
            imgFile.transferTo(new File(uploadDirectory+imgName));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error To Upload Image File"); 
        }

        String imgpath = uploadDirectory+imgName;

        try {
            if("IngredientBaseMenu".equalsIgnoreCase(menu_type)){

                List<Map<String, Object>> ingr_used = (List<Map<String, Object>>) reqMap.get("ingr_used");

                if(!reqMap.containsKey("ingr_used") || reqMap.get("ingr_used") == null || reqMap.get("ingr_used").toString().isEmpty()){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
                }

                List<MenuIngredient> menuingrs= new ArrayList();

                //Ingredients ingr_used, double qty
                for(Map<String, Object> i : ingr_used){
                    requiredFields = Arrays.asList("ingr_id", "qty");
                    for(String field : requiredFields){
                        if(!i.containsKey(field) || i.get(field) == null){
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing ingr_id or qty"); 
                        }
                    }

                    //Create Field to Create Menu Ingredient
                    Ingredients ingr_id;
                    double qty; 

                    if(i.get("ingr_id") instanceof Integer){
                        ingr_id = ingrService.getById((Integer) i.get("ingr_id"));
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ingr_id field. Expected Number");
                    }



                    if(i.get("qty") instanceof Double){
                        qty = (Double) i.get("qty");
                    } else if(i.get("qty") instanceof Integer){
                        qty = ((Integer) i.get("qty")).doubleValue();
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
                    }



                    //Create Menu Ingredient
                    MenuIngredient menuingr = new MenuIngredient(ingr_id, qty);
                    menuingrs.add(menuingr);
                    

                }

                //Get Inventory Supervisor by email
                InventorySupervisor inven = invenService.getByEmail(email);
                IngredientBaseMenu new_ingrbase = new IngredientBaseMenu(name, price, category_name, unit, "available", description, imgpath, inven, menuingrs);

                for(MenuIngredient menuIngredient : menuingrs){
                    menuIngredient.setIngrbaseMenu(new_ingrbase);
                }

                ingrmenuService.save(new_ingrbase);

                return ResponseEntity.status(HttpStatus.OK).body("Add New Ingredient Base Menu Successful");

            }else if("ReadyMadeMenu".equalsIgnoreCase(menu_type)){


                //Get Inventory Supervisor by email
                InventorySupervisor inven = invenService.getByEmail(email);
                List<Stock> stock = new ArrayList<>();
                ReadyMadeMenu new_readymade = new ReadyMadeMenu(name, price, category_name, unit, "available", description, imgpath, inven, stock);

                readymademenuService.save(new_readymade);

                return ResponseEntity.status(HttpStatus.OK).body("Add New Ready Made Menu Successful");
    
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : invalid Menu Type"); 
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Create New Menu"); 
        }

    }

    //Delete MenuItem
    @DeleteMapping(path = "/menu/{id}/delete")
    public ResponseEntity<?> DeleteMenuItem(@PathVariable int id){

        MenuItem menuItem = menuService.getById(id);
        if(menuItem.getType().equalsIgnoreCase("ingredientbasemenu")){
            ingrmenuService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Delete IngredientBaseMenu id : "+id+ " Successful");
        }else if(menuItem.getType().equalsIgnoreCase("readymademenu")){
            readymademenuService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Delete ReadyMadeMenu id : "+id+ " Successful");
        }else {
            return ResponseEntity.status(HttpStatus.OK).body("Error : Cannot Delete MenuItem id : "+id);
        }

    }

    //Update
    @PostMapping(path = "/menu/{id}/update")
    //@PreAuthorize("hasRole('INVENTORYSUPERVISOR')" )
    public ResponseEntity<?> UpdateMenuInfo(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        
        List<String> requiredFields = Arrays.asList("name", "price", "unit", "status", "description", "category_name");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }
        
        String name;
        double price; 
        String unit;
        String status;
        String description;
        String category_name;

        if(reqMap.get("name") instanceof String){
            name = (String) reqMap.get("name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid name field. Expected String.");
        }

        if(reqMap.get("price") instanceof Double){
            price = (Double) reqMap.get("price");
        } else if(reqMap.get("price") instanceof Integer){
            price = ((Integer) reqMap.get("price")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid price field. Expected Number");
        }

        if(reqMap.get("unit") instanceof String){
            unit = (String) reqMap.get("unit");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid unit field. Expected String.");
        }

        if(reqMap.get("category_name") instanceof String){
            category_name = (String) reqMap.get("category_name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid category_name field. Expected String.");
        }

        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }

        if(reqMap.get("description") instanceof String){
            description = (String) reqMap.get("description");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid description field. Expected String.");
        }

        try {

            //Update Menu info
            menuService.updateInfo(id, name, price, unit, category_name, status, description);
            return ResponseEntity.status(HttpStatus.OK).body("Add Update Ready Made Menu Successful");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Update Menu id :"+id); 
        }

    }

    //Update Image
    @PostMapping(path = "/menu/{id}/updateimg", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> UpdateMenuImg(@PathVariable int id, @RequestPart("image") MultipartFile imgFile) {

        String imgName = imgFile.getOriginalFilename();

        //transfer File To Server
        try {
            imgFile.transferTo(new File(uploadDirectory+imgName));

            String imgpath = uploadDirectory+imgName;
            menuService.updateImg(id, imgpath);

            return ResponseEntity.status(HttpStatus.OK).body("Update Image Menu "+id+" Successful");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Upload Image File"); 
        }
        
    }

    @GetMapping("/menu/{id}/imgFile")
    public ResponseEntity<Resource> getMenuImgage(@PathVariable int id) {

        try {
            MenuItem menu = menuService.getById(id);
            Path filepath = Paths.get(menu.getImgFilePath()).normalize();
            Resource resource = new UrlResource(filepath.toUri());

            if(resource.exists()){
                return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.IMAGE_JPEG).body(resource);
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
        } catch (MalformedURLException  e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }
    

    //Delete Menu Ingredient


    //Ingredient Base Menu Controllers

    //Get All Ingredient Base Menu
    @GetMapping("/menu/ingrbase")
    public List<IngredientBaseMenu> getAllIngredientBaseMenu() {

        List<IngredientBaseMenu> ingrbase = ingrmenuService.getAll();

        List<ResGetIdIngrbase> res = new ArrayList<>();
        for(IngredientBaseMenu ingr : ingrbase){

            List<ResMenuIngr> resIngrs = new ArrayList<>();

            for(MenuIngredient menuingr : ingr.getIngr_used()){
                if(menuingr.getIngr_used() == null){
                    resIngrs.add(new ResMenuIngr(menuingr.getId(), menuingr.getQty(), menuingr.getIngr_used().getId(), menuingr.getIngr_used().getName(), menuingr.getIngr_used().getAvailableStockQty()));
                }
            }

            res.add(new ResGetIdIngrbase(ingr.getId(), ingr.getName(), ingr.getPrice(), ingr.getUnit(), ingr.getStatus(), ingr.getDescription(), ingr.getImgFilePath(), ingr.getType()
            , ingr.getCreated_by().getId(), ingr.getCreated_by().getAccount().getEmail(), ingr.getCreated_by().getAccount().getStatus(), ingr.getCreated_at(), resIngrs, ingr.getCategory_name()));
        }

        return ingrmenuService.getAll();
    }

    //Get Ingredient Base Menu By Id
    @GetMapping("/menu/ingrbase/{id}")
    public ResponseEntity<?> getIngredientBaseMenuById(@PathVariable int id){

        IngredientBaseMenu ingrbase = ingrmenuService.getById(id);

        List<ResMenuIngr> resIngrs = new ArrayList<>();
        for(MenuIngredient menuingr : ingrbase.getIngr_used()){
            resIngrs.add(new ResMenuIngr(menuingr.getId(), menuingr.getQty(), menuingr.getIngr_used().getId(), menuingr.getIngr_used().getName(), menuingr.getIngr_used().getAvailableStockQty()));
        }

        ResGetIdIngrbase res = new ResGetIdIngrbase(ingrbase.getId(), ingrbase.getName(), ingrbase.getPrice(), ingrbase.getUnit(), ingrbase.getStatus()
        , ingrbase.getDescription(), ingrbase.getImgFilePath(), ingrbase.getType(), ingrbase.getCreated_by().getId(), ingrbase.getCreated_by().getAccount().getEmail()
        , ingrbase.getCreated_by().getAccount().getStatus(), ingrbase.getCreated_at(), resIngrs, ingrbase.getCategory_name());
        

        return ResponseEntity.status(HttpStatus.OK).body(res);

    }
    
    //Check is Stock Enough
    @GetMapping("/menu/ingrbase/{id}/availableqty")
    public ResponseEntity<?> IngredientBaseMenuAvailableqty(@PathVariable int id) {

        Map<String, Object> res = new HashMap<>();
        IngredientBaseMenu ingrbase = ingrmenuService.getById(id);
        
        List<Map<String, Object>> isstockenough = ingrmenuService.avaliableqty(id);

        res.put("ingrbase_id", id);
        res.put("ingrbase_name", ingrbase.getName());


        if(isstockenough.isEmpty()){
            res.put("stock", "Stock Quantity available is 0");
            return ResponseEntity.status(HttpStatus.OK).body(res);
        } else {
            res.put("stock", isstockenough);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }

    }
    

    @PostMapping("/menu/ingrbase/{id}/updateMenuIngredient")
    public ResponseEntity<?> updateMenuIngredient(@PathVariable int id, @RequestBody List<Map<String, Object>> reqMap) {
        try {

            List<MenuIngredient> newmi = new ArrayList<>();

            for(Map<String, Object> ingrMap : reqMap) {
                if (!ingrMap.containsKey("ingr_id") || !ingrMap.containsKey("qty")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing ingr_id or qty in request");
                }

                int ingr_Id;
                double qty;

                if (ingrMap.get("ingr_id") instanceof Integer) {
                    ingr_Id = (Integer) ingrMap.get("ingr_id");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ingr_id type");
                }

                if (ingrMap.get("qty") instanceof Double) {
                    qty = (Double) ingrMap.get("qty");
                } else if (ingrMap.get("qty") instanceof Integer) {
                    qty = ((Integer) ingrMap.get("qty")).doubleValue();
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty type");
                }

                Ingredients ingr = ingrService.getById(ingr_Id);
                if (ingr == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ingredient with id " + ingr_Id + " not found");
                }

                newmi.add(new MenuIngredient(ingrService.getById(ingr_Id), qty));

            }


            IngredientBaseMenu ingrbase = ingrmenuService.updateMenuIngredient(newmi, id);

            return ResponseEntity.status(HttpStatus.OK).body(ingrbase);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    //Add Ingredient Used to Ingredient Base Menu
    @PostMapping("/menu/ingrbase/{id}/addingr_used") 
    public ResponseEntity<?> addIngr_used(@PathVariable int id,@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("ingr_id", "qty");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //Transaction trans = new Transaction(qty, product_type, product_id, product_type, description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
        
        int ingr_id;
        double qty;

        

        if(reqMap.get("ingr_id") instanceof Integer){
            ingr_id = (Integer) reqMap.get("ingr_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ingr_id field. Expected Integer.");
        }

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if (qty < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty value. It must be a positive number.");
        }
        
        try {

            IngredientBaseMenu ingrbase = ingrmenuService.addMenuIngredient(id, ingr_id, qty);

           
            return ResponseEntity.status(HttpStatus.OK).body("Menu Ingredient updated successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
        
    }

    //Remove Ingredient Used from Ingredient Base Menu
    @DeleteMapping("/menu/ingrbase/{id}/removeingr_used/{menuingr_id}")
    public ResponseEntity<?> removeIngr_used(@PathVariable int id, @PathVariable int menuingr_id) {
        
        try {

            IngredientBaseMenu ingrbase = ingrmenuService.removeMenuIngredient(id, menuingr_id);
            

            return ResponseEntity.status(HttpStatus.OK).body("Menu Ingredient removed successfully");

            
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
        
    }
    
    @PostMapping("/menu/ingrbase/{id}/menu_ingr/{menuingr_id}")
    public ResponseEntity<String> updateMenuIngredientById(@PathVariable int id, @PathVariable int menuingr_id, @RequestBody int qty) {
        
        try {

            if (qty < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty value. It must be a positive number.");
            }

            IngredientBaseMenu ingrbase = ingrmenuService.updateMenuIngredient(id, menuingr_id, qty);
            

            return ResponseEntity.status(HttpStatus.OK).body("Menu Ingredient updated successfully");

            
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
        
    }
    

    //Ready Made Menu Controllers

    //Get All Ready Made Menu
    @GetMapping("/menu/readymade")
    public List<ReadyMadeMenu> getAllReadyMadeMenu() {
        return readymademenuService.getAll();
    }

    //Get Ready Made Menu By Id
    @GetMapping("/menu/readymade/{id}")
    public ResponseEntity<?> getReadyMadeMenuById(@PathVariable int id){

        ReadyMadeMenu readymade = readymademenuService.getById(id);
        ResGetIDReadyMade res = new ResGetIDReadyMade(readymade.getId(), readymade.getName(), readymade.getPrice(), readymade.getUnit(), readymade.getStatus()
        , readymade.getDescription(), readymade.getImgFilePath(), readymade.getType(), readymade.getCreated_by().getId(), readymade.getCreated_by().getAccount().getEmail()
        , readymade.getCreated_by().getAccount().getStatus(), readymade.getCreated_at(), readymade.getStock(), readymade.getCategory_name());

        return ResponseEntity.status(HttpStatus.OK).body(res);
        
    }

    //Decrease Ready Made Menu Stock By Id
    @PostMapping("/menu/readymade/{id}/decreasestock/{stock_id}")
    public ResponseEntity<?> DecreaseStockReadyMadeMenu(@PathVariable int id, @PathVariable int stock_id, @RequestBody Map<String, Object> reqMap) {
        
        List<String> requiredFields = Arrays.asList("qty", "description", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 
    
        double qty;
        String description;
        String email;

        

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if(reqMap.get("description") instanceof String){
            description = (String) reqMap.get("description");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid description field. Expected String.");
        }

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        Employee employee = employeeService.getByEmail(email);
        readymademenuService.decreaseStockQty(id, stock_id, qty);
        ReadyMadeMenu readymade = readymademenuService.getById(id);
        Transaction trans = new Transaction(qty, "readymademenu", id, "outbound", description, readymade.getCreated_at(), employee);
        transactionService.save(trans);

        return ResponseEntity.status(HttpStatus.OK).body("Decrease Stock Successful");
    }

    //Update Ready Made Menu By Id
    @PostMapping("/menu/readymade/{id}/updatestock")
    public ResponseEntity<?> updateReadyMadeStock(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {
        
        List<String> requiredFields = Arrays.asList("stock_id", "qty", "expired_year", "expired_month", "expired_day", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //Transaction trans = new Transaction(qty, product_type, product_id, product_type, description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
        
        int stock_id;
        double qty;
        int expired_year;
        int expired_month;
        int expired_day;
        String email;

        if(reqMap.get("stock_id") instanceof Integer){
            stock_id = (Integer) reqMap.get("stock_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid stock id field. Expected Integer.");
        }

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if(reqMap.get("expired_year") instanceof Integer){
            expired_year = (Integer) reqMap.get("expired_year");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired year field. Expected Integer.");
        }

        if(reqMap.get("expired_month") instanceof Integer){
            expired_month = (Integer) reqMap.get("expired_month");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired month field. Expected Integer.");
        }

        if(reqMap.get("expired_day") instanceof Integer){
            expired_day = (Integer) reqMap.get("expired_day");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired day field. Expected Integer.");
        }

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        
        try {
            Employee employee = employeeService.getByEmail(email);
            Stock old_stock = readymademenuService.getStockById(id, stock_id);
            String desc = "Update Stock ID :"+old_stock.getId()+" Old Qty : "+old_stock.getQty()+" Expired Date : "+old_stock.getExpired_Date();
            Stock s = readymademenuService.updateStock(id, stock_id, qty, LocalDateTime.of(expired_year, expired_month, expired_day, 0, 0, 0));
            Transaction tran = new Transaction(qty, "readymademenu", id, "updated", desc, LocalDateTime.of(expired_year, expired_month, expired_day, 0, 0), employee);
            transactionService.save(tran);
            return ResponseEntity.status(HttpStatus.OK).body("Update Stock Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot Update Stock Id : "+stock_id+" from Menu Item Id :"+id);
        }
    }
    

    //Transaction Controllers

    //Get All Transaction
    @GetMapping("/transaction")
    public ResponseEntity<?> getAllTransaction() {
        List<Transaction> transactions = transactionService.getAll();

        List<ResGetTransaction> res = new ArrayList<>();
        for(Transaction trans : transactions){

            String product_name = transactionService.findProductNameById(trans.getId());
            res.add(new ResGetTransaction(trans.getId(), trans.getQty(), trans.getProduct_id(), trans.getProductType(), product_name, trans.getTransactionType(),
            trans.getDescription(), trans.getCreated_by().getId(), trans.getCreated_by().getAccount().getEmail(), trans.getExpired(), trans.getCreated_at()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    //Get Transaction By Id
    @GetMapping("/transaction/{id}")
    public Transaction getTransactionById(@PathVariable int id){
        return transactionService.getById(id);
    }

    //Add Stock
    @PostMapping(path = "/transaction/addTransaction")
    //@PreAuthorize("hasRole('INVENTORYSUPERVISOR')" )
    public ResponseEntity<?> AddNewStock(@RequestBody Map<String, Object> reqMap) {

        
        List<String> requiredFields = Arrays.asList("product_type", "product_id", "qty", "description", "exp_year", "exp_month", "exp_day", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //int id, int qty, int exp_year, int exp_month, int exp_day
        
        String product_type;
        int product_id;
        double qty; 
        String description;
        int exp_year;
        int exp_month;
        int exp_day;
        String email;

        if(reqMap.get("product_type") instanceof String){
            product_type = (String) reqMap.get("product_type");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product type field. Expected String.");
        }

        if(reqMap.get("product_id") instanceof Integer){
            product_id = (Integer) reqMap.get("product_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product id field. Expected Integer.");
        }

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid qty field. Expected Number");
        }

        if(reqMap.get("description") instanceof String){
            description = (String) reqMap.get("description");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid description field. Expected String.");
        }

        if(reqMap.get("exp_year") instanceof Integer){
            exp_year = (Integer) reqMap.get("exp_year");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired year field. Expected Integer.");
        }

        if(reqMap.get("exp_month") instanceof Integer){
            exp_month = (Integer) reqMap.get("exp_month");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired month field. Expected Integer.");
        }

        if(reqMap.get("exp_day") instanceof Integer){
            exp_day = (Integer) reqMap.get("exp_day");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid expired day field. Expected Integer.");
        }

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        try {

            if("ingredient".equalsIgnoreCase(product_type)){

                ingrService.addStock(product_id, qty, exp_year, exp_month, exp_day);

                InventorySupervisor inven = invenService.getByEmail(email);
                Transaction trans = new Transaction(qty, product_type, product_id, "inbound", description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
                transactionService.save(trans);

                return ResponseEntity.status(HttpStatus.OK).body("Add Stock to Ingredient Successful");
            }else  if("readymademenu".equalsIgnoreCase(product_type)){

                readymademenuService.addStock(product_id, qty, exp_year, exp_month, exp_day);

                InventorySupervisor inven = invenService.getByEmail(email);
                Transaction trans = new Transaction(qty, product_type, product_id, "inbound", description, LocalDateTime.of(exp_year, exp_month, exp_day, 0, 0), inven);
                transactionService.save(trans);

                return ResponseEntity.status(HttpStatus.OK).body("Add Stock to ReadyMadeMenu Successful");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product type field. Wrong Type"); 
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Add New Stock"); 
        }

    }

}
