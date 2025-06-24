//setSelectedCategory={setSelectedCategory} setSearchValue={setSearchValue}
import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../content/CustomButton";
import { createPortal } from "react-dom";

import { AccountBar } from "./AccountBar";
import { CustomerReserveAdd } from "../content/ReservationContent";

export const CustomerSidebar = ( {email, name, point, customerData, selectedPage} 
    : {email: string, name: string, point: number, customerData: any, selectedPage: number}) => {

    const navigate = useNavigate();

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [showPopup, setShowPopup] = useState(false);


    return (
        <div className="flex flex-col h-screen p-2 space-y-4">

            {
                email === "null" && name === "null" ?
                <div className="flex items-center justify-center h-16 ">
                    <button className="flex justify-center py-3 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500 w-full
                        md:rounded-xl lg:rounded-2xl" onClick={() => {navigate('/customersignin')}}>
                        เข้าสู่ระบบ
                    </button>
                </div> : <div className="border-b pb-2 ">
                    <div className="flex flex-col p-0.5 gap-1 w-full">
                        <label className="text-base font-bold block">{name}</label>
                        <label className="text-sm text-gray-600 block">{email}</label>
                    </div>
                </div>
            }


            <div className="flex-grow">
            <li className="flex flex-col space-y-4 list-none">
                <Link to='/'><Route selected={selectedPage == 1 ? true : false} title="Menu"></Route></Link>
                <Link to='/table'><Route selected={selectedPage == 2 ? true : false} title="Table"></Route></Link>
                <Link to='/order'><Route selected={selectedPage == 3 ? true : false} title="Order"></Route></Link>
            </li>
            </div>

            <div className="flex items-center justify-center h-16 ">
                <button className="flex justify-center py-3 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500 w-full
                        md:rounded-xl lg:rounded-2xl"
                        onClick={()=> {setShowPopup(true);}}>
                    จองคิว
                </button>
            </div> 

            {
                showPopup && createPortal(
                      <CustomerReserveAdd trigger={showPopup} setTrigger={setShowPopup} customer_email={email} customerData={customerData} setAlert={setAlert} setAlertMessage={setAlertMessage}></CustomerReserveAdd>, document.body
                    )
            }

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

            {
                email === "null" && name === "null" ?
                <div className="flex justify-center py-6 "></div> 
                : <LogoutButton setAlert={setAlert} setAlertMessage={setAlertMessage}></LogoutButton>
            }
        </div>
    );

}

const Route = ({ selected, title } : {selected: boolean, title: string} ) => {
    return <button className={ selected ?
            "flex items-center justify-start py-3 w-full rounded text-sm transition-[box-shadow_background-color_color] bg-white text-stone-950 shadow" 
            : "flex items-center justify-start py-3 w-full rounded text-sm transition-[box-shadow_background-color_color] text-stone-600 bg-transparent hover:bg-blue-50"
            }
            >
        <span className="px-3">{title}</span>
        </button>
}

export default CustomerSidebar;