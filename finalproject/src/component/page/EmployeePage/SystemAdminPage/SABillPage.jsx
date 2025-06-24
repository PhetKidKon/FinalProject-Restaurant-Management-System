import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import SASidebar from "../../../sidebar/SASidebar";
import { BillTable } from "../../../content/DataTable";

const SABillPage = ({}) => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [showPopup, setShowPopup] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/bill");

            setData(response.data);
            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const searchInNestedObject = (obj, searchValue) => {
        if (typeof obj === "string" || typeof obj === "number") {
            return String(obj).toLowerCase().includes(searchValue.toLowerCase());
        }
        if (Array.isArray(obj)) {
            return obj.some((item) => searchInNestedObject(item, searchValue));
        }
        if (typeof obj === "object" && obj !== null) {
            return Object.values(obj).some((value) => searchInNestedObject(value, searchValue));
        }
        return false;
    };
    
    const [searchColumn, setSearchColumn] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    
    const filteredData = data.filter((item) => {
        if (searchColumn === "all") {
            return searchInNestedObject(item, searchValue);
        } else {
            return searchInNestedObject(item[searchColumn], searchValue);
        }
    });

    return (
        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <SASidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={8}></SASidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh]">
                    { !isLoading ? 
                            <div className="space-y-5">
                            <div className="flex flex-wrap px-4 space-x-5 items-center">
                                <select className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800"
                                value={searchColumn} onChange={(e) => {setSearchColumn(e.target.value); setSearchValue("");} }>
                                    <option value="all">All</option>
                                    <option value="product_type">Product Type</option>
                                    <option value="transaction_type">Transaction Type</option>
                                    <option value="expried_date">Expired Date</option>
                                    <option value="account_email">Email</option>
                                </select>
                                {   searchColumn != "all" ?
                                    <input className="flex-grow px-4 py-1 rounded-xl bg-gray-300"
                                    type="text" placeholder="Search..." value={searchValue} onChange={(e) => {setSearchValue(e.target.value);} } /> :
                                    <div className="flex-grow"></div>
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
                            <div className="flex-grow"> 
                                <BillTable data={filteredData}  fetchdata={Fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}/>
                            </div>
                        </div> : <div className="">isLoading</div>
                    }
            </div>
        </div>
    );
}

export default SABillPage;