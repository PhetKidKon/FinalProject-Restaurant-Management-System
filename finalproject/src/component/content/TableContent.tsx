import React, { use, useState } from "react";
import validator from 'validator';
import axios from "axios";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';

export function TableCards({data, order, usedTo, fetchData}: 
    {  data: any; usedTo: any; fetchData: () => void; order: any}) {

    const navigate = useNavigate();

    const [alert, setAlert] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");

    

    const getStatusDisplay = (status: string) => {
        if (status === "occupied") {
            return <span className="text-sm font-medium text-blue-600">ถูกใช้งาน</span>;
        }
        if (status === "available") {
            return <span className="text-sm font-medium text-green-600">ว่าง</span>;
        }
        return <span className="text-sm font-medium text-gray-500">{status}</span>;
    };

    return (
        <>
        <button className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200
                                hover:cursor-pointer w-full text-left"
                onClick={() => {
                  // เพิ่มฟังก์ชันเมื่อคลิกโต๊ะ
                }}>
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {data.table_name}
                    </h3>
                    {/* สถานะ */}
                    {getStatusDisplay(data.status)}
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium text-emerald-600">
                        {data.capacity} ที่นั่ง
                    </span>
                    {
                        order && usedTo === "CHTable" ? 
                        <span className="text-sm font-medium text-blue-600">
                            Order ID: #{order.order_id}
                        </span>
                        : usedTo === "CHTable" ? <span className="text-sm text-gray-400">
                            ไม่มีออเดอร์ที่ใช้งาน
                        </span>
                        : <span className="text-sm text-gray-400">
                            
                        </span>
                    }
                </div>
            </div>
        </button>

        { alert && createPortal(
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                    <div className="space-y-15 flex flex-col items-center justify-center py-5">
                        <p className="font-bold text-xl ">{alertMessage}</p> 
                        <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                            onClick={() => {
                                setAlert(false)
                                setAlertMessage("");
                                }}>
                        Close
                        </button>
                    </div>          
                </div>
            </div>, document.body
         )}

        </>
    );

}