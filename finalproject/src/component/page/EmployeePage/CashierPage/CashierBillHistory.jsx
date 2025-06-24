import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import CHSidebar from "../../../sidebar/CHSidebar";
import axios from "axios";
import { ShowCashierOrderItem} from "../../../content/EditPopup";

const CHBillHistoryPage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [BillItem, setBillItem] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [cashAmount, setCashAmount] = useState();
    const [change, setChange] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
        
    const [selectOrderitem, setSelectOrderitem] = useState("");
    const [selectOrderId, setSelectedOrderId] = useState("");
    const [selectBillId, setSelectedBillId] = useState("");

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    // ปรับปรุง useEffect order
    useEffect(() => {
        Fetchdata();
        if (paymentMethod === "cash" && BillItem && BillItem.total_price) {
            const paid = parseFloat(cashAmount) || 0;
            setChange(paid - BillItem.total_price);
        } else {
            setChange(0);
        }
    }, [cashAmount, paymentMethod, BillItem]);

    const Fetchdata = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/api/bill/paid");

            setData(response.data);
            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertMessage("Error loading Bill. Please relaod this page.");
            setAlert(true);
        } finally {
            setIsLoading(false); 
        }
    };


    const validData = data.filter(data => data.id != null);


    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <CHSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={6}></CHSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-hidden">
            <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden min-w-full h-full">
                { isLoading ? 
                        <div className="flex items-center justify-center w-full">
                            <span className="text-xl font-semibold text-center">isLoading</span>
                        </div>
                    : validData.length === 0 ?
                        <div className="flex items-center justify-center w-full">
                            <span className="text-xl font-semibold text-center">ไม่พบบิล</span>
                        </div>
                    : validData.map((bill) => (
                        <div key={`bill-${bill.id}`}
                        className="grid grid-rows-[22%_58%_20%] min-w-[400px] h-full p-4 bg-gray-200 rounded-lg shadow-sm border border-gray-300">
                            <div className="flex flex-col gap-2 ">
                                <label className="flex justify-center font-bold">Bill id : {bill.id}</label>
                                <label className="flex justify-center font-bold">Order id : {bill.order.id}</label>
                                <label className="flex justify-center font-bold">Table : {bill.order.table.table_name}</label>
                                <label className="flex justify-center font-bold"> {bill.order?.reservation?.customer?.role} </label>
                                { bill.order?.reservation?.customer?.role === "Member" &&
                                    <label className="flex justify-center font-bold text-gray-500">{bill.order?.reservation?.customer?.fname} {bill.order?.reservation?.customer?.lname}</label>
                                }
                            </div>
                            <div className="relative flex flex-col bg-gray-50 rounded-lg shadow-sm border border-black-200 overflow-x-auto">
                                <div className="flex flex-row justify-between items-center bg-sky-400 h-2 p-5">
                                    <label className="basis-1/4 font-semibold">เมนู</label>
                                    <label className="basis-1/4 text-center font-semibold">จำนวน</label>
                                    <label className="basis-1/4 text-center font-semibold">ราคา</label>
                                </div>
                                {
                                    (bill.order.orderItems).map((orderitem) => (
                                        <button key={`orderitem-${orderitem.id}`}
                                        className="flex flex-row justify-between gap-4 p-3 transition-[box-shadow_background-color_color] 
                                            hover:bg-emerald-100 hover:shadow-lg active:bg-emerald-200"
                                        onClick={() => {
                                                setSelectOrderitem(orderitem);
                                                setSelectedOrderId(bill.order.id);
                                                setSelectedBillId(bill.id);
                                                setShowPopup(true);
                                            }}
                                        >
                                            <label className="basis-1/4 text-center">{orderitem.menuItem.name}
                                                {orderitem.comment && orderitem.comment.trim() !== "" && 
                                                    <label className="text-red-500">*</label>
                                                }
                                            </label>
                                            <label className="basis-1/4 text-center">{orderitem.qty} {orderitem.menuItem.unit}</label>
                                            <label className="basis-1/4 text-center">{orderitem.total_price}</label>
                                        </button>
                                    ))
                                }
                            </div>
                            <div className="flex flex-col justify-between">
                                <label className="flex flex-row mt-4 text-red-500 font-semibold">ราคาทั้งหมด : {bill.total_price} บาท</label>
                                <label className="flex flex-row justify-between">
                                    <div className="flex flex-col">
                                        <label className="text-gray-500 text-end invisible">.</label>
                                        <label className="text-gray-500 text-end invisible">.</label>
                                        <label className="font-semibold ">Cashier</label>
                                        <label className="text-gray-500 text-end">{bill.order?.created_by?.account?.email}</label>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-500 text-end">วันที่จ่ายบิล</label>
                                        <label className="text-gray-500 text-end">{bill.paid_date}</label>
                                        <label className="text-gray-500 text-end">วันที่สร้างบิล</label>
                                        <label className="text-gray-500 text-end">{bill.created_date}</label>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>

        { showPopup && createPortal(
                <ShowCashierOrderItem trigger={showPopup} data={selectOrderitem} order_id={selectOrderId} setTrigger={setShowPopup} bill_id={selectBillId}>
                </ShowCashierOrderItem>, document.body
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

export default CHBillHistoryPage;