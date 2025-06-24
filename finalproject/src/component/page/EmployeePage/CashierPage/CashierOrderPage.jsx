import React, { useState } from "react";
import 'tailwindcss';
import { Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import CHSidebar from "../../../sidebar/CHSidebar";
import { CHOrderItem } from "../../../content/EditPopup";

import Select from 'react-select';

import { Client } from "@stomp/stompjs";
import axios from "axios";

const CHOrderPage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const [cancelPopup, setCancelPopup] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [AddedPopUp, setAddedPopUp] = useState(false);


    const [OrderId, setOrderId] = useState("");
    const [DeletedOrderItem, setOrderItem] = useState("");
    const [selectedTable, setSelectedTable] = useState(null);
    const [people_count, setPeopleCount] = useState(0);
    const [addReservation, setAddReservation] = useState(false);
    const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");

    const [errorTable, setErrorTable] = useState("");
    const [errorPeopleCount, setErrorPeopleCount] = useState("");
    const [errorEmail, setErrorEmail] = useState("");


    const [orders, setOrders] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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

            const tableResponse = await axios.get("http://localhost:3001/api/table");
            setTableData(tableResponse.data);

            const memberResponse = await axios.get("http://localhost:3001/api/accounts/member");
            setMemberData(memberResponse.data);

            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const AddOrderHandle = async () => {

        const tableObj = tableData.find(t => t.id === selectedTable);

        setErrorTable("");
        setErrorPeopleCount("");
        setErrorEmail("");
        let hasError = false;

        if (!selectedTable) {
            setErrorTable("กรุณาเลือกโต๊ะ");
            hasError = true;
        }else if( tableObj.capacity < people_count){ 
            setErrorTable(true);
            setErrorTable("โต๊ะนี้ไม่สามารถรองรับจำนวนคนได้");
            hasError = true;
        }

        if (people_count <= 0) {
            setErrorPeopleCount("กรุณากรอกจำนวนคนที่ถูกต้อง");
            hasError = true;
        }

        if(addReservation && !selectedCustomerEmail){
            setErrorEmail("กรุณาเลือกลูกค้าก่อนจอง");
            hasError = true;
        }

        let reqBody = {
            table_id: selectedTable,
            cashier_email: email,
            ishave_reservation: false,
            people_count: people_count,
        };
        if (addReservation && selectedCustomerEmail) {
            reqBody.member_email = selectedCustomerEmail;
        }

        console.log("Selected Table:", selectedTable);

        if(hasError){
            return;
        }
    
            try {
            const res = await axios.post(`http://localhost:3001/api/order/create`, reqBody, {
                headers: { "Content-Type": "application/json" }
            });
    
            let responseData;
    
            if (typeof res.data === "string") {
                try {
                    responseData = JSON.parse(res.data);
                } catch (parseError) {
                    console.error("Error parsing JSON response:", parseError);
                    responseData = { message: res.data }; 
                }
            } else {
                responseData = res.data; 
            }
    
            setAlertMessage(responseData.message ?? "Add New Order Successful");
            setAddReservation(false);
            setAlert(true);
            Fetchdata();
            setAddedPopUp(false);
    
            } catch (error) {
            console.error("Error Update Menu Infomation:", error);
    
            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
    
                if (typeof errorData === "string") {
                    try {
                        const parsedData = JSON.parse(errorData);
                        setAlertMessage(parsedData.message || `Error ${statusCode}`);
                    } catch (parseError) {
                        setAlertMessage(errorData || `Error ${statusCode}`);
                    }
                } else {
                    setAlertMessage(errorData.message || `Error ${statusCode}`);
                }
            } else {
                setAlertMessage("An error occurred");
            }
            setAlert(true);
            setAddReservation(false);
            setTrigger(false);
            setAddedPopUp(false);
        }
    
    }

    const cancelOrderHandle = async () => {
    
            try {
            const res = await axios.post(`http://localhost:3001/api/order/${OrderId}/cancelorder`, { 
                }, {
                    headers: {
                        "Content-Type": "application/json",
                }
            });
    
            let responseData;
    
            if (typeof res.data === "string") {
                try {
                    responseData = JSON.parse(res.data);
                } catch (parseError) {
                    console.error("Error parsing JSON response:", parseError);
                    responseData = { message: res.data }; 
                }
            } else {
                responseData = res.data; 
            }
    
            setAlertMessage(responseData.message ?? "Update Menu Infomation Successful");
            console.log("Update Menu Infomation Successful:", responseData);
    
            setAlert(true);
            Fetchdata();
            setOrderId(0);
    
            } catch (error) {
            console.error("Error Update Menu Infomation:", error);
    
            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
    
                if (typeof errorData === "string") {
                    try {
                        const parsedData = JSON.parse(errorData);
                        setAlertMessage(parsedData.message || `Error ${statusCode}`);
                    } catch (parseError) {
                        setAlertMessage(errorData || `Error ${statusCode}`);
                    }
                } else {
                    setAlertMessage(errorData.message || `Error ${statusCode}`);
                }
            } else {
                setAlertMessage("An error occurred");
            }
            setAlert(true);
            setTrigger(false);
            setOrderId(0);
        }
    
    }

    const confirmHandle = async () => {
    
            try {
            const res = await axios.post(`http://localhost:3001/api/bill/create`, 
                OrderId
                , {
                    headers: {
                        "Content-Type": "application/json",
                }
            });
    
            let responseData;
    
            if (typeof res.data === "string") {
                try {
                    responseData = JSON.parse(res.data);
                } catch (parseError) {
                    console.error("Error parsing JSON response:", parseError);
                    responseData = { message: res.data }; 
                }
            } else {
                responseData = res.data; 
            }
    
            setAlertMessage("สร้างบิลสำเร็จ");
    
            setAlert(true);
            Fetchdata();
            setOrderId(0);
            setConfirmPopup(false);
    
            } catch (error) {
            console.error("Error Update Menu Infomation:", error);
    
            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
    
                if (typeof errorData === "string") {
                    try {
                        const parsedData = JSON.parse(errorData);
                        setAlertMessage(parsedData.message || `Error ${statusCode}`);
                    } catch (parseError) {
                        setAlertMessage(errorData || `Error ${statusCode}`);
                    }
                } else {
                    setAlertMessage(errorData.message || `Error ${statusCode}`);
                }
            } else {
                setAlertMessage("An error occurred");
            }
            setAlert(true);
            setTrigger(false);
            setOrderId(0);
        }
    
    }
    

    const validOrders = orders.filter(order => order.order_id != null);
    const availableTables = tableData.filter(table => table.status === "available");

    const tableOptions = [
    { value: null, label: "-- เลือกโต๊ะ --" },
    ...availableTables.map(table => ({
        value: table.id,
        label: `${table.table_name} (ความจุ ${table.capacity})`
    }))
    ];

    const memberOptions = memberData.map(member => ({
    value: member.account?.email,
    label: `ชื่อ : ${member.fname} ${member.lname} อีเมล : ${member.account?.email}`
}));

    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={4}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-hidden">
            <div className="relative flex flex-row gap-4 overflow-x-auto overflow-y-hidden min-w-full h-full">
                { isLoading ? 
                        <div className="flex items-center justify-center w-full">
                            <span className="text-xl font-semibold text-center">isLoading</span>
                        </div>
                    : !connected ? 
                        <div className="flex items-center justify-center w-full">
                            <span className="text-xl font-semibold text-center">ไม่สามารถเชื่อมต่อเซิฟเวอร์ได้</span>
                        </div>
                    : validOrders.length === 0 ?
                        <div className="flex items-center justify-center w-full">
                            <span className="text-xl font-semibold text-center">ไม่พบออเดอร์สินค้า</span>
                        </div>
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
                                {
                                    order.customer_phone && order.customer_phone !== "null" && order.customer_phone !== "***" &&
                                    <label className="flex justify-center font-bold text-sm">เบอร์โทรศัพท์ : {order.customer_phone}</label>
                                }
                            </div>
                            <div className="relative flex flex-col bg-gray-50 rounded-lg shadow-sm border border-black-200 overflow-x-auto">
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
                                <button className="flex flex-row items-center bg-emerald-500 h-2 p-5 mt-auto transition-[box-shadow_background-color_color]
                                            hover:bg-emerald-400 hover:shadow-lg active:bg-emerald-400 hover:cursor-pointer"
                                            onClick={() => {
                                                navigate(`/cashier/order/${order.order_id}`)
                                            }}>
                                                สั่งอาหารเพิ่ม
                                </button>
                            </div>
                            <div className="flex flex-col justify-between">
                                <label className="flex flex-row mt-4 text-red-500 font-semibold">ราคาทั้งหมด : {order.total_price} บาท</label>
                                <div className="flex flex-row justify-around gap-x-5">
                                    <button className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                        onClick={() => {
                                            setOrderId(order.order_id);
                                            setConfirmPopup(true);
                                        }}>
                                            ชำระเงิน
                                    </button>
                                    <button className="px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white"
                                        onClick={() => {
                                            setOrderId(order.order_id);
                                            setCancelPopup(true);
                                        }}>
                                            ยกเลิกออเดอร์
                                    </button>
                                </div>
                                <label className="flex flex-row justify-between">
                                    <label className="font-semibold">Cashier : {order.cashier_name}</label>
                                    <label className="text-gray-500 text-end">{order.created_date}</label>
                                </label>
                            </div>
                        </div>
                    ))
                }

                <button className="fixed top-6 right-6 p-3 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                        onClick={() => {
                                            setAddedPopUp(true);
                                            setSelectedTable(null);
                                            setPeopleCount(0);
                                            setErrorTable("");
                                            setErrorPeopleCount("");
                                        }}>
                    <Plus></Plus>
                </button>

            </div>
        </div>
        
        { AddedPopUp && createPortal( 
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                    <div className="space-y-15 flex flex-col items-center justify-center py-5">
                        <label className="font-bold text-xl">สร้าง Order ใหม่</label>
        
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-semibold">เลือกโต๊ะ 
                                { errorTable && 
                                <label className="ml-5 text-sm font-medium text-red-900">* {errorTable}</label>}
                            </label>
                            <Select
                            options={tableOptions}
                            value={tableOptions.find(opt => opt.value === selectedTable) || null}
                            onChange={option => setSelectedTable(option ? option.value : null)}
                            placeholder="-- เลือกโต๊ะ --"
                            menuPlacement="auto"
                            menuShouldScrollIntoView={false}
                            maxMenuHeight={220}
                            styles={{
                                menu: provided => ({ ...provided, maxHeight: 220 }),
                            }}
                            />
                            <label className="font-semibold">จำนวนคน 
                                { errorPeopleCount && 
                                <label className="ml-5 text-sm font-medium text-red-900">* {errorPeopleCount}</label>}
                            </label>
                            <input type="text" value={people_count} onChange={(e) => setPeopleCount(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                            {/* เพิ่มตัวเลือกสำหรับ Reservation */}
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={addReservation}
                                    onChange={e => {
                                        setAddReservation(e.target.checked);
                                        if (!e.target.checked) setSelectedCustomerEmail("");
                                        console.log("Member", memberData);
                                    }}
                                />
                                <label className="font-semibold">เพิ่ม Order สำหรับลูกค้า (Member)</label>
                            </div>
                            {addReservation && (
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">เลือก Customer (email)
                                            { errorEmail && 
                                        <label className="ml-5 text-sm font-medium text-red-900">* {errorEmail}</label>}
                                    </label>
                                    <Select
                                        options={memberOptions}
                                        value={memberOptions.find(opt => opt.value === selectedCustomerEmail) || null}
                                        onChange={option => setSelectedCustomerEmail(option ? option.value : "")}
                                        placeholder="-- เลือกลูกค้า --"
                                        menuPlacement="auto"
                                        menuShouldScrollIntoView={false}
                                        maxMenuHeight={220}
                                        styles={{
                                            menu: provided => ({ ...provided, maxHeight: 220 }),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                                    
                        <div className="flex flex-row justify-between gap-10">
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                onClick={() => {AddOrderHandle();}}>
                            Confirm
                            </button>
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                onClick={() => {setAddedPopUp(false); setSelectedTable(null); setAddReservation(false); setSelectedCustomerEmail(null)}}>
                            Close
                            </button>
                        </div>
                        
                    </div>          
                </div>
            </div>, document.body
        )}


        { isDeleted && createPortal(
                <CHOrderItem trigger={isDeleted} data={DeletedOrderItem} order_id={OrderId} setTrigger={setIsDeleted} fetchData={Fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
                </CHOrderItem>, document.body
            )
        }

        { confirmPopup && createPortal( 
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <label className="font-bold text-xl">Order ID : {OrderId}</label>
                            <p className="font-bold text-xl">คุณต้องการยืนยันการชำระใช่หรือไม่</p>
                            <div className="flex flex-row justify-between gap-10">
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                    onClick={() => {setConfirmPopup(false); confirmHandle();}}>
                                Confirm
                                </button>
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                    onClick={() => {setConfirmPopup(false); setOrderId(0);}}>
                                Close
                                </button>
                            </div>
                                    
                        </div>          
                    </div>
                </div>, document.body
        )}

        { cancelPopup && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <label className="font-bold text-xl">Order ID : {OrderId}</label>
                            <p className="font-bold text-xl">คุณต้องการที่จะยกเลิกการออเดอร์นี้ใช่หรือไม่</p>
                            <div className="flex flex-row justify-between gap-10">
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                    onClick={() => {setCancelPopup(false); cancelOrderHandle();}}>
                                Confirm
                                </button>
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                    onClick={() => {setCancelPopup(false); setOrderId(0);}}>
                                Close
                                </button>
                            </div>
                                    
                        </div>          
                    </div>
                </div>, document.body
        )}

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

export default CHOrderPage;