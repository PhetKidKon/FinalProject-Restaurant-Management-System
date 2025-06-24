import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import Select from 'react-select';

import CHSidebar from "../../../sidebar/CHSidebar";
import axios from "axios";

const CHReservation = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [cancelPopup, setCancelPopup] = useState(false);
    const [ConfirmPopup, setConfirmPopup] = useState(false);

    const [reserve_id, setReserveId] = useState(0);
    const [reserveItem, setReserveItem] = useState("");
    const [selectedTable, setSelectedTable] = useState(null);

    const [errorTable, setErrorTable] = useState(false);

    const [datas, setDatas] = useState([]);
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    

    // ปรับปรุง useEffect
    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/api/reservation/status/pending");
            setDatas(response.data);

            const tableResponse = await axios.get("http://localhost:3001/api/table");
            setTables(tableResponse.data);

            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading orders. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatusHandle = async () => {
    
            try {
            const res = await axios.post(`http://localhost:3001/api/reservation/${reserve_id}/updatestatus`, { 
                    status : "cancelled"
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
            setConfirmPopup(false);
        }
    
    }

    const ConfirmHandle = async () => {


        const tableObj = tables.find(t => t.id === selectedTable);

        setErrorTable(false);

        let hasError = false;

        if (!selectedTable) {
            setErrorTable(true);
            setErrorTable("Please select a table");
            hasError = true;
        }else if( tableObj.capacity < reserveItem.people_count){ 
            setErrorTable(true);
            setErrorTable("Selected table capacity is not enough for this reserve");
            hasError = true;
        }

        if (hasError){
            return;
        }
    
            try {
            const res = await axios.post(`http://localhost:3001/api/order/create`, { 
                    table_id : selectedTable,
                    cashier_email : email,
                    ishave_reservation : true,
                    reservation_id : reserveItem.id

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
            setReserveId(0);
            setSelectedTable(null);
            setReserveItem("");
            setConfirmPopup(false);
            Fetchdata();
    
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
            setConfirmPopup(false);
            setReserveId(0);
            setSelectedTable(null);
            setReserveItem("");
        }
    
    }

    

    const validData = datas.filter(data => data.id != null);
    const availableTables = tables.filter(table => table.status === "available");

    const tableOptions = [
    { value: null, label: "-- เลือกโต๊ะ --" },
    ...availableTables.map(table => ({
        value: table.id,
        label: `${table.table_name} (ความจุ ${table.capacity})`
    }))
    ];

    

    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={3}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-hidden">
            <div className="relative flex flex-row gap-4 overflow-x-auto overflow-y-hidden min-w-full h-full">
                { isLoading ? 
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <span className="text-xl font-semibold text-center">isLoading</span>
                    </div>
                    : validData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <span className="text-xl font-semibold text-center">ไม่พบการจองคิว</span>
                        </div>)
                    :  validData.map((reserve) => (
                        <div key={`reserve-${reserve.id}`}
                        className="grid grid-rows-[1fr_auto] min-w-[400px] h-full p-4 bg-gray-200 rounded-lg shadow-sm border border-gray-300">
                        <div className="flex flex-col gap-7 flex-1">
                            <label className="flex justify-center font-bold text-2xl pb-5">Reserve id : {reserve.id}</label>
                            <label className="flex justify-center font-bold text-lg">Customer Role : {reserve.customer?.role}</label>
                            <label className="flex justify-center font-bold text-lg">Customer Id : {reserve.customer?.id}</label>
                            {(reserve.customer?.fname !== "guest" && reserve.customer?.lname !== "guest") &&
                                <label className="flex justify-center font-bold text-gray-500 text-lg">{reserve.customer?.fname} {reserve.customer?.lname}</label>
                            }
                            <label className="flex justify-center font-bold text-lg">จำนวนคน : {reserve.people_count}</label>
                            {
                                reserve.customer?.phone && reserve.customer?.phone !== "null" && reserve.customer?.phone !== "***" &&
                                <label className="flex justify-center font-bold text-lg">เบอร์โทรศัพท์ : {reserve.customer?.phone}</label>
                            }
                            <label className="flex justify-center font-bold text-lg">เวลาที่จองคิว : {reserve.checkin_date}</label>
                            <div className="flex flex-col gap-5 mt-auto">
                                <button className="px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                    onClick={() => {setConfirmPopup(true); setReserveId(reserve.id); setReserveItem(reserve);}}>
                                    จองโต๊ะ
                                </button>
                                <button className="px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white"
                                    onClick={() => {setCancelPopup(true); setReserveId(reserve.id);}}>
                                    ยกเลิกการจอง
                                </button>
                            </div>
                            <label className="flex flex-row-reverse">
                            <label className="text-gray-500 text-end">{reserve.created_date}</label>
                        </label>
                        </div>
                        
                    </div>
                    )) 
                }

            </div>
        </div>

            { ConfirmPopup && createPortal( 
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <label className="font-bold text-xl">Reserve ID : {reserveItem.id}</label>

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
                            </div>
                            
                            <div className="flex flex-row justify-between gap-10">
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                    onClick={() => {ConfirmHandle();}}>
                                Confirm
                                </button>
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                    onClick={() => {setConfirmPopup(false); setReserveId(0); setSelectedTable(null);}}>
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
                            <label className="font-bold text-xl">Reserve ID : {reserve_id}</label>
                            <p className="font-bold text-xl">คุณต้องการที่จะยกเลิกการจองคิวนี้ใช่หรือไม่</p>
                            <div className="flex flex-row justify-between gap-10">
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white" 
                                    onClick={() => {setCancelPopup(false); updateStatusHandle();}}>
                                Confirm
                                </button>
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                        hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                    onClick={() => {setCancelPopup(false); setReserveId(0);}}>
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

export default CHReservation;