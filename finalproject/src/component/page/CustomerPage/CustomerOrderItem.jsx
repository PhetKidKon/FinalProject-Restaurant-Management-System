import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";

import OrderSidebar from "../../sidebar/OrderSideBar";
import { ShowCustomerOrderItem } from "../../content/EditPopup";

const CutomerOrderItemPage = () => {

    const email = sessionStorage.getItem('customer_email');
    const fname = sessionStorage.getItem('customer_fname');

    const [orderitems, setOrderItems] = useState(
            JSON.parse(sessionStorage.getItem('orderitems') || '[]')
        );
    

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [order, setOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    
    const [selectOrderitem, setSelectOrderitem] = useState("");
    const [selectOrderId, setSelectedOrderId] = useState("");

    const navigate = useNavigate();

    const { order_id } = useParams();
    

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/order/${order_id}`);

            setOrder(response.data);

            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const isOrderLoaded = order;
    const isOrderReceived = order && order.status === "received";

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchValue, setSearchValue] = useState("");


    return (  
        <div className="bg-blue-100 grid gap-3 grid-cols-[100px_1fr] md:grid-cols-[175px_1fr] lg:grid-cols-[250px_1fr]">
            <OrderSidebar order_id={order.order_id} role={order.customer_role} fname={order.customer_fname} selectedPage={1} orderitemsremain={orderitems.length}></OrderSidebar>
            <div className="bg-gray-100 rounded-lg pb-4 p-4 shadow h-[100vh] overflow-y-auto overflow-x-hidden">
                <div className="relative flex flex-row gap-4 overflow-x-auto overflow-y-hidden min-w-full h-full justify-center">
                    { !isLoading && isOrderLoaded && isOrderReceived ? 
                        <div className="space-y-5">
                            <div className="grid grid-rows-[22%_58%_20%] min-w-[400px] max-w-xl mx-auto h-full p-4 bg-gray-200 rounded-lg shadow-sm border border-gray-300">
                                <div className="flex flex-col gap-2">
                                    <label className="flex justify-center font-bold">Order id : {order.order_id}</label>
                                    <label className="flex justify-center font-bold">Reserve id : {order.reserve_id}</label>
                                    <label className="flex justify-center font-bold">Table : {order.table_name}</label>
                                    <label className="flex justify-center font-bold">{order.customer_role}</label>
                                    {order.customer_role === "Member" &&
                                        <label className="flex justify-center font-bold text-gray-500">{order.customer_fname} {order.customer_lname}</label>
                                    }
                                    {order.customer_phone && order.customer_phone !== "null" && order.customer_phone !== "***" &&
                                        <label className="flex justify-center font-bold text-sm">เบอร์โทรศัพท์ : {order.customer_phone}</label>
                                    }
                                </div>
                                <div className="relative flex flex-col bg-gray-50 rounded-lg shadow-sm border border-black-200 overflow-x-auto">
                                    <div className="flex flex-row justify-between items-center bg-sky-400 h-2 p-5">
                                        <label className="basis-1/4 font-semibold">เมนู</label>
                                        <label className="basis-1/4 text-center font-semibold">จำนวน</label>
                                        <label className="basis-1/4 text-center font-semibold">ราคา</label>
                                    </div>
                                    {order.orderitems.length > 0 ? order.orderitems.map(orderitem => (
                                        <button key={`orderitem-${orderitem.orderitem_id}`}
                                            className="flex flex-row justify-between gap-4 p-3 transition-[box-shadow_background-color_color]"
                                            onClick={() => {
                                                setSelectOrderitem(orderitem);
                                                setSelectedOrderId(order.order_id);
                                                setShowPopup(true);
                                            }}
                                            >
                                            <label className="basis-1/4 text-center">{orderitem.name}
                                                {orderitem.comment && orderitem.comment.trim() !== "" &&
                                                    <span className="text-red-500">*</span>
                                                }
                                            </label>
                                            <label className="basis-1/4 text-center">{orderitem.qty} {orderitem.unit}</label>
                                            <label className="basis-1/4 text-center">{orderitem.total_price}</label>
                                        </button>
                                    )) :    (
                                        <div className="flex justify-center p-3 text-gray-400">ไม่มีรายการ</div>
                                    )
                                    }
                                </div>
                                <div className="flex flex-col justify-between">
                                    <label className="flex flex-row mt-4 text-red-500 font-semibold">ราคาทั้งหมด : {order.total_price} บาท</label>
                                    <label className="flex flex-row justify-between">
                                        <span className="font-semibold">Cashier : {order.cashier_name}</span>
                                        <span className="text-gray-500 text-end">{order.created_date}</span>
                                    </label>
                                </div>
                            </div>

                        </div> : !isOrderLoaded ?
                        <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-xl font-semibold">ไม่พบออเดอร์นี้</p>
                        </div>
                        : !isOrderReceived ?
                        <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-xl font-semibold">ออเดอร์นี้ไม่สามารถใช้งานได้</p>
                        </div>
                        : <div className="">isLoading</div>
                    }
                </div>
                
        </div>ShowCustomerOrderItem

        { showPopup && createPortal(
                <ShowCustomerOrderItem trigger={showPopup} data={selectOrderitem} order_id={selectOrderId} setTrigger={setShowPopup}>
                </ShowCustomerOrderItem>, document.body
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

export default CutomerOrderItemPage;