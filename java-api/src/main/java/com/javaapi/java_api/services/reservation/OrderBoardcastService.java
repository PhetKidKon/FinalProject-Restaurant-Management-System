package com.javaapi.java_api.services.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.javaapi.java_api.entity.reservation.Order;
import com.javaapi.java_api.entity.reservation.OrderItem;
import com.javaapi.java_api.payload.response.ResOrder;
import com.javaapi.java_api.payload.response.ResOrderItem;

@Service
public class OrderBoardcastService {

    @Autowired
    private SimpMessagingTemplate message;

    public void boardcastOrderAdded(Order order){      
        try {
            ResOrder res = new ResOrder(order.getId(), order.getReservation().getCustomer().getId(), order.getReservation().getCustomer().getRole(), order.getReservation().getCustomer().getFname(), order.getReservation().getCustomer().getLname()
            , order.getReservation().getCustomer().getPhone(), order.getStatus(), order.getTotal_price(), order.getCreated_by().getId(), order.getCreated_by().getFname(), order.getCreated_by().getAccount().getEmail(), order.getReservation().getId()
            , order.getTable().getId(), order.getTable().getTable_name(), order.getOrderItems()
            , order.getYears(), order.getMonth(), order.getDay());
            OrderEvent event = new OrderEvent("added", res);
            System.out.println("Broadcasting order: " + event);
            message.convertAndSend("/topic/order", event);
            System.out.println("Broadcast completed");
        } catch (Exception e) {
            System.err.println("Error broadcasting order: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void boardcastOrderAddedOrderItem(int order_id, OrderItem orderItem){
        try {
            ResOrderItem res = new ResOrderItem(orderItem.getId(), orderItem.getMenuItem().getName(), orderItem.getMenuItem().getUnit(), 
                orderItem.getMenuItem().getDescription(), orderItem.getQty(), orderItem.getTotal_price(), orderItem.getMenuItem().getPrice(), 
                orderItem.getComment(), orderItem.getDay(), orderItem.getMonth(), orderItem.getYears());
            OrderItemEvent event = new OrderItemEvent("addedOrderItem", order_id, res);
            System.out.println("Broadcasting order item: " + event);
            message.convertAndSend("/topic/order", event);
            System.out.println("Broadcast completed");
        } catch (Exception e) {
            System.err.println("Error broadcasting order item: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void boardcastOrderCancelOrderItem(int order_id, OrderItem orderItem){
        try {
            ResOrderItem res = new ResOrderItem(orderItem.getId(), orderItem.getMenuItem().getName(), orderItem.getMenuItem().getUnit(), 
                orderItem.getMenuItem().getDescription(), orderItem.getQty(), orderItem.getTotal_price(), orderItem.getMenuItem().getPrice(), 
                orderItem.getComment(), orderItem.getDay(), orderItem.getMonth(), orderItem.getYears());
            OrderItemEvent event = new OrderItemEvent("cancelOrderItem", order_id, res);
            System.out.println("Broadcasting cancelled order item: " + event);
            message.convertAndSend("/topic/order", event);
            System.out.println("Broadcast completed");
        } catch (Exception e) {
            System.err.println("Error broadcasting cancelled order item: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void boardcastOrderRemove(Order order){
        try {
            ResOrder res = new ResOrder(order.getId(), order.getReservation().getCustomer().getId(), order.getReservation().getCustomer().getRole(), order.getReservation().getCustomer().getFname(), order.getReservation().getCustomer().getLname()
            , order.getReservation().getCustomer().getPhone(), order.getStatus(), order.getTotal_price(), order.getCreated_by().getId(), order.getCreated_by().getFname(), order.getCreated_by().getAccount().getEmail(), order.getReservation().getId()
            , order.getTable().getId(), order.getTable().getTable_name(), order.getOrderItems()
            , order.getYears(), order.getMonth(), order.getDay());
            OrderEvent event = new OrderEvent("removed", res);
            System.out.println("Broadcasting removed order: " + event);
            message.convertAndSend("/topic/order", event);
            System.out.println("Broadcast completed");
        } catch (Exception e) {
            System.err.println("Error broadcasting removed order: " + e.getMessage());
            e.printStackTrace();
        }
    }

    //Send Event Order Response
    public static class OrderEvent{
        public String type;
        public Object data;
        public OrderEvent(String type, Object data){
            this.type = type;
            this.data = data;
        }
    }
    //Send Event Order item Response
    public static class OrderItemEvent{
        public String type;
        public int order_id;
        public Object data;
        public OrderItemEvent(String type, int order_id, Object data){
            this.type = type;
            this.order_id = order_id;
            this.data = data;
        }
    }

    
}
