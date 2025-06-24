package com.javaapi.java_api.payload.response;

public class ResEmployeeLogin {

    private String token;
    private String role;
    private String email;
    private String fname;

    //Constructor
    public ResEmployeeLogin(String token, String role, String email, String fname){
        this.token = token;
        this.role = role;
        this.email = email;
        this.fname = fname;
    }

    public ResEmployeeLogin() {}

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public String getFname(){
        return fname;
    }

    //Getter

    

}
