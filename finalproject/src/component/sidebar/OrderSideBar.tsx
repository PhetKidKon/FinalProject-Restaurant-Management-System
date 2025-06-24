//setSelectedCategory={setSelectedCategory} setSearchValue={setSearchValue}
import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../content/CustomButton";
import { createPortal } from "react-dom";

import { AccountBar } from "./AccountBar";

export const OrderSidebar = ( {order_id, role, fname, selectedPage, orderitemsremain} 
    : {order_id: string, role: string, selectedPage: number, fname: string, orderitemsremain: number}) => {

    const navigate = useNavigate();

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const orderpath = "/order/"+order_id;
    const orderremain = orderpath+"/orderremain";
    const menu = orderpath+"/menu";

    return (
        <div className="flex flex-col h-screen p-2 space-y-4">

            <div className="border-b pb-2 ">
                <div className="flex flex-col p-0.5 gap-1 w-full">
                    <label className="text-base font-bold block">Order {order_id}</label>
                    <label className="text-sm text-gray-600 block">{role}</label>
                    {
                        fname && fname !== "guest" &&
                        <label className="text-sm text-gray-600 block">Customer: {fname}</label>
                    }
                </div>
            </div>

            <div className="flex-grow">
            <li className="flex flex-col space-y-4 list-none">
                <Link to={orderpath}><Route selected={selectedPage == 1 ? true : false} title="ออเดอร์ที่สั่งแล้ว" orderitemsremain={orderitemsremain}></Route></Link>
                <Link to={orderremain}><Route selected={selectedPage == 3 ? true : false} title="ออเดอร์รอยืนยัน" orderitemsremain={orderitemsremain}></Route></Link>
                <Link to={menu}><Route selected={selectedPage == 2 ? true : false} title="เมนู" orderitemsremain={orderitemsremain}></Route></Link>
            </li>
            </div>


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
                                                navigate('/');
                                                window.location.reload();
                                                }}>
                                        Close
                                        </button>
                                    </div>          
                                </div>
                            </div>, document.body
                        )}

            <div className="flex items-center justify-center h-16 ">
                <button className="flex justify-center py-3 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500 w-full
                        md:rounded-xl lg:rounded-2xl"
                        onClick={()=> {navigate('/'); sessionStorage.removeItem('orderitems');}}>
                    ออกจากการสั่งซื้อ
                </button>
            </div>
        </div>
    );

}

const Route = ({ selected, title, orderitemsremain } : {selected: boolean, title: string, orderitemsremain: number} ) => {
    
    return <button className={ selected ?
            "flex items-center justify-start py-3 w-full rounded text-sm transition-[box-shadow_background-color_color] bg-white text-stone-950 shadow" 
            : "flex items-center justify-start py-3 w-full rounded text-sm transition-[box-shadow_background-color_color] text-stone-600 bg-transparent hover:bg-blue-50"
            }
            >
        <span className="px-3">{title} 
            {
                title === "ออเดอร์รอยืนยัน" && orderitemsremain > 0 &&//bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold w-5 h-5 ">
                    {orderitemsremain}
                </span>
            }
        </span>
        </button>
}

export default OrderSidebar;