import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import CHSidebar from "../../../sidebar/CHSidebar";
import { CHOrderItem } from "../../../content/EditPopup";

import { Client } from "@stomp/stompjs";
import axios from "axios";

const CHHomepage = () => {

    const email = localStorage.getItem('email');
    const fname = localStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const [DeletedOrderId, setOrderId] = useState("");
    const [DeletedOrderItem, setOrderItem] = useState("");

    const [orders, setOrders] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const stompClient = useRef(null);

    const connectWebSocket = () => {
        const client = new Client({
            brokerURL: 'ws://localhost:3001/ws',
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: async () => {
                console.log('Connected to STOMP');
                setConnected(true);

                // Subscribe to the topic
                client.subscribe('/topic/order', (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        console.log('Received message:', data);
                        
                        switch(data.type) {
                            case 'added':
                                console.log('New order added:', data.data);
                                setOrders(prevOrders => [...prevOrders, data.data]);
                                break;
                            case 'addedOrderItem':
                                setOrders(prevOrders => {
                                    return prevOrders.map(order => {
                                        if(order.order_id === data.order_id){
                                            const newTotalPrice = order.total_price + data.data.total_price;
                                            return {
                                                ...order,
                                                orderitems: [...(order.orderitems || []), data.data],
                                                total_price: newTotalPrice
                                            };
                                        }
                                        return order;
                                    })
                                })
                                
                                break;
                            case 'removed':
                                setOrders( prevOrders => 
                                    prevOrders.filter(order => order.order_id !== data.data.order_id)
                                );
                                break;
                            case 'cancelOrderItem':
                                setOrders( prevOrders => 
                                    prevOrders.filter(order => order.order_id !== data.data.order_id)
                                );
                                break;
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                client.subscribe('/topic/test', (message) => {
                    
                    console.log('Test message received:', message.body);
                });

            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                setConnected(false);
            },
            onDisconnect: () => {
                console.log('STOMP Disconnected');
                setConnected(false);
            }
        });

        stompClient.current = client;
        client.activate();
    };
    

    // ปรับปรุง useEffect
    useEffect(() => {
        connectWebSocket();
        Fetchdata();
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/api/order/received");

            setOrders(response.data);
            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const validOrders = orders.filter(order => order.order_id != null);


    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={0}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-hidden">
            <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden min-w-full h-full">
                { isLoading ? 
                        <div className="flex items-center justify-center w-full">isLoading</div>
                    : !connected ? 
                        <div className="flex items-center justify-center w-full">Connect to Server</div>
                    : validOrders.length === 0 ? 
                        <div className="flex items-center justify-center w-full">No Orders Found</div>
                    : validOrders.map((order) => (
                        <div key={`order-${order.order_id}`}
                        className="grid grid-rows-[22%_58%_20%] min-w-[400px] h-full p-4 bg-gray-200 rounded-lg shadow-sm border border-gray-300">
                            <div className="flex flex-col gap-2 ">
                                <label className="flex justify-center font-bold">Order id : {order.order_id}</label>
                                <label className="flex justify-center font-bold">Reserve id : {order.reserve_id}</label>
                                <label className="flex justify-center font-bold">Table : {order.table_name}</label>
                                <label className="flex justify-center font-bold"> {order.customer_role} </label>
                                { order.customer_role === "Member" &&
                                    <label className="flex justify-center font-bold text-gray-500">{order.customer_fname} {order.customer_lname}</label>
                                }
                            </div>
                            <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                                <div className="flex flex-row justify-between items-center bg-sky-400 h-2 p-5">
                                    <label className="basis-1/4 font-semibold">เมนู</label>
                                    <label className="basis-1/4 text-center font-semibold">จำนวน</label>
                                    <label className="basis-1/4 text-center font-semibold">ราคา</label>
                                </div>
                                {
                                    (order.orderitems).map((orderitem) => (
                                        <button key={`orderitem-${orderitem.orderitem_id}`}
                                        onClick={() => {
                                            setOrderId(order.order_id);
                                            setOrderItem(orderitem);
                                            setIsDeleted(true);
                                        }}
                                        className="flex flex-row justify-between gap-4 p-3 transition-[box-shadow_background-color_color]
                                            hover:bg-emerald-100 hover:shadow-lg active:bg-emerald-200">
                                            <label className="basis-1/4 text-center">{orderitem.name}
                                                {orderitem.comment && orderitem.comment.trim() !== "" && 
                                                    <label className="text-red-500">*</label>
                                                }
                                            </label>
                                            <label className="basis-1/4 text-center">{orderitem.qty} {orderitem.unit}</label>
                                            <label className="basis-1/4 text-center">{orderitem.total_price}</label>
                                        </button>
                                    ))
                                }
                            </div>
                            <div className="flex flex-col justify-between">
                                <label className="flex flex-row mt-4 text-red-500 font-semibold">ราคาทั้งหมด : {order.total_price} บาท</label>
                                <button className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                    onClick={() => {
                                        
                                    }}>
                                        ชำระเงิน
                                </button>
                                <label className="flex flex-row justify-between">
                                    <label className="font-semibold">Cashier : {order.cashier_name}</label>
                                    <label className="text-gray-500 text-end">{order.created_date}</label>
                                </label>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>


            { isDeleted && createPortal(
                    <CHOrderItem trigger={isDeleted} data={DeletedOrderItem} order_id={DeletedOrderId} setTrigger={setIsDeleted} fetchData={Fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
                    </CHOrderItem>, document.body
                )
            }
            { alert && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <p className="font-bold text-xl ">{alertMessage}</p> 
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                onClick={() => setAlert(false)}>
                            Close
                            </button>
                        </div>          
                    </div>
                </div>, document.body
            )}
        </div>
    );
}

export default CHHomepage;