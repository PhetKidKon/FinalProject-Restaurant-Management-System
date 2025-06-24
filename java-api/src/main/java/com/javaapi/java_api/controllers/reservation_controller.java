package com.javaapi.java_api.controllers;

import com.javaapi.java_api.services.account.*;
import com.javaapi.java_api.services.product.IngredientBaseMenuService;
import com.javaapi.java_api.services.product.IngredientService;
import com.javaapi.java_api.services.product.MenuitemService;
import com.javaapi.java_api.services.product.ReadyMadeMenuService;
import com.javaapi.java_api.services.product.TransactionService;
import com.javaapi.java_api.services.reservation.*;

import com.javaapi.java_api.entity.account.*;
import com.javaapi.java_api.entity.product.*;
import com.javaapi.java_api.entity.reservation.*;
import com.javaapi.java_api.payload.response.ResBill;
import com.javaapi.java_api.payload.response.ResOrder;
import com.javaapi.java_api.payload.response.ResOrderItem;
import com.javaapi.java_api.payload.response.StockUsage;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;









@RestController
@RequestMapping("/api")
public class reservation_controller {

    @Autowired
    private SystemAdminService systemAdminService;

    @Autowired
    private CashierService cashierService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private GuestService guestService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private ReservationService reserveService;

    @Autowired
    private RestaurantTableService tableService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private MenuitemService menuItemService;

    @Autowired
    private IngredientBaseMenuService ingredientBaseMenuService;

    @Autowired
    private ReadyMadeMenuService readyMadeMenuService;

    @Autowired
    private IngredientService ingrService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private OrderBoardcastService orderBoardcastService;

    @Autowired
    private BillService billService;



    //Table Controller

    //Get All Table
    @GetMapping("/table")
    public List<RestaurantTable> getAllTable() {
        return tableService.getAll();
    }

    //Get By id Table
    @GetMapping("/table/{id}")
    public RestaurantTable getByIdTable(@PathVariable int id) {
        return tableService.getById(id);
    }

    //Create New Table
    @PostMapping("/table/create")
    public ResponseEntity<?> CreateTable(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("table_name", "capacity", "email");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        String table_name;
        int capacity;
        String email;

        if(reqMap.get("table_name") instanceof String){
            table_name = (String) reqMap.get("table_name");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid table name field. Expected String.");
        }
        if(reqMap.get("capacity") instanceof Integer){
            capacity = (Integer) reqMap.get("capacity");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid capacity field. Expected Integer.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        //Check if email already exists
        try {
            SystemAdmin sa = systemAdminService.getByEmail(email);
            RestaurantTable table =  new RestaurantTable(table_name, "available", capacity,sa);

            tableService.save(table);
            return ResponseEntity.status(HttpStatus.OK).body("Add New Table Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Create Table");
        }
    }

    //Update
    @PostMapping("/table/{id}/update")
    public ResponseEntity<?> UpdateTable(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("table_name", "capacity", "status", "istablenameupdate");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        String table_name;
        int capacity;
        String status;
        boolean istablenameupdate;
        if(reqMap.get("capacity") instanceof Integer){
            capacity = (Integer) reqMap.get("capacity");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid capacity field. Expected Integer.");
        }
        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }
        if(reqMap.get("istablenameupdate") instanceof Boolean){
            istablenameupdate = (Boolean) reqMap.get("istablenameupdate");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid istablenameupdate field. Expected Boolean.");
        }

        if(istablenameupdate){

            if(reqMap.get("table_name") instanceof String){
                table_name = (String) reqMap.get("table_name");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid table name field. Expected String.");
            }

            try {
                tableService.getByTableName(table_name);
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Table name Already Exist"); 
            } catch (Exception e) {
                RestaurantTable table = tableService.getById(id);
                table.setTable_name(table_name);
                table.setStatus(status);
                table.setCapacity(capacity);
                tableService.save(table);
                return ResponseEntity.status(HttpStatus.OK).body("Update Table Successful");
            }

        }else{
            try {
                RestaurantTable table = tableService.getById(id);
                table.setStatus(status);
                table.setCapacity(capacity);
                tableService.save(table);
                tableService.save(table);
                return ResponseEntity.status(HttpStatus.OK).body("Update Table Successful");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Update Table");
            }

        }     

        
        
    }

    //Delete 
    @DeleteMapping("/table/{id}/delete")
    public ResponseEntity<?> DeleteTable(@PathVariable int id) {
        try {
            tableService.getById(id);
            tableService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Delete Table Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Delete Table");
        }
    }

    //Reservation Controllers

    //Get All Reservation
    @GetMapping("/reservation")
    public List<Reservation> getAllReservation() {
        return reserveService.getAll();
    }

    //Get All Reservation By Status
    @GetMapping("/reservation/status/{status}")
    public List<Reservation> getAllReservationByStatus(@PathVariable String status) {
        status = status.toLowerCase();
        return reserveService.getByStatus(status);
    }

    //Get By id Reservation
    @GetMapping("/reservation/{id}")
    public Reservation getByIdReservation(@PathVariable int id) {
        return reserveService.getById(id);
    }

    //Create New Table
    @PostMapping("/reservation/create")
    public ResponseEntity<?> CreateReservation(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("people_count");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //int quene_number, String status, int people_count, Customer customer

        int people_count; 
        String customer_email="";
        String phone = "***";
        String fname = "guest";
        String lname = "guest";

        if(reqMap.get("people_count") instanceof Integer){
            people_count = (Integer) reqMap.get("people_count");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid people count field. Expected Integer.");
        }

        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        }

        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        }

        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        }


        boolean ishave_customer=false;

        if(reqMap.get("customer_email") instanceof String){
            customer_email = (String) reqMap.get("customer_email");
            ishave_customer=true;
        } else if(reqMap.containsKey("customer_email")){
            ishave_customer=true;
        }

        Object dayObj = reqMap.get("checkin_day");
        Object monthObj = reqMap.get("checkin_month");
        Object yearObj = reqMap.get("checkin_year");
        Object hourObj = reqMap.get("checkin_hour");
        Object minuteObj = reqMap.get("checkin_minute");

        boolean hasAnyCheckinField = dayObj != null || monthObj != null || yearObj != null || hourObj != null || minuteObj != null;
        boolean hasAllCheckinFields = dayObj != null && monthObj != null && yearObj != null && hourObj != null && minuteObj != null;

        // ถ้ามีบาง field แต่ไม่ครบทั้ง 3 → error
        if (hasAnyCheckinField && !hasAllCheckinFields) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invaild input data : If Check In Time must have all fields (day, month, year, hour, minuteObj) or none.");
        }

        int checkinDay=-1;
        int checkinMonth=-1;
        int checkinYear=-1;
        int checkinHour=0;
        int checkinMinute=0;

        // ถ้ามีครบแล้ว ตรวจสอบว่าเป็น Integer ทั้งหมด
        if (hasAllCheckinFields) {
            if (!(dayObj instanceof Integer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid Check In Time Day field. Expected Integer.");
            }
            if (!(monthObj instanceof Integer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid Check In Time Month field. Expected Integer.");
            }
            if (!(yearObj instanceof Integer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid Check In Time Year field. Expected Integer.");
            }

            if (!(hourObj instanceof Integer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid Check In Time Hour field. Expected Integer.");
            }

            if (!(minuteObj instanceof Integer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid Check In Time Minute field. Expected Integer.");
            }

            checkinDay = (Integer) dayObj;
            checkinMonth = (Integer) monthObj;
            checkinYear = (Integer) yearObj;
            checkinHour = (Integer) hourObj;
            checkinMinute = (Integer) minuteObj;

        }

        //Check if email already exists
        try {

            LocalDateTime date = LocalDateTime.now();

            if(hasAllCheckinFields && checkinDay > 0 && checkinMonth > 0 && checkinYear > 0){
                int christianYear = checkinYear - 543;
                date = LocalDateTime.of(christianYear,checkinMonth,checkinDay,checkinHour,checkinMinute, 0);
            }


            System.out.println(date);


            if(ishave_customer){
                Member member = memberService.getByEmail(customer_email);
                Reservation reserve = new Reservation("pending", people_count, member, date);
                reserve = reserveService.saveAndFlush(reserve);
                return ResponseEntity.status(HttpStatus.OK).body("จองคิวสำเร็จหมายเลขคิวคือ : "+reserve.getId());
            }else{
                Guest guest = new Guest(fname,lname,phone);
                guestService.save(guest);
                Customer customer = customerService.getById(guest.getId());
                Reservation reserve = new Reservation("pending", people_count, customer, date);
                reserve = reserveService.saveAndFlush(reserve);
                return ResponseEntity.status(HttpStatus.OK).body("จองคิวสำเร็จหมายเลขคิวคือ : "+reserve.getId());
            }

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }

    }

    //Update Status
    @PostMapping("/reservation/{id}/updatestatus")
    public ResponseEntity<?> UpdateReservationStatus(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("status");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        String status;

        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }

        try {
            Reservation reserve = reserveService.getById(id);
            reserve.setStatus(status);
            reserveService.save(reserve);
            return ResponseEntity.status(HttpStatus.OK).body("Update Reservation Status Successful");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
    
    //Delete 
    @DeleteMapping("/reservation/{id}/delete")
    public ResponseEntity<?> DeleteReservation(@PathVariable int id) {
        try {
            reserveService.getById(id);
            reserveService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Delete Table Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Delete Table");
        }
    }


    //Order Controller

    //Get All 
    @GetMapping("/order")
    public List<?> getAllOrder() {
        List<Order> orders = orderService.getAll();
        List<ResOrder> res = new ArrayList<>();
        for(Order order : orders){
            ResOrder res_order = new ResOrder(order.getId(), order.getReservation().getCustomer().getId(), order.getReservation().getCustomer().getRole(), order.getReservation().getCustomer().getFname(), order.getReservation().getCustomer().getLname()
            , order.getReservation().getCustomer().getPhone(), order.getStatus(), order.getTotal_price(), order.getCreated_by().getId(), order.getCreated_by().getFname(), order.getCreated_by().getAccount().getEmail(), order.getReservation().getId()
            , order.getTable().getId(), order.getTable().getTable_name(), order.getOrderItems()
            , order.getYears(), order.getMonth(), order.getDay());
            res.add(res_order);
        }
        return res;
    }

    //Get All Received Order
    @GetMapping("/order/received")
    public List<?> getAllOrderReceived() {
        List<Order> orders = orderService.getByStatus("received");
        List<ResOrder> res = new ArrayList<>();
        for(Order order : orders){
            ResOrder res_order = new ResOrder(order.getId(), order.getReservation().getCustomer().getId(), order.getReservation().getCustomer().getRole(), order.getReservation().getCustomer().getFname(), order.getReservation().getCustomer().getLname()
            , order.getReservation().getCustomer().getPhone(), order.getStatus(), order.getTotal_price(), order.getCreated_by().getId(), order.getCreated_by().getFname(), order.getCreated_by().getAccount().getEmail(), order.getReservation().getId()
            , order.getTable().getId(), order.getTable().getTable_name(), order.getOrderItems()
            , order.getYears(), order.getMonth(), order.getDay());
            res.add(res_order);
        }
        return res;
        //received
    }
    

    //Get By id 
    @GetMapping("/order/{id}")
    public ResOrder getByIdOrder(@PathVariable int id) {
        Order order = orderService.getById(id);
        ResOrder res_order = new ResOrder(order.getId(), order.getReservation().getCustomer().getId(), order.getReservation().getCustomer().getRole(), order.getReservation().getCustomer().getFname(), order.getReservation().getCustomer().getLname()
            , order.getReservation().getCustomer().getPhone(), order.getStatus(), order.getTotal_price(), order.getCreated_by().getId(), order.getCreated_by().getFname(), order.getCreated_by().getAccount().getEmail(), order.getReservation().getId()
            , order.getTable().getId(), order.getTable().getTable_name(), order.getOrderItems()
            , order.getYears(), order.getMonth(), order.getDay());
        

        return res_order;
    }

    //Update Status
    @PostMapping("/order/{id}/updatestatus")
    public ResponseEntity<?> UpdateOrderStatus(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("status");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        String status;

        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }

        try {
            Order order = orderService.getById(id);
            order.setStatus(status);
            orderService.save(order);
            orderBoardcastService.boardcastOrderAdded(order);
            return ResponseEntity.status(HttpStatus.OK).body("Update Order Status Successful");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    //Update Status
    @PostMapping("/order/{id}/cancelorder")
    public ResponseEntity<?> CancelOrder(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        try {
            Order order = orderService.getById(id);

            List<OrderItem> orderItems = order.getOrderItems();
            List<Transaction> allTrans = new ArrayList<>();
            for (OrderItem orderItem : orderItems) {
                List<Transaction> trans = transactionService.findByDescription("Order id : " + id + " | OrderItem id : " + orderItem.getId());
                for (Transaction tran : trans) {
                    if ("ingredient".equalsIgnoreCase(tran.getProductType())) {
                        ingrService.addStock(tran.getProduct_id(), tran.getQty(), tran.getExpiredYears(), tran.getExpiredMonth(), tran.getExpiredDay());
                        Transaction new_tran = new Transaction(tran.getQty(), tran.getProductType(), tran.getProduct_id(), "inbound",
                                tran.getDescription().concat(" | Cancel"), tran.getExpired(), tran.getCreated_by());
                        transactionService.save(new_tran);
                    } else if ("readymademenu".equalsIgnoreCase(tran.getProductType())) {
                        readyMadeMenuService.addStock(tran.getProduct_id(), tran.getQty(), tran.getExpiredYears(), tran.getExpiredMonth(), tran.getExpiredDay());
                        Transaction new_tran = new Transaction(tran.getQty(), tran.getProductType(), tran.getProduct_id(), "inbound",
                                tran.getDescription().concat(" | Cancel"), tran.getExpired(), tran.getCreated_by());
                        transactionService.save(new_tran);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Transaction Invaild Information");
                    }
                    allTrans.add(tran);
                }
            }
            
            order.setStatus("cancelled");
            RestaurantTable orderTable = order.getTable();
            orderTable.setStatus("available");
            tableService.save(orderTable);
            orderService.save(order);
            orderBoardcastService.boardcastOrderAdded(order);
            return ResponseEntity.status(HttpStatus.OK).body("Update Order Status Successful");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    //Create new Order
    @PostMapping("/order/create")
    public ResponseEntity<?> CreateOrder(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("table_id", "cashier_email", "ishave_reservation");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } 

        int table_id;
        String cashier_email;
        boolean ishave_reservation;

        if(reqMap.get("table_id") instanceof Integer){
            table_id = (Integer) reqMap.get("table_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Table ID field. Expected Integer.");
        }

        if(reqMap.get("cashier_email") instanceof String){
            cashier_email = (String) reqMap.get("cashier_email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Cashier Email field. Expected Integer.");
        }

        if(reqMap.get("ishave_reservation") instanceof Boolean){
            ishave_reservation = (Boolean) reqMap.get("ishave_reservation");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Is have Reservation field. Expected Boolean.");
        }


        try {
            Cashier cashier = cashierService.getByEmail(cashier_email);
            RestaurantTable table = tableService.getById(table_id);

            if(!("available".equals(table.getStatus()))){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: This Table not available.");
            }

            if(ishave_reservation){

                if (!reqMap.containsKey("reservation_id") || reqMap.get("reservation_id") == null || reqMap.get("reservation_id").toString().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Reservation ID Key or Value is missing"); 
                }

                Reservation reserve;

                if(reqMap.get("reservation_id") instanceof Integer){
                    int reserve_id = (Integer) reqMap.get("reservation_id");
                    reserve = reserveService.getById(reserve_id);
                }else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Reservation Id field. Expected Integer.");
                }

                if(!("pending".equals(reserve.getStatus()))){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Reservation isn't in pending.");
                }

                if(table.getCapacity() < reserve.getPeople_count()){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: People Count is more than Table Capacity.");
                }
                
                List<OrderItem> orderItems = new ArrayList<>();
                
                table = tableService.saveAndFlush(table);
                Order order = new Order(orderItems, table, reserve, cashier);
                orderService.saveAndFlush(order);
                reserve.setStatus("checked_in");
                reserveService.save(reserve);
                table.setStatus("occupied");
                tableService.save(table);
                orderBoardcastService.boardcastOrderAdded(order);
                return ResponseEntity.status(HttpStatus.OK).body("Add New Order ID : "+order.getId()+" Successful");

            }else {

                if (!reqMap.containsKey("people_count") || reqMap.get("people_count") == null || reqMap.get("people_count").toString().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : People Count Key or Value is missing"); 
                }

                int people_count;

                if(reqMap.get("people_count") instanceof Integer){
                    people_count = (Integer) reqMap.get("people_count");
                }else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid People Count field. Expected Integer.");
                }

                if(table.getCapacity() < people_count){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: People Count is more than Table Capacity.");
                }

                boolean ishave_customer=false;
                String member_email="";
                if(reqMap.get("member_email") instanceof String){
                    member_email = (String) reqMap.get("member_email");
                    ishave_customer=true;
                }

                Customer customer = new Customer();

                if(ishave_customer){
                    Member member = memberService.getByEmail(member_email);
                    customer = customerService.getById(member.getId());
                }else {
                    Guest guest = new Guest("guest","guest","***");
                    guest = guestService.saveAndFlush(guest);
                    customer = customerService.getById(guest.getId());
                }
                
                LocalDateTime date = LocalDateTime.now();
                Reservation reserve = new Reservation("pending", people_count, customer, date);
                
                List<OrderItem> orderItems = new ArrayList<>();
                
                reserve = reserveService.saveAndFlush(reserve);
                Order order = new Order(orderItems, table, reserve, cashier);
                orderService.saveAndFlush(order);
                reserve.setStatus("checked_in");
                reserveService.save(reserve);
                table.setStatus("occupied");
                tableService.save(table);
                orderBoardcastService.boardcastOrderAdded(order);
                return ResponseEntity.status(HttpStatus.OK).body("Add New Order ID : "+order.getId()+" Successful");
            } 
        }catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }

    }

    //Get By id 
    @GetMapping("/order/{id}/orderitem")
    public List<?> getOrderItemByIdOrderId(@PathVariable int id) {
        Order order = orderService.getById(id);
        List<ResOrderItem> res = new ArrayList<>();
        for(OrderItem oi : order.getOrderItems()){
            ResOrderItem new_orderitem = new ResOrderItem(oi.getId(), oi.getMenuItem().getName(), oi.getMenuItem().getUnit(),
            oi.getMenuItem().getDescription(), oi.getQty(), oi.getTotal_price(), oi.getMenuItem().getPrice(), oi.getComment(),
            oi.getDay(), oi.getMonth(), oi.getYears());
            res.add(new_orderitem);
        }

        return res;
    }

    //Create Order Item
    @PostMapping("/order/{id}/createorderitem")
    public ResponseEntity<?> createOrderItem(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {
        //OrderItem(MenuItem menuItem, int qty, double total_price, String comment)

        List<String> requiredFields = Arrays.asList("menu_id", "qty");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        } //int quene_number, String status, int people_count, Customer customer

        int menu_id;
        double qty;
        String comment;

        if(reqMap.get("menu_id") instanceof Integer){
            menu_id = (Integer) reqMap.get("menu_id");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Menu Id field. Expected Integer.");
        }

        if(reqMap.get("qty") instanceof Double){
            qty = (Double) reqMap.get("qty");
        } else if(reqMap.get("qty") instanceof Integer){
            qty = ((Integer) reqMap.get("qty")).doubleValue();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Quantity field. Expected Number");
        }

        if(reqMap.get("comment") instanceof String){
            comment = (String) reqMap.get("comment");
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Comment field. Expected String");
        }

        try {
            MenuItem menu = menuItemService.getById(menu_id);
            Order order = orderService.getById(id);

            if(!"received".equalsIgnoreCase(order.getStatus())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Order Cannot Using");
            }

            if("readymademenu".equalsIgnoreCase(menu.getType())){

                ReadyMadeMenu readymade = readyMadeMenuService.getById(menu_id);
                double total_price = readymade.getPrice() * qty;
                OrderItem orderItem = new OrderItem(menu, qty, total_price, comment);

                List<StockUsage> stock_usage = readyMadeMenuService.decreaseStockQtyFIFO(readymade, qty);

                orderItem = orderItemService.saveAndFlush(orderItem);
                order = orderService.getOrderItem(orderItem, id);

                for(StockUsage stock : stock_usage){
                    Transaction tran = stock.getTransaction("readymademenu", order.getCreated_by(), readymade.getId(), readymade.getName(), order.getId(), orderItem.getId());
                    transactionService.save(tran);
                }

                orderBoardcastService.boardcastOrderAddedOrderItem(order.getId(), orderItem);
                
            }else if("ingredientbasemenu".equalsIgnoreCase(menu.getType())){
                
                IngredientBaseMenu ingrbase = ingredientBaseMenuService.getById(menu_id);
                double total_price = ingrbase.getPrice() * qty;
                OrderItem orderItem = new OrderItem(menu, qty, total_price, comment);

                List<StockUsage> stock_usage = ingredientBaseMenuService.decreaseStockQtyFIFO(ingrbase, qty);

                
                orderItem = orderItemService.saveAndFlush(orderItem);
                order = orderService.getOrderItem(orderItem, id);

                for(StockUsage stock : stock_usage){
                    Transaction tran = stock.getIngrTransaction("ingredientbasemenu", order.getCreated_by(), ingrbase.getId(), ingrbase.getName(), order.getId(), orderItem.getId());
                    transactionService.save(tran);
                }

                orderBoardcastService.boardcastOrderAddedOrderItem(order.getId(), orderItem);

            }else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Wrong Menu Type");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Add Menu : "+menu.getName()+" to Order id : "+order.getId()+" Successful");

        }catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    //Create Order Item
    @PostMapping("/order/{id}/createorderitems")
    public ResponseEntity<?> createOrderItems(@PathVariable int id, @RequestBody List<Map<String, Object>> reqMaps) {
        //OrderItem(MenuItem menuItem, int qty, double total_price, String comment)

        for(Map<String, Object> reqMap : reqMaps) {
            if (reqMap == null || reqMap.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data: Empty or null map provided.");
            }
            List<String> requiredFields = Arrays.asList("menu_id", "qty");
            for (String field : requiredFields){
                if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
                }
            } //int quene_number, String status, int people_count, Customer customer

            int menu_id;
            double qty;
            String comment;

            if(reqMap.get("menu_id") instanceof Integer){
                menu_id = (Integer) reqMap.get("menu_id");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Menu Id field. Expected Integer.");
            }

            if(reqMap.get("qty") instanceof Double){
                qty = (Double) reqMap.get("qty");
            } else if(reqMap.get("qty") instanceof Integer){
                qty = ((Integer) reqMap.get("qty")).doubleValue();
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Quantity field. Expected Number");
            }

            if(reqMap.get("comment") instanceof String){
                comment = (String) reqMap.get("comment");
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Comment field. Expected String");
            }

            try {
                MenuItem menu = menuItemService.getById(menu_id);
                Order order = orderService.getById(id);

                if(!"received".equalsIgnoreCase(order.getStatus())){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Order Cannot Using");
                }

                if("readymademenu".equalsIgnoreCase(menu.getType())){

                    ReadyMadeMenu readymade = readyMadeMenuService.getById(menu_id);
                    double total_price = readymade.getPrice() * qty;
                    OrderItem orderItem = new OrderItem(menu, qty, total_price, comment);

                    List<StockUsage> stock_usage = readyMadeMenuService.decreaseStockQtyFIFO(readymade, qty);

                    orderItem = orderItemService.saveAndFlush(orderItem);
                    order = orderService.getOrderItem(orderItem, id);

                    for(StockUsage stock : stock_usage){
                        Transaction tran = stock.getTransaction("readymademenu", order.getCreated_by(), readymade.getId(), readymade.getName(), order.getId(), orderItem.getId());
                        transactionService.save(tran);
                    }

                    orderBoardcastService.boardcastOrderAddedOrderItem(order.getId(), orderItem);
                    
                }else if("ingredientbasemenu".equalsIgnoreCase(menu.getType())){
                    
                    IngredientBaseMenu ingrbase = ingredientBaseMenuService.getById(menu_id);
                    double total_price = ingrbase.getPrice() * qty;
                    OrderItem orderItem = new OrderItem(menu, qty, total_price, comment);

                    List<StockUsage> stock_usage = ingredientBaseMenuService.decreaseStockQtyFIFO(ingrbase, qty);

                    
                    orderItem = orderItemService.saveAndFlush(orderItem);
                    order = orderService.getOrderItem(orderItem, id);

                    for(StockUsage stock : stock_usage){
                        Transaction tran = stock.getIngrTransaction("ingredientbasemenu", order.getCreated_by(), ingrbase.getId(), ingrbase.getName(), order.getId(), orderItem.getId());
                        transactionService.save(tran);
                    }

                    orderBoardcastService.boardcastOrderAddedOrderItem(order.getId(), orderItem);

                }else {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Wrong Menu Type");
                }

                

            }catch (ResponseStatusException e) {
                return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
            }

        }

        return ResponseEntity.status(HttpStatus.OK).body("Add Menus Successful");

    }

    //Cancel OrderItem
    @PostMapping("/order/{id}/orderitem/{orderitem_id}/cancelorder")
    public ResponseEntity<?> cancelOrderItemFromOrder(@PathVariable int id, @PathVariable int orderitem_id) {

        try {

            //Get OrderItem From Order
            Order order = orderService.getById(id);
            
            //Remove Order Item From Order
            order = orderService.removeOrderItem(order, orderitem_id);
            
            //Get Transaction Order To Return Stock Stock
            List<Transaction> trans = transactionService.findByDescription("Order id : "+id+" | OrderItem id : "+orderitem_id);
            for(Transaction tran : trans){
                if("ingredient".equalsIgnoreCase(tran.getProductType())){
                    ingrService.addStock(tran.getProduct_id(), tran.getQty(), tran.getExpiredYears(), tran.getExpiredMonth(), tran.getExpiredDay());

                    Transaction new_tran = new Transaction(tran.getQty(), tran.getProductType(), tran.getProduct_id(), "inbound", 
                    tran.getDescription().concat(" | Cancel"), tran.getExpired(), tran.getCreated_by());

                    transactionService.save(new_tran);

                }else if("readymademenu".equalsIgnoreCase(tran.getProductType())){

                    readyMadeMenuService.addStock(tran.getProduct_id(), tran.getQty(), tran.getExpiredYears(), tran.getExpiredMonth(), tran.getExpiredDay());

                    Transaction new_tran = new Transaction(tran.getQty(), tran.getProductType(), tran.getProduct_id(), "inbound", 
                    tran.getDescription().concat(" | Cancel"), tran.getExpired(), tran.getCreated_by());

                    transactionService.save(new_tran); 

                }else{
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Transaction Invaild Information");
                }
            }

            return ResponseEntity.status(HttpStatus.OK).body(trans);
            
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
        
    }
    
    

    //Delete 
    @DeleteMapping("/order/{id}/delete")
    public ResponseEntity<?> DeleteOrder(@PathVariable int id) {
        try {
            Order order = orderService.getById(id);
            orderService.deleteById(id);
            orderBoardcastService.boardcastOrderRemove(order);
            return ResponseEntity.status(HttpStatus.OK).body("Delete Table Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Cannot Delete Table");
        }
    }

    //OrderItem Controller

    //Get All 
    @GetMapping("/orderitem")
    public List<OrderItem> getAllOrderItem() {
        return orderItemService.getAll();
    }

    //Get By id 
    @GetMapping("/orderitem/{id}")
    public OrderItem getByIdOrderItem(@PathVariable int id) {
        return orderItemService.getById(id);
    }

    @PostMapping("/order/check-stock")
    public ResponseEntity<?> checkOrderMenuStock(@RequestBody List<Map<String, Object>> orderMenus) {
        // Map<ingredientId, [qty, Set<menuName>]>
        Map<Integer, Double> ingredientNeeds = new HashMap<>();
        Map<Integer, Set<String>> ingredientMenuNames = new HashMap<>();
        Map<Integer, String> ingredientNameMap = new HashMap<>();
        Map<Integer, Double> readymadeNeeds = new HashMap<>();
        Map<Integer, String> readymadeNameMap = new HashMap<>();

        for (Map<String, Object> menu : orderMenus) {
            int menuId = (Integer) menu.get("menu_id");
            double qty = menu.get("qty") instanceof Integer ? ((Integer) menu.get("qty")).doubleValue() : (Double) menu.get("qty");
            MenuItem menuItem = menuItemService.getById(menuId);
            if ("ingredientbasemenu".equalsIgnoreCase(menuItem.getType())) {
                IngredientBaseMenu ingrMenu = ingredientBaseMenuService.getById(menuId);
                for (MenuIngredient usage : ingrMenu.getIngr_used()) {
                    Ingredients ingr = usage.getIngr_used();
                    int ingrId = ingr.getId();
                    double totalNeed = usage.getQty() * qty;
                    ingredientNeeds.put(ingrId, ingredientNeeds.getOrDefault(ingrId, 0.0) + totalNeed);
                    ingredientNameMap.put(ingrId, ingr.getName());
                    ingredientMenuNames.computeIfAbsent(ingrId, k -> new HashSet<>()).add(ingrMenu.getName());
                }
            } else if ("readymademenu".equalsIgnoreCase(menuItem.getType())) {
                readymadeNeeds.put(menuId, readymadeNeeds.getOrDefault(menuId, 0.0) + qty);
                readymadeNameMap.put(menuId, menuItem.getName());
            }
        }

        List<Map<String, Object>> insufficient = new ArrayList<>();
        for (Map.Entry<Integer, Double> entry : ingredientNeeds.entrySet()) {
            Ingredients ingr = ingrService.getById(entry.getKey());
            double available = ingr.getAvailableStockQty(); // ใช้ method นี้แทน
            double required = entry.getValue();
            if (available < required) {
                Map<String, Object> m = new HashMap<>();
                m.put("type", "ingredient");
                m.put("ingredient_id", ingr.getId());
                m.put("ingredient_name", ingr.getName());
                m.put("required_qty", required);
                m.put("available_qty", available);
                m.put("used_in_menus", ingredientMenuNames.get(entry.getKey()));
                insufficient.add(m);
            }
        }
        for (Map.Entry<Integer, Double> entry : readymadeNeeds.entrySet()) {
            ReadyMadeMenu menu = readyMadeMenuService.getById(entry.getKey());
            double available = menu.getAvailableStockQty();
            if (available < entry.getValue()) {
                Map<String, Object> m = new HashMap<>();
                m.put("type", "readymade");
                m.put("menu_id", menu.getId());
                m.put("menu_name", menu.getName());
                m.put("required_qty", entry.getValue());
                m.put("available_qty", available);
                insufficient.add(m);
            }
        }

        if (insufficient.isEmpty()) { 
            return ResponseEntity.ok("Stock is sufficient for all menus.");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(insufficient);
        }
    }

    //Get All OrderItem By Order Id

    //Bill Controller

    @GetMapping("/bill")
    public List<Bill> getAllBill() {
        List<Bill> bill = billService.getAll();

        return billService.getAll();
    }

    @GetMapping("/bill/{id}")
    public Bill getByIdBill(@PathVariable int id) {
        return billService.getById(id);
    }

    @PostMapping("/bill/create") 
    public ResponseEntity<?> createdBill(@RequestBody int order_id) {
        
        try {

            Order order = orderService.getById(order_id);

            if(!"received".equalsIgnoreCase(order.getStatus())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Order Cannot Using");
            }

            if(order.getReservation() == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Order is not have Reservation");
            }

            RestaurantTable table = order.getTable();
            table.setStatus("available");
            order.setStatus("completed");
            tableService.save(table);
            orderService.save(order);
            Bill bill = new Bill(order, order.getTotal_price(), "unpaid");
            billService.save(bill);

            return ResponseEntity.status(HttpStatus.OK).body("Create Bill Successful");

            
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
    
    //unpaid
    @GetMapping("/bill/unpaid")
    public List<Bill> getAllUnpaidBill() {
        return billService.getByStatus("unpaid");
    }

    @GetMapping("/bill/paid")
    public List<Bill> getAllPaidBill() {
        return billService.getByStatus("paid");
    }

    @PostMapping("/bill/{id}/pay") 
    public ResponseEntity<?> pay(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("payment_type");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }
        String payment_type;

        if(reqMap.get("payment_type") instanceof String){
            payment_type = (String) reqMap.get("payment_type");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Payment Type field. Expected String.");
        }
        
        try {

            Bill bill = billService.getById(id);
            if(!"unpaid".equalsIgnoreCase(bill.getStatus())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Bill Cannot Using");
            }

            bill.setStatus("paid");
            bill.setType(payment_type);
            LocalDateTime payment_date = LocalDateTime.now();
            bill.setPayment_date(payment_date.plusYears(543));
            billService.save(bill);

            return ResponseEntity.status(HttpStatus.OK).body("Pay Bill "+id+" Successful");
            
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/bill/{id}/cancel") 
    public ResponseEntity<?> cancelPayment(@PathVariable int id) {
        
        try {

            Bill bill = billService.getById(id);
            if(!"unpaid".equalsIgnoreCase(bill.getStatus())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Bill Cannot Using");
            }

            bill.setStatus("cancelled");
            billService.save(bill);

            return ResponseEntity.status(HttpStatus.OK).body("Cancel Bill "+id+" Successful");
            
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


}
