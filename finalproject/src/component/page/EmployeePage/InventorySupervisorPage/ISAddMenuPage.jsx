import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import axios from "axios";

import ISSidebar from "../../../sidebar/ISSidebar";
import { CreateMenu } from "../../../content/EditPopup";


const ISAddMenuPage = ({}) => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [menu, setMenu] = useState([]);
    const [ingr, setIngr] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        Fetchdata();
    }, []);

    const Fetchdata = async () => {
        try {
            // Fetching menu data
            const response = await axios.get("http://localhost:3001/api/menu");
            setMenu(response.data);

            // Fetching ingredient data
            const ingrResponse = await axios.get("http://localhost:3001/api/ingr");
            setIngr(ingrResponse.data);

            setIsLoading(false);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const menus_name =  menu.map(item => item.name);

    return (
        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] overflow-hidden">
            <ISSidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={1}></ISSidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh] overflow-x-auto">
                { !isLoading ? 
                    <div className="space-y-5">
                        <Link to={'/inventorysupervisor/menu'}>
                                <button className="px-4 py-1 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                                    hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300">
                                    Previous
                                </button>
                            </Link>
                        <div className="flex flex-col px-4 space-x-5 ">
                            <label className="text-2xl font-bold py-10">Create Menu</label>

                            <form action="">
                                <div className="flex flex-col gap-4">

                                    <CreateMenu setAlert={setAlert} setAlertMessage={setAlertMessage} fetchData={Fetchdata} email={email} menus_name={menus_name} ingr_data={ingr} isAdded={setIsAdded}/>

                                </div>
                            </form>

                        </div>
                        
                    </div> : <div className="">isLoading</div>
                }
                { alert && createPortal(
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                            <div className="space-y-15 flex flex-col items-center justify-center py-5">
                                <p className="font-bold text-xl ">{alertMessage}</p> 
                                <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                            hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                         onClick={() => {
                                            setAlert(false);
                                            if (isAdded){
                                                navigate('/inventorysupervisor/menu');
                                            }
                                            }}>
                                    Close
                                    </button>
                                </div>
                                                            
                        </div>
                    </div>, document.body
                )}
            </div>
        </div>
    );
}

export default ISAddMenuPage;