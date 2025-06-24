import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";

import { CHMenuItem } from "../../content/MenuContent";
import OrderSidebar from "../../sidebar/OrderSideBar";

const CutomerOrderMenuPage = () => {

    const email = sessionStorage.getItem('customer_email');
    const fname = sessionStorage.getItem('customer_fname');

    const [orderitems, setOrderItems] = useState(
            JSON.parse(sessionStorage.getItem('orderitems') || '[]')
        );
    

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [data, setData] = useState([]);
    const [order, setOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                    axios.get("http://localhost:3001/api/menu/available"),
                    axios.get(`http://localhost:3001/api/order/${order_id}`),
            ]);

            setData(menuRes.data); 
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

    const isOrderLoaded = order;
    const isOrderReceived = order && order.status === "received";

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchValue, setSearchValue] = useState("");

    // ปรับ filter logic
    const filteredData = data.filter(item => {
        const category = (item.category_name || "").toLowerCase();
        const name = (item.name || "").toLowerCase();
        const search = searchValue.toLowerCase();
        
        // เช็ค category
        const matchCategory = selectedCategory === "all" ? true : category === selectedCategory;
        // เช็ค name
        const matchSearch = name.includes(search);
        
        return matchCategory && matchSearch;
    });
    
    const uniqueCategories = Array.from(
        new Set(
            data
                .map(item => (item.category_name || "").toLowerCase())
                .filter(cat => cat !== "")
        )
    );


    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[100px_1fr] md:grid-cols-[175px_1fr] lg:grid-cols-[250px_1fr]">
            <OrderSidebar order_id={order.order_id} role={order.customer_role} fname={order.customer_fname} selectedPage={2} orderitemsremain={orderitems.length}></OrderSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-y-auto overflow-x-hidden">
                { !isLoading && isOrderLoaded && isOrderReceived ? 
                    <div className="space-y-5">
                        <div className="flex flex-wrap px-4 space-x-5 items-center">
                            <select
                                className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800"
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search menu name..."
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    className="px-4 py-1 rounded-xl border-2 border-stone-800 focus:outline-none focus:border-emerald-500 w-64"
                                />
                                {searchValue && (
                                    <button
                                        onClick={() => setSearchValue("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
                            {
                                filteredData.length > 0 ? 
                                    filteredData.map((menu) => (
                                        <CHMenuItem data={menu} usedTo={"CustomerAddMenu"} order_Id={order_id} setOrderItems={setOrderItems}></CHMenuItem>
                                    ))
                                    : <div>...</div>
                            }
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

export default CutomerOrderMenuPage;