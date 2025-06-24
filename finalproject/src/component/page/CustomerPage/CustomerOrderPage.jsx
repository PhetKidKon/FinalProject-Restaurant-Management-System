import React, { use, useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";

import CustomerSidebar from "../../sidebar/CustomerSidebar";

const CustomerOrderSelectionPage = () => {

    const email = sessionStorage.getItem('customer_email');
    const fname = sessionStorage.getItem('customer_fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [customerData, setCustomerData] = useState("");

    const [orderId, setOrderId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {

            if (email && email !== "null") {
                const customerRes = await axios.get(`http://localhost:3001/api/accounts/member/email/${email}`);
                setCustomerData(customerRes.data);
            }
            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (orderId.trim() !== "") {
            navigate(`/order/${orderId}`);
        }
    };


    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[100px_1fr] md:grid-cols-[175px_1fr] lg:grid-cols-[250px_1fr]">
            <CustomerSidebar email={email && email !== "null" ? email : "null"} 
            name={fname && fname !== "null" ? fname : "null"} point={customerData.point} customerData={customerData} selectedPage={3}></CustomerSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-y-auto overflow-x-hidden flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                    <label className="text-lg font-semibold">กรอกหมายเลข Order</label>
                    <input
                        type="text"
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full text-center"
                        placeholder="Order Number"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 w-full"
                    >
                        ไปยัง Order
                    </button>
                </form>
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

export default CustomerOrderSelectionPage;