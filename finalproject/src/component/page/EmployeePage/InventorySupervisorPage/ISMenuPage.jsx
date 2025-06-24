import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import axios from "axios";

import ISSidebar from "../../../sidebar/ISSidebar";
import { MenuTable } from "../../../content/DataTable";


const ISMenuPage = ({}) => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/menu");

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
            
    const filteredData = data.filter((item) => String(item[searchColumn]).toLowerCase().includes(searchValue.toLowerCase()));

    return (
        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <ISSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={1}></ISSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh]">
                { !isLoading ? 
                            <div className="space-y-5">
                            <div className="flex flex-wrap px-4 space-x-5 items-center">
                                <select className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800"
                                value={searchColumn} onChange={(e) => {setSearchColumn(e.target.value); setSearchValue("");} }>
                                    <option value="all">All</option>
                                    <option value="name">Name</option>
                                    <option value="category_name">Category Name</option>
                                    <option value="price">Price</option>
                                    <option value="unit">Unit</option>
                                    <option value="account_email">Account Email</option>
                                    <option value="create_date">Created At</option>
                                </select>
                                {   searchColumn != "all" ?
                                    <input className="flex-grow px-4 py-1 rounded-xl bg-gray-300"
                                    type="text" placeholder="Search..." value={searchValue} onChange={(e) => {setSearchValue(e.target.value);} } /> :
                                    <div className="flex-grow"></div>
                                }
                                <Link to={'/inventorysupervisor/menu/addMenu'}>
                                    <button className="px-4 py-1 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300">
                                        Add Menu
                                    </button>
                                </Link>

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
                                <MenuTable data={filteredData}  fetchdata={Fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage} role={"InventorySupervisor"} />
                            </div>
                        </div> : <div className="">isLoading</div>
                    }
            </div>
        </div>
    );
}

export default ISMenuPage;