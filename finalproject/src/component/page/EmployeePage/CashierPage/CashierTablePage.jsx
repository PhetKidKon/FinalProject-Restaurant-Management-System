import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";


import { TableCards } from "../../../content/TableContent";
import CHSidebar from "../../../sidebar/CHSidebar";

const CHTablePage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [data, setData] = useState([]);
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/api/table");
            setData(response.data);

            const orderResponse = await axios.get("http://localhost:3001/api/order");
            setOrder(orderResponse.data);

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
    

    const availableTables = data.filter(table =>
    table.status === "available" || table.status === "occupied");

    


    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[100px_1fr] md:grid-cols-[175px_1fr] lg:grid-cols-[250px_1fr]">
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={2}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-y-auto overflow-x-hidden">
                { !isLoading ? 
                    <div className="space-y-5">
                        <div className="flex flex-wrap px-4 space-x-5 items-center">
                            <div className="relative">
                            </div>

                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
                            
                            {
                                availableTables.length > 0 ? 
                                    availableTables.map((table) => {
                                    const usedOrder = order.find(o => o.table_id === table.id && o.status === "received");
                                    return (
                                        <TableCards data={table} order={usedOrder} usedTo={"CHTable"}></TableCards>
                                    )})
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

export default CHTablePage;