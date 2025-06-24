import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import CHSidebar from "../../../sidebar/CHSidebar";
import axios from "axios";

import { CHMenuItem } from "../../../content/MenuContent";

const CHOrderItemPage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const [DeletedOrderId, setOrderId] = useState("");
    const [DeletedOrderItem, setOrderItem] = useState("");

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { order_id } = useParams();

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/api/menu/available");

            setData(response.data);
            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

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
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={4}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-y-auto overflow-x-hidden">
                { !isLoading ? 
                    <div className="space-y-5">

                        <div className="flex flex-col">
                            <div className="flex flex-row space-x-5 mb-4 px-4 justify-between">
                                <Link to={'/cashier/order'}>
                                    <button className="px-4 py-1 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300">
                                        Previous
                                    </button>
                                </Link>
                                <label className="text-2xl font-bold text-center">Order ID: {order_id}</label>
                                <label htmlFor=""></label>
                            </div>
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
                        </div>
                        
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
                            {
                                filteredData.length > 0 ? 
                                    filteredData.map((menu) => (
                                        <CHMenuItem data={menu} usedTo={"CHAddMenu"} order_Id={order_id}></CHMenuItem>
                                    ))
                                    : <div>...</div>
                            }
                        </div>

                    </div> : <div className="">isLoading</div>
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

export default CHOrderItemPage;