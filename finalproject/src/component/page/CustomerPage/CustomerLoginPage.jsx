import React, { useState, useEffect } from "react";
import AuthPage from "../../layout/AuthLayout";
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const CustomerLoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isSignin, setIsSignin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    }, []);


    const loginhandle = async (e) => {

        e.preventDefault();

        let hasError = false;

        setErrorEmail('');
        if(!validator.isEmail(email)){
            setErrorEmail("Invalid Email Format");
            hasError = true;
        }

        setErrorPassword('');
        if(password.length < 3){
            setErrorPassword("Password must be at least 3");
            hasError = true;
        }

        if(hasError){
            return;
        }
        
        try {
            const res = await axios.post(`http://localhost:3001/api/accounts/signin/customer`, {
                    email,
                    password
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

            const token = responseData.token;
            const role = responseData.role;
            const fname = responseData.fname;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role);
            sessionStorage.setItem('customer_email', email);
            sessionStorage.setItem('customer_fname', fname);

            setAlertMessage("เข้าสู่ระบบสำเร็จ")

            setAlert(true);
            setIsSignin(true);

        } catch (error) {
            console.error("Error creating account:", error);

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

            setAlertMessage("กรอกอีเมลหรือรหัสผ่านไม่ถูกต้อง")
            setAlert(true);
            setIsSignin(false);
        }

    }

    return (
        <AuthPage>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition-colors"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-5 h-5" />
                    กลับหน้าหลัก
                </button>
            </div>

            <h1 className="text-xl font-bold leading-tight tracking-tight mb-10">Customer : Sign in</h1>
            

            <form onSubmit={loginhandle} className="space-y-6 max-w-lg mx-auto">
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row">
                        <label className="block mb-3 text-sm font-medium ">Email
                        { errorEmail && 
                            <label className="ml-3 text-sm font-medium text-red-900 text-right">* {errorEmail}</label>
                        }
                        </label>
                    </div>
                    <input 
                        type="text" placeholder="example@email.com" 
                        className={ errorPassword ? "bg-red-100 w-full border-2 block p-2 border-red-100 rounded-lg focus:outline-red-500 focus:border-red-500" :
                            "bg-gray-200 w-full border-2 block p-2 border-gray-200 rounded-lg focus:outline-gray-800 focus:border-gray-600" 
                        }
                        value={email} onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col space-y-2 pb-5">
                    <div className="flex flex-row mb-3 ">
                            <label className="block text-sm font-medium">Password
                            { errorPassword && 
                                <label className="ml-3 text-sm font-medium text-red-900 text-right">* {errorPassword}</label>
                            }
                            </label>
                    </div>
                    <input 
                        type="password" placeholder="****" 
                        className={ errorPassword ? "bg-red-100 w-full border-2 block p-2 border-red-100 rounded-lg focus:outline-red-500 focus:border-red-500" :
                            "bg-gray-200 w-full border-2 block p-2 border-gray-200 rounded-lg focus:outline-gray-800 focus:border-gray-600" 
                        }
                        value={password} onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button
                className="flex flex-row justify-end text-sm text-end text-red-500 hover:text-red-400 font-medium mt-4 mb-5"
                onClick={() => navigate('/customersignup')}
                >
                    สมัครสมาชิกใหม่?
                </button>

                <button type="submit" className="w-full text-black bg-blue-600 font-medium rounded-2xl px-5 py-2.5 hover:bg-blue-700">Login</button>
            </form>

            { alert && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <p className="font-bold text-xl ">{alertMessage}</p> 
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                onClick={() => {
                                    setAlert(false); 
                                    if(isSignin){
                                        navigate('/');
                                    }
                                    }}>
                            Close
                            </button>
                        </div>          
                    </div>
                </div>, document.body
            )}
            
            
        </AuthPage>
    )

}

export default CustomerLoginForm;