import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";

import OrderSidebar from "../../sidebar/OrderSideBar";
import { CustomerOrderItem } from "../../content/EditPopup";

const CutomerOrderRemainPage = () => {

    const email = sessionStorage.getItem('customer_email');
    const fname = sessionStorage.getItem('customer_fname');
    
    const [orderitems, setOrderItems] = useState(
        JSON.parse(sessionStorage.getItem('orderitems') || '[]')
    );

    const [selectData, setSelectedData] = useState("");
    const [selectedIdx, setSelectedIdx] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [order, setOrder] = useState("");
    const [menu, setMenu] = useState("");
    const totalPrice = orderitems.reduce((sum, item) => sum + (item.price || 0), 0);
    const [isStockEnoughMessage, setIsStockEnoughMessage] = useState("");


    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [checkOrderitems, setCheckOrderitems] = useState(false);
    const [isStockEnough, setIsStockEnough] = useState(false);
    const [confirmOrderitems, setConfirmOrderitems] = useState(false);

    const navigate = useNavigate();

    const { order_id } = useParams();
    

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const [menuRes, orderRes] = await Promise.all([
                    axios.get("http://localhost:3001/api/menu"),
                    axios.get(`http://localhost:3001/api/order/${order_id}`),
            ]);

            setMenu(menuRes.data);
            setOrder(orderRes.data);

            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const HandlecheckOrderitems = async () => {
        setIsStockEnoughMessage("");
        try {
            const res = await axios.post("http://localhost:3001/api/order/check-stock",
                orderitems,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log(res.data);

            setConfirmOrderitems(false);
            HandleConfirmOrders();
        } catch (error) {
            console.error("check handle : " ,error);
            if (error.response && error.response.status === 409) {
                const insufficient = error.response.data;

                const ingredientList = insufficient.filter(item => item.type === "ingredient");
                const readymadeList = insufficient.filter(item => item.type === "readymade");

                let lines = [];
                if (ingredientList.length > 0) {
                    lines.push("วัตถุดิบต่อไปนี้ไม่เพียงพอ:");
                    ingredientList.forEach(item => {
                        lines.push(
                            `- ${item.ingredient_name} (ต้องการ ${item.required_qty}, คงเหลือ ${item.available_qty})` +
                            (item.used_in_menus && item.used_in_menus.length > 0
                                ? `\n  ใช้ในเมนู: ${Array.from(item.used_in_menus).join(", ")}`
                                : "")
                        );
                    });
                }
                if (readymadeList.length > 0) {
                    lines.push("เมนูสำเร็จรูปต่อไปนี้ไม่เพียงพอ:");
                    readymadeList.forEach(item => {
                        lines.push(`- ${item.menu_name} (ต้องการ ${item.required_qty}, คงเหลือ ${item.available_qty})`);
                    });
                }
                setIsStockEnoughMessage(lines.join('\n'));
            } else if (error.response) {
                setIsStockEnoughMessage(error.response.data.message || "เกิดข้อผิดพลาด");
            } else {
                setIsStockEnoughMessage("An error occurred");
            }
            setConfirmOrderitems(false);
            setIsStockEnough(true);
        }
    };

    const HandleConfirmOrders = async () => { //order_id
        try { 
            const res = await axios.post(`http://localhost:3001/api/order/${order_id}/createorderitems`,
                orderitems,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log(res.data);

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
    
            setAlertMessage("ยืนยันออเดอร์สำเร็จ");
            setAlert(true);

            sessionStorage.removeItem('orderitems');
            setOrderItems([]);

            Fetchdata();
        } catch (error) {
            console.log("confirm handle : ", error);
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
        }
    };




    const isOrderLoaded = order;
    const isOrderReceived = order && order.status === "received";



    return (  
        <div className="bg-blue-100 grid gap-3 grid-cols-[100px_1fr] md:grid-cols-[175px_1fr] lg:grid-cols-[250px_1fr]">
            <OrderSidebar order_id={order.order_id} role={order.customer_role} fname={order.customer_fname} selectedPage={3} orderitemsremain={orderitems.length}></OrderSidebar>
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
                                    {orderitems.length > 0 ? orderitems.map((orderitem, idx) => (
                                        <button key={`orderitem-${idx}`}
                                        onClick={() => {
                                            setSelectedData(orderitem);
                                            setSelectedIdx(idx);
                                            setIsDeleted(true);
                                        }}
                                            className="flex flex-row justify-between gap-4 p-3 transition-[box-shadow_background-color_color]">
                                            <label className="basis-1/4 text-center">{orderitem.menu_name} 
                                                {orderitem.comment && orderitem.comment.trim() !== "" && 
                                                    <label className="text-red-500"> *</label>
                                                }
                                            </label>
                                            <label className="basis-1/4 text-center">{orderitem.qty}</label>
                                            <label className="basis-1/4 text-center">{orderitem.price}</label>
                                        </button>
                                    )) : (
                                        <div className="flex justify-center p-3 text-gray-400">ไม่มีรายการ</div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-between">
                                    <label className="flex flex-row mt-4 text-red-500 font-semibold">ราคาทั้งหมด : {totalPrice} บาท</label>

                                    <div className="flex flex-row justify-around gap-x-5">
                                        <button className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                            hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                            disabled={orderitems.length === 0}
                                            onClick={() => {
                                                setConfirmOrderitems(true)
                                            }}>
                                                ยืนยันการสั่งซื้อ
                                        </button>
                                    </div>

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
                        : <div className="flex flex-col items-center justify-center h-full">isLoading</div>
                    }
                </div>
                
        </div>

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

            {isDeleted && createPortal(
                <CustomerOrderItem
                    trigger={isDeleted}
                    setTrigger={setIsDeleted}
                    data={selectData}
                    idx={selectedIdx}
                    order_id={order_id}
                    menu={menu.find(m => m.name === selectData.menu_name) || {}} // หาเมนูที่ตรงกับ orderitem
                    orderitems={orderitems}
                    setOrderItems={setOrderItems}
                    setAlert={setAlert}
                    setAlertMessage={setAlertMessage}
                    fetchData={Fetchdata}
                />,
                document.body
            )}


            { isStockEnough && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <pre className="font-bold text-xl whitespace-pre-line">{isStockEnoughMessage}</pre>
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                onClick={() => setIsStockEnough(false)}>
                            Close
                            </button>
                        </div>          
                    </div>
                </div>, document.body
            )}

            { confirmOrderitems && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <p className="font-bold text-xl ">คุณต้องการยืนยันสินค้าเหล่านี้ใช่หรือไม่</p>
                            <div className="flex flex-row-reverse gap-4">
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                    onClick={() => setConfirmOrderitems(false)}>
                                Cancel
                                </button>
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                    onClick={() => {
                                        HandlecheckOrderitems();
                                    }}>
                                Confirm
                                </button>
                            </div>
                        </div>          
                    </div>
                </div>, document.body
            )}


        </div>
    );
}

export default CutomerOrderRemainPage;