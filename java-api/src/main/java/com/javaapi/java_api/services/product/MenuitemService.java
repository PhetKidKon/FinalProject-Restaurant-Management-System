package com.javaapi.java_api.services.product;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.javaapi.java_api.entity.product.MenuItem;
import com.javaapi.java_api.entity.product.ReadyMadeMenu;
import com.javaapi.java_api.repository.product.MenuItemRepository;

@Service
public class MenuitemService {
    
    MenuItemRepository menuRepository;

    @Autowired
    public MenuitemService(MenuItemRepository menuItemRepository){
        this.menuRepository = menuItemRepository;
    }

    public MenuitemService(){}

    //Behavior

    //Get All Table System Admin
    public List<MenuItem> getAll(){ return menuRepository.findAll(Sort.by(Sort.Direction.ASC, "id")); }

    //Get From Id
    public MenuItem getById(int id){ return menuRepository.findById(id) 
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu id :" + id + " Not Found"));}

    //Get From Status
    public List<MenuItem> getByStatus(String status){ return menuRepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));}

    //Save to MenuItem Table
    public MenuItem save(MenuItem menuItem){ return menuRepository.save(menuItem); }

    //Update to MenuItem Table
    public MenuItem updateInfo(int id, String name, double price, String unit, String category_name, String status, String description){//(name, price, unit, "Active", description, imgpath, inven, stock)
        MenuItem menuItem = this.getById(id);

        menuItem.setName(name);
        menuItem.setPrice(price);
        menuItem.setUnit(unit);
        menuItem.setCategory_name(category_name);
        menuItem.setStatus(status);
        menuItem.setDescription(description);
        
        return menuRepository.save(menuItem);
    }

    //Update img to MenuItem
    public MenuItem updateImg(int id, String imgpath){
        MenuItem menuItem = this.getById(id);

        menuItem.setImgFilePath(imgpath);

        return menuRepository.save(menuItem);
    }

    //Delete From Id
    public void deleteById(int id){
        this.getById(id);
        menuRepository.deleteById(id);
    }
    
    public Map<String, Object> getdetail(int id){
        MenuItem menu = menuRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Cannot Find Menu id : "+id));
        return Map.of(
            "name", menu.getName(),
            "price", menu.getPrice()
        );
    }
    
}