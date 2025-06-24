import React, { useState } from "react";
import validator from 'validator';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:3001/api"

export function LogoutButton({setAlert, setAlertMessage} :
    {setAlert: (boolean) => void, setAlertMessage: (string) => void}) {

    const signout = async (e: React.FormEvent) => {
    
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('fname');
        sessionStorage.removeItem('customer_email');
        sessionStorage.removeItem('customer_fname');


        try {
                    const res = await axios.post(`http://localhost:3001/api/accounts/signout`, {
                            token
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
        
                    setAlert(true);
                    setAlertMessage("ออกจากระบบสำเร็จ");
        
        
                } catch (error) {
                    console.error("Error creating account:", error);
        
                    if (error.response) {
                        const statusCode = error.response.status;
                        const errorData = error.response.data;
        
                        if (typeof errorData === "string") {
                            try {
                                const parsedData = JSON.parse(errorData);
                                console.log(parsedData.message || `Error ${statusCode}`);
                            } catch (parseError) {
                                console.log(errorData || `Error ${statusCode}`);
                            }
                        } else {
                            console.log(errorData.message || `Error ${statusCode}`);
                        }
                    } else {
                        console.log("An error occurred");
                    }
        
                    console.log(true);

                    setAlert(true);
                    setAlertMessage("ออกจากล้มเหลว");
                }


    }

    return <button onClick={signout} className="flex justify-center py-3 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500">
                <span className="px-2 text-stone-950">
                    Logout
                </span>
            </button>
}