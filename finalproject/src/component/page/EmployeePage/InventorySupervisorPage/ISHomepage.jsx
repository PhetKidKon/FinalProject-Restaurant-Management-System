import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import ISSidebar from "../../../sidebar/ISSidebar";
import { AccountTable } from "../../../content/DataTable";

const ISHomepage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
    }, []);



    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <ISSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={0}></ISSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh]">

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

export default ISHomepage;