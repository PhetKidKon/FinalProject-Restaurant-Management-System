import React, { useState, useEffect } from "react";
import AuthPage from "../../layout/AuthLayout";
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";


const CustomerSignUpForm = () => { 

    const [email, setEmail] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState(""); 

    const [errorEmail, setErrorEmail] = useState("");
    const [errorFname, setErrorFname] = useState("");
    const [errorLname, setErrorLname] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
    }, []);


    const loginhandle = async (e) => {

        e.preventDefault();

        let hasError = false;

        setErrorEmail('');
        setErrorPassword('');
        setErrorFname('');
        setErrorLname('');
        setErrorPhone('');


        if(!validator.isEmail(email)){
            setErrorEmail("Invalid Email Format");
            hasError = true;
        }

        if(fname.length < 3){
            setErrorFname("First name must be at least 3 characters");
            hasError = true;
        }

        if(lname.length < 3){
            setErrorLname("Last name must be at least 3 characters");
            hasError = true;
        }

        if(!validator.isMobilePhone(phone, 'any', { strictMode: false })){
            setErrorPhone("Invalid Phone Number");
            hasError = true;
        }

        if(password.length < 3){
            setErrorPassword("Password must be at least 3");
            hasError = true;
        }

        if(hasError){
            return;
        }

        console.log("email :", email);
        console.log("pass :", password);
        console.log("fname :", fname);
        console.log("lname :", lname);
        console.log("phone :", phone);


        
        try {
            const res = await axios.post(`http://localhost:3001/api/accounts/member/create`, { 
                    email :email,
                    password :password,
                    fname :fname,
                    lname :lname,
                    phone :phone
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

            setIsLogin(true);
            setAlertMessage("สมัครสมาชิกสำเร็จ กรุณากลับไปที่หน้าล็อกอินเพื่อเข้าสู่ระบบ");
            setAlert(true);

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

            setAlert(true);
        }

    }

    return (
        <AuthPage>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition-colors"
                    onClick={() => navigate('/customersignin')}
                >
                    <ArrowLeft className="w-5 h-5" />
                    กลับหน้าล็อกอิน
                </button>
            </div>

            <h1 className="text-xl font-bold leading-tight tracking-tight mb-10">Sign Up</h1>

            <form onSubmit={loginhandle} className="space-y-6 max-w-lg mx-auto">
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row">
                        <label className="block mb-3 text-sm font-medium ">First Name
                        { errorFname && 
                            <label className="ml-3 text-sm font-medium text-red-900 text-right">* {errorFname}</label>
                        }
                        </label>
                    </div>
                    <input 
                        type="text" placeholder="ชื่อจริง" 
                        className={ errorFname ? "bg-red-100 w-full border-2 block p-2 border-red-100 rounded-lg focus:outline-red-500 focus:border-red-500" :
                            "bg-gray-200 w-full border-2 block p-2 border-gray-200 rounded-lg focus:outline-gray-800 focus:border-gray-600" 
                        }
                        value={fname} onChange={(e) => setFname(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row">
                        <label className="block mb-3 text-sm font-medium ">Last Name
                        { errorLname && 
                            <label className="ml-3 text-sm font-medium text-red-900 text-right">* {errorLname}</label>
                        }
                        </label>
                    </div>
                    <input 
                        type="text" placeholder="นามสกุล" 
                        className={ errorLname ? "bg-red-100 w-full border-2 block p-2 border-red-100 rounded-lg focus:outline-red-500 focus:border-red-500" :
                            "bg-gray-200 w-full border-2 block p-2 border-gray-200 rounded-lg focus:outline-gray-800 focus:border-gray-600" 
                        }
                        value={lname} onChange={(e) => setLname(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row">
                        <label className="block mb-3 text-sm font-medium ">Phone
                        { errorPhone && 
                            <label className="ml-3 text-sm font-medium text-red-900 text-right">* {errorPhone}</label>
                        }
                        </label>
                    </div>
                    <input 
                        type="text" placeholder="เบอร์โทรศัพท์" 
                        className={ errorPhone ? "bg-red-100 w-full border-2 block p-2 border-red-100 rounded-lg focus:outline-red-500 focus:border-red-500" :
                            "bg-gray-200 w-full border-2 block p-2 border-gray-200 rounded-lg focus:outline-gray-800 focus:border-gray-600" 
                        }
                        value={phone} onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>
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

                <button type="submit" className="w-full text-black bg-blue-600 font-medium rounded-2xl px-5 py-2.5 hover:bg-blue-700">Sign Up</button>
            </form>

            { alert && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                        <div className="space-y-15 flex flex-col items-center justify-center py-5">
                            <p className="font-bold text-xl ">{alertMessage}</p> 
                            <button className="flex flex-row items-center px-4 py-1 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                    hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white" 
                                onClick={() => {setAlert(false); if(isLogin){navigate('/customersignin')};}}>
                            Close
                            </button>
                        </div>          
                    </div>
                </div>, document.body
            )}
            
            
        </AuthPage>
    )

}

export default CustomerSignUpForm;