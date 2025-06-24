import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../content/CustomButton";
import { createPortal } from "react-dom";

import { AccountBar } from "./AccountBar";

export const ISSidebar = ( {email, name, selectedPage} : {email: string, name: string, selectedPage: number} ) => {

    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    return (
        <div className="flex flex-col h-screen p-2 space-y-4">
            <AccountBar email={email} name={name}></AccountBar>

            <div className="flex-grow">
            <li className="flex flex-col space-y-4 list-none">
                <Link to={'/inventorysupervisor/menu'}><Route selected={selectedPage == 1 ? true : false} title="Menu"></Route></Link>
                <Link to={'/inventorysupervisor/ingredient'}><Route selected={selectedPage == 2 ? true : false} title="Ingredient"></Route></Link>
                <Link to={'/inventorysupervisor/transaction'}><Route selected={selectedPage == 3 ? true : false} title="Transaction"></Route></Link>
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
                                    navigate('/employee');
                                    }}>
                                Close
                            </button>
                        </div>          
                    </div>
                </div>, document.body
            )}

            <LogoutButton setAlert={setAlert} setAlertMessage={setAlertMessage}></LogoutButton>
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

export default ISSidebar;