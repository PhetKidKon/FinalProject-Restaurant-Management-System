package com.javaapi.java_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.javaapi.java_api.entity.account.*;
import com.javaapi.java_api.security.JwtUtils;
import com.javaapi.java_api.services.account.*;

import io.jsonwebtoken.Claims;

import com.javaapi.java_api.payload.response.ResEmployeeLogin;

import java.util.*;








@RestController
@RequestMapping("/api/accounts")
public class account_controller {

    //Service Fields

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired 
    private PersonService personService;

    @Autowired
    CustomerService customerService;

    @Autowired
    GuestService guestService;

    @Autowired
    MemberService memberService;

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private InventorySupervisorService invenService;

    @Autowired
    private CashierService cashierService;

    @Autowired
    private SystemAdminService systemAdminService;

    @Autowired
    JwtUtils jwtUtils;

    //Authentication Controller

    //Signin
    @PostMapping("/signin/employee")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("email", "password");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String email;
        String password;

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        if(reqMap.get("password") instanceof String){
            password = (String) reqMap.get("password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
        }

        try {
            Employee employee = employeeService.getByEmail(email);
            if(password.equals(employee.getAccount().getPassword())){
                String role = "ROLE_"+employee.getRole().toUpperCase();
                String token = JwtUtils.generateToken(employee.getId(), email, role);
                ResEmployeeLogin res = new ResEmployeeLogin(token, role, email, employee.getFname());
                return ResponseEntity.status(HttpStatus.OK).body(res);
            }else{
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Worng Password ");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot Sign In ");
        }
    }

    @PostMapping("/signin/customer")
    public ResponseEntity<?> authenticateMember(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("email", "password");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String email;
        String password;

        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }

        if(reqMap.get("password") instanceof String){
            password = (String) reqMap.get("password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
        }

        try {
            Member member = memberService.getByEmail(email);
            if(password.equals(member.getAccount().getPassword())){
                String role = "ROLE_"+member.getRole().toUpperCase();
                String token = JwtUtils.generateToken(member.getId(), email, role);
                ResEmployeeLogin res = new ResEmployeeLogin(token, role, email, member.getFname());
                return ResponseEntity.status(HttpStatus.OK).body(res);
            }else{
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Worng Password ");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot Sign In ");
        }


    }

    //ValidateToken

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {

        String token = request.get("token");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is missing");
        }

        try {
            boolean isValid = jwtUtils.validateJwtToken(token);
            if (isValid) {
                Claims claims = JwtUtils.getClaims(token);
                String role = (String) claims.get("role");
                Map<String, Object> res = new HashMap<>();
                res.put("message", "Token is valid");
                res.put("role", role);
                return ResponseEntity.status(HttpStatus.OK).body(res);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is invalid or expired");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is invalid or expired");
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signout(@RequestBody Map<String, String> request) {

        String token = request.get("token");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is missing");
        }

        JwtUtils.revokeToken(token);
        return ResponseEntity.status(HttpStatus.OK).body("Token has been revoked successfully");
    }



    //Person Controller

    //get all
    @GetMapping("")
    //@PreAuthorize("hasRole('SYSTEMADMIN')")
    public List<Person> getPerson() {
        return personService.getAll();
    }
    
    //get by id
    @GetMapping("/person/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable int id) {
        Person person = personService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(person);
    }

    //Update
    @PostMapping("/person/create")
    public ResponseEntity<?> CreatePerson(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("fname", "lname", "phone", "role");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String role;
        String fname;
        String lname;
        String phone;
        

        
        if(reqMap.get("role") instanceof String){
            role = (String) reqMap.get("role");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role field. Expected String.");
        }
        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
        }
        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
        }
        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
        }

        if("guest".equalsIgnoreCase(role)){

            Guest guest = new Guest(fname, lname, phone);
            guestService.save(guest);
            return ResponseEntity.status(HttpStatus.OK).body("Create Guest Successful");

        }else {

            requiredFields = Arrays.asList("password", "email", "role");
            for (String field : requiredFields){
                if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
                }
            }

            String email;
            String password;
            if(reqMap.get("email") instanceof String){
                email = (String) reqMap.get("email");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
            }
            if(reqMap.get("password") instanceof String){
                password = (String) reqMap.get("password");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
            }
            try {
                if("member".equalsIgnoreCase(role)){
                    memberService.getByEmail(email);
                }else if("cashier".equalsIgnoreCase(role) || "inventorysupervisor".equalsIgnoreCase(role) || "systemadmin".equalsIgnoreCase(role)){
                    employeeService.getByEmail(email);
                }
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            } catch (ResponseStatusException e) {
                if("member".equalsIgnoreCase(role)){
                    Member member = new Member(fname, lname, phone, new Account(password, email));
                    memberService.save(member);
                    return ResponseEntity.status(HttpStatus.OK).body("Create Member Successful");
                }else if("cashier".equalsIgnoreCase(role)){
                    Cashier cashier = new Cashier(fname, lname, phone, new Account(password, email));
                    cashierService.save(cashier);
                    return ResponseEntity.status(HttpStatus.OK).body("Create Cashier Successful");
                }else if("inventorysupervisor".equalsIgnoreCase(role)){
                    InventorySupervisor inventorySupervisor = new InventorySupervisor(fname, lname, phone, new Account(password, email));
                    invenService.save(inventorySupervisor);
                    return ResponseEntity.status(HttpStatus.OK).body("Create Inventory Supervisor Successful");
                }else if("systemadmin".equalsIgnoreCase(role)){
                    SystemAdmin systemAdmin = new SystemAdmin(fname, lname, phone, new Account(password, email));
                    systemAdminService.save(systemAdmin);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated System Admin Successful");
                }else{
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Account Type");
                }
            }

            
            
        }
    }

    //Delete Person
    @DeleteMapping("/person/{id}/delete")
    public ResponseEntity<?> DeletePersonById(@PathVariable int id){
        personService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Person id : "+id+" Successful");
    }

    //Update
    @PostMapping("/person/{id}/update")
    public ResponseEntity<?> UpdatePersonInfo(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("fname", "lname", "phone", "role", "isemailupdate");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String role;
        String fname;
        String lname;
        String phone;

        
        if(reqMap.get("role") instanceof String){
            role = (String) reqMap.get("role");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Role field. Expected String.");
        }
        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
        }
        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
        }
        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
        }

        if("guest".equalsIgnoreCase(role)){

            Guest guest = guestService.getById(id);
            guest.setFname(fname);
            guest.setLname(lname);
            guest.setPhone(phone);
            guestService.save(guest);
            return ResponseEntity.status(HttpStatus.OK).body("Updated Guest Successful");

        }

        boolean isemailupdate;
        String email;
        String password;
        String status;

        if(reqMap.get("isemailupdate") instanceof Boolean){
            isemailupdate = (Boolean) reqMap.get("isemailupdate");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid is_email_update field. Expected Boolean.");
        }

        if(isemailupdate){

            if(reqMap.get("email") instanceof String){
                email = (String) reqMap.get("email");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
            }
            if(reqMap.get("password") instanceof String){
                password = (String) reqMap.get("password");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
            }
            if(reqMap.get("status") instanceof String){
                status = (String) reqMap.get("status");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
            }

            try {
                
                if("member".equalsIgnoreCase(role)){
                    memberService.getByEmail(email);
                }else if("cashier".equalsIgnoreCase(role) || "inventorysupervisor".equalsIgnoreCase(role) || "systemadmin".equalsIgnoreCase(role)){
                    employeeService.getByEmail(email);
                }
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email Already Exist"); 
            
            } catch (ResponseStatusException e) {

                

                if("member".equalsIgnoreCase(role)){
                    Member member = memberService.getById(id);
                    member.setFname(fname);
                    member.setLname(lname);
                    member.setPhone(phone);
                    Account account = new Account(password, email, status);
                    member.setAccount(account);
                    memberService.save(member);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated Member Successful");
                }else if("cashier".equalsIgnoreCase(role) || "inventorysupervisor".equalsIgnoreCase(role) || "systemadmin".equalsIgnoreCase(role)){
                    Employee employee = employeeService.getById(id);
                    employee.setFname(fname);
                    employee.setLname(lname);
                    employee.setPhone(phone);
                    Account account = new Account(password, email, status);
                    employee.setAccount(account);
                    employeeService.save(employee);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated "+ role +" Successful");
                }else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Account Role");
                }
                
            }

        }else {

            try {

                if(reqMap.get("password") instanceof String){
                password = (String) reqMap.get("password");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
                }
                if(reqMap.get("status") instanceof String){
                    status = (String) reqMap.get("status");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
                }

                if("member".equalsIgnoreCase(role)){
                    Member member = memberService.getById(id);
                    member.setFname(fname);
                    member.setLname(lname);
                    member.setPhone(phone);
                    member.getAccount().setPassword(password);
                    member.getAccount().setStatus(status);
                    memberService.save(member);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated Member Successful");
                }else if("cashier".equalsIgnoreCase(role) || "inventorysupervisor".equalsIgnoreCase(role) || "systemadmin".equalsIgnoreCase(role)){
                    Employee employee = employeeService.getById(id);
                    employee.setFname(fname);
                    employee.setLname(lname);
                    employee.setPhone(phone);
                    employee.getAccount().setPassword(password);
                    employee.getAccount().setStatus(status);
                    employeeService.save(employee);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated "+ role +" Successful");
                }else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Account Role");
                }
                
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot Update Account");
            }

        }
    }
    

    //Customer Controller

    //get all
    @GetMapping("/customer")
    //@PreAuthorize("hasRole('SYSTEMADMIN')")
    public List<Customer> getCustomer() {
        return customerService.getAll();
    }
    
    //get by id
    @GetMapping("/customer/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable int id) {
        Customer person = customerService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(person);
    }

    //Delete Customer
    @DeleteMapping("/customer/{id}/delete")
    public ResponseEntity<?> DeleteCustomerById(@PathVariable int id){
        customerService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Person id : "+id+" Successful");
    }
    //String fname, String lname, String phone

    //Guest Controller

    //create
    @PostMapping("/guest/create")
    public ResponseEntity<?> CreateGuest(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("isEmpty");
        
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Missing isEmpty"); 
            }
        }

        boolean isEmpty;

        if(reqMap.get("isEmpty") instanceof Boolean){
            isEmpty = (Boolean) reqMap.get("isEmpty");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid isEmpty field. Expected Boolean.");
        }

        if(!isEmpty){
            requiredFields = Arrays.asList("fname", "lname", "phone");
            for (String field : requiredFields){
                if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
                }
            }

            String fname;
            String lname;
            String phone;

            if(reqMap.get("fname") instanceof String){
                fname = (String) reqMap.get("fname");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
            }
            if(reqMap.get("lname") instanceof String){
                lname = (String) reqMap.get("lname");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
            }
            if(reqMap.get("phone") instanceof String){
                phone = (String) reqMap.get("phone");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
            }

            Guest guest = new Guest(fname, lname, phone);
            guestService.save(guest);
            return ResponseEntity.status(HttpStatus.OK).body("Created Guest Successful");
        }else{
            guestService.createWithoutInput();
            return ResponseEntity.status(HttpStatus.OK).body("Created Guest without Successful");
        }

    }

    //Member Controller

    //create

    //get by all
    @GetMapping("/member")
    public ResponseEntity<?> getAllMember() {
        List<Member> member = memberService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(member);
    }

    @PostMapping("/member/create")
    public ResponseEntity<?> CreateMember(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("password", "email", "fname", "lname", "phone");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String password;
        String email;
        String fname;
        String lname;
        String phone;

        if(reqMap.get("password") instanceof String){
            password = (String) reqMap.get("password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
        }
        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
        }
        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
        }

        boolean emailExists = false;
        try {
            employeeService.getByEmail(email);
            emailExists = true;
        } catch (ResponseStatusException e) {
            // ไม่พบใน employee
        }
        try {
            memberService.getByEmail(email);
            emailExists = true;
        } catch (ResponseStatusException e) {
            // ไม่พบใน member
        }
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("อีเมลล์นี้ถูกใช้ไปแล้ว");
        }

        // ถ้าไม่ซ้ำ สร้างสมาชิกใหม่
        Account account = new Account(password, email);
        Member member = new Member(fname, lname, phone, account);
        memberService.save(member);
        return ResponseEntity.status(HttpStatus.OK).body("สมัครสมาชิกสำเร็จ");
    }

    @GetMapping("/member/email/{email}")
    public ResponseEntity<?> getMemberByEmail(@PathVariable String email){
        Member member = memberService.getByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(member);
    }

    //Employee Controller

    //get all
    @GetMapping("/employee")
    //@PreAuthorize("hasRole('SYSTEMADMIN')")
    public List<Employee> getAllEmployee() {
        return employeeService.getAll();
    }
    
    //get by id
    @GetMapping("/employee/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
        Employee employee = employeeService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(employee);
    }

    //get by email
    @GetMapping("/employee/email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Employee employee = employeeService.getByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(employee);
    }
    

    
    //create
    @PostMapping("/employee/create")
    public ResponseEntity<?> CreateEmployee(@RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("empType", "password", "email", "fname", "lname", "phone");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String empType;
        String password;
        String email;
        String fname;
        String lname;
        String phone;

        if(reqMap.get("empType") instanceof String){
            empType = (String) reqMap.get("empType");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid employee Type field. Expected String.");
        }
        if(reqMap.get("password") instanceof String){
            password = (String) reqMap.get("password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
        }
        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
        }
        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
        }

        //Check if email already exists
        try {
            employeeService.getByEmail(email);
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        } catch (ResponseStatusException e) {

            // Not Found Employee from email
            //Create Account
            Account account = new Account(password, email);

            //Check Employee Type
            if("Cashier".equalsIgnoreCase(empType)){
                Cashier cashier = new Cashier(fname, lname, phone, account);
                cashierService.save(cashier);
                return ResponseEntity.status(HttpStatus.OK).body("Created Cashier Successful");
            }else if("InventorySupervisor".equalsIgnoreCase(empType)){
                InventorySupervisor inventorySupervisor = new InventorySupervisor(fname, lname, phone, account);
                invenService.save(inventorySupervisor);
                return ResponseEntity.status(HttpStatus.OK).body("Created Inventory Supervisor Successful");
            }else if("SystemAdmin".equalsIgnoreCase(empType)){
                SystemAdmin systemAdmin = new SystemAdmin(fname, lname, phone, account);
                systemAdminService.save(systemAdmin);
                return ResponseEntity.status(HttpStatus.OK).body("Created System Admin Successful");
            }else{
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Invaild Employee Type");
            }
        }
    }

    //Delete Employee
    @DeleteMapping("/employee/{id}/delete")
    public ResponseEntity<?> DeleteEmployee(@PathVariable int id){
        employeeService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Employee id : "+id+" Successful");
    }

    //Update
    @PostMapping("/employee/{id}/update")
    public ResponseEntity<?> UpdateEmployee(@PathVariable int id, @RequestBody Map<String, Object> reqMap) {

        List<String> requiredFields = Arrays.asList("password", "email", "fname", "lname", "phone", "status");
        for (String field : requiredFields){
            if (!reqMap.containsKey(field) || reqMap.get(field) == null || reqMap.get(field).toString().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invaild input data : Some Key or Value is missing"); 
            }
        }

        String password;
        String email;
        String fname;
        String lname;
        String phone;
        String status;

        if(reqMap.get("password") instanceof String){
            password = (String) reqMap.get("password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password field. Expected String.");
        }
        if(reqMap.get("email") instanceof String){
            email = (String) reqMap.get("email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email field. Expected String.");
        }
        if(reqMap.get("fname") instanceof String){
            fname = (String) reqMap.get("fname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid first name field. Expected String.");
        }
        if(reqMap.get("lname") instanceof String){
            lname = (String) reqMap.get("lname");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid last name field. Expected String.");
        }
        if(reqMap.get("phone") instanceof String){
            phone = (String) reqMap.get("phone");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid phone number field. Expected String.");
        }
        if(reqMap.get("status") instanceof String){
            status = (String) reqMap.get("status");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status field. Expected String.");
        }



        //Check if email already exists
        try {
            Employee employee = employeeService.getById(id);
            employee.setFname(fname);
            employee.setLname(lname);
            employee.setPhone(phone);
            employee.setAccount(new Account(password, email, status));
            employeeService.save(employee);
            return ResponseEntity.status(HttpStatus.OK).body("Updated Employee Successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error : Cannot Update Employee "+email);
        }
    }

    //Cashier Controller

    //get all
    @GetMapping("/cashier")
    public List<Cashier> getAllCashier() {
        return cashierService.getAll();
    }
    
    //get by id
    @GetMapping("/cashier/{id}")
    public ResponseEntity<Cashier> getCashier(@PathVariable("id") int id ) {
        Cashier Cashier = cashierService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(Cashier);
        //ResponseEntity.ok(Cashier);
    }

    //InventorySupervisor Controller

    //get all
    @GetMapping("/inventorysupervisor")
    public List<InventorySupervisor> getAllInventorySupervisor() {
        return invenService.getAll();
    }
    
    //get by id
    @GetMapping("/inventorysupervisor/{id}")
    public ResponseEntity<InventorySupervisor> getInventorySupervisor(@PathVariable("id") int id ) {
        InventorySupervisor inventorySupervisor = invenService.getByid(id);
        return ResponseEntity.status(HttpStatus.OK).body(inventorySupervisor);
        //ResponseEntity.ok(inventorySupervisor);
    }
    

    //System Admin Controller

    //get all
    @GetMapping("/systemadmin")
    @PreAuthorize("hasRole('SYSTEMADMIN')")
    public List<SystemAdmin> getAllSystemAdmin() {
        return systemAdminService.getAll();
    }
    
    //get by id
    @GetMapping("/systemadmin/{id}")
    @PreAuthorize("hasRole('SYSTEMADMIN')")
    public ResponseEntity<SystemAdmin> getSystemAdmin(@PathVariable("id") int id ) {
        SystemAdmin SystemAdmin = systemAdminService.getById(id);
        return ResponseEntity.ok(SystemAdmin);
    }

    //Create Table
    
    

}