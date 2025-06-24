import React, { useState } from "react";
import validator from 'validator';
import axios from "axios";
import Select from 'react-select';
import ReactDatePicker from "react-datepicker";

const API_URL = "http://localhost:3001/api"

export function CreateAccount({ trigger, data, setTrigger, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; data: any; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void }) {

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("guest");

    const [errorFname, setErrorFname] = useState("");
    const [errorLname, setErrorLname] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const emails =  data.map(item => item.account?.email).filter((email): email is string => typeof email === 'string');

    const loginHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorFname("");
        setErrorLname("");
        setErrorPhone("");
        setErrorEmail("");
        setErrorPassword("");

        let hasError = false;

        // Validate the input fields
        if (fname === "") {
            setErrorFname("First name is required");
            hasError = true;
        }
        
        if (lname === "") {
            setErrorLname("Last name is required");
            hasError = true;
        }

        if (phone === "") {
            setErrorPhone("Phone number is required");
            hasError = true;
        } else if (!validator.isMobilePhone(phone, 'any')) {
            setErrorPhone("Invalid phone number format");
            hasError = true;
        }


        if (role !== "guest"){
            if (email === "") {
                setErrorEmail("Email is required");
                hasError = true;
            } else if (!validator.isEmail(email)) {
                setErrorEmail("Invalid email format");
                hasError = true;
            } else if(emails.includes(email)){
                setErrorEmail("Email Already Existed")
                hasError = true;
            }
            if (password === "") {
                setErrorPassword("Password is required");
                hasError = true;
            } else if(password.length < 3){
                setErrorPassword("Password must be at least 3 characters long");
                hasError = true;
            }

        }

        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/accounts/person/create`, {
                fname,
                lname,
                phone,
                email,
                password,
                role
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

            setAlertMessage(responseData.message ?? "Account created successfully");
            console.log("Account created successfully:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Role</label>
                        <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800"
                            value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="guest">Guest</option>
                            <option value="member">Member</option>
                            <option value="cashier">Cashier</option>
                            <option value="inventorysupervisor">Inventory Supervisor</option>
                            <option value="systemadmin">System Admin</option>
                        </select>

                        <label className="text-lg font-semibold">First Name 
                            { errorFname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorFname}</label>}
                        </label>
                        <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Last Name 
                            { errorLname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorLname}</label>}
                        </label>
                        <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Phone 
                            { errorPhone && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorPhone}</label>}
                        </label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        { role !== "guest" && <label className="text-lg font-semibold">Email 
                            { errorEmail &&
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorEmail}</label>}
                            </label>
                        }
                        { role !== "guest" && <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-md p-2" />}

                        { role !== "guest" && <label className="text-lg font-semibold">Password 
                            { errorPassword &&
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorPassword}</label>}
                            </label>
                        }
                        { role !== "guest" && <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-md p-2" />}

                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => {setTrigger(false); fetchData();}}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                                onClick={loginHandle}
                                >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function UpdateAccount({ trigger, setTrigger, data, emails, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any ; emails: any; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    const [fname, setFname] = useState(data.fname ?? "");
    const [lname, setLname] = useState(data.lname ?? "");
    const [phone, setPhone] = useState(data.phone ?? "");
    const [email, setEmail] = useState(data.account?.email ?? "");
    const [isemailupdate, setIsemailupdate] = useState(false);
    const [password, setPassword] = useState(data.account?.password ?? "");
    const [status, setStatus] = useState(data.account?.status ?? "inactive");

    const [errorFname, setErrorFname] = useState("");
    const [errorLname, setErrorLname] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const isemailupdateToggle = () => {setIsemailupdate(prev => !prev); setEmail(data.account?.email ?? "")};

    const role = String(data.role).toLowerCase();

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorFname("");
        setErrorLname("");
        setErrorPhone("");
        setErrorEmail("");
        setErrorPassword("");

        let hasError = false;

        // Validate the input fields
        if (fname === "") {
            setErrorFname("First name is required");
            hasError = true;
        }
        
        if (lname === "") {
            setErrorLname("Last name is required");
            hasError = true;
        }

        if (phone === "") {
            setErrorPhone("Phone number is required");
            hasError = true;
        } else if (!validator.isMobilePhone(phone, 'any')) {
            setErrorPhone("Invalid phone number format");
            hasError = true;
        }


        if (role !== "guest"){
            
            if (email === "") {
                setErrorEmail("Email is required");
                hasError = true;
            } else if (isemailupdate && !validator.isEmail(email)) {
                setErrorEmail("Invalid email format");
                hasError = true;
            }else if(isemailupdate && emails.includes(email)){
                setErrorEmail("Email Already Existed")
                hasError = true;
            }
            if (password === "") {
                setErrorPassword("Password is required");
                hasError = true;
            } else if(password.length < 3){
                setErrorPassword("Password must be at least 3 characters long");
                hasError = true;
            }

        }

        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/accounts/person/${data.id}/update`, {
                    fname,
                    lname,
                    phone,
                    email,
                    password,
                    status,
                    role,
                    isemailupdate
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

            setAlertMessage(responseData.message ?? "Update Account Successful");
            console.log("Update Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.delete(`${API_URL}/accounts/person/${data.id}/delete`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} // ใช้ `data` สำหรับส่ง body ในคำขอ DELETE
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Account {data.id}</label>
                        </div>

                        <label className="text-lg font-semibold">First Name 
                        { errorFname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorFname}</label>}
                        </label>
                        <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Last Name 
                        { errorLname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorLname}</label>}
                        </label>
                        <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Phone 
                        { errorPhone && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorPhone}</label>}
                        </label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        { role !== "guest" && <label className="text-lg font-semibold">
                            <button type="button" className={`relative inline-flex h-6 w-11 me-3 items-center rounded-xl text-white transition ${isemailupdate ? 'bg-green-500' : 'bg-red-500'}`}
                            onClick={isemailupdateToggle}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                                                ${isemailupdate ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                            Email
                            { errorEmail &&
                                <label className="ml-5 text-sm font-medium text-red-900">* {errorEmail}</label>}
                            </label>}
                        { role !== "guest" && <input type="email" disabled={!isemailupdate} value={email} onChange={(e) => setEmail(e.target.value)} 
                            className={`border border-gray-300 rounded-md p-2 ${isemailupdate ? 'bg-white' : 'bg-gray-300'}` } />}

                        { role !== "guest" && <label className="text-lg font-semibold">Password 
                            { errorPassword &&
                                <label className="ml-5 text-sm font-medium text-red-900">* {errorPassword}</label>}
                            </label>}
                        { role !== "guest" && <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-md p-2" />}

                        { role !== "guest" && <label className="text-lg font-semibold">Status 
                            { errorPassword &&
                                <label className="ml-5 text-sm font-medium text-red-900">* {errorPassword}</label>}
                            </label>}
                        { role !== "guest" && <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800"
                                value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        }

                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function CreateTable({ trigger, setTrigger, setAlert, setAlertMessage, fetchData, email, data}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void; email: string, data: any}) {


    const [table_name, setTable_name] = useState("");
    const [capacity, setCapacity,] = useState<number>(0);


    const [errorTableName, setErrorTableName] = useState("");
    const [errorTableCapacity, setErrorTableCapacity] = useState("");

    const tables_name =  data.map(item => item.table_name).filter((table_name): table_name is string => typeof table_name === 'string');

    const loginHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorTableName("");
        setErrorTableCapacity("");

        let hasError = false;
        
        // Validate the input fields
        if (table_name === "") {
            setErrorTableName("Table name is required");
            hasError = true;
        }else if(tables_name.includes(table_name)){
            setErrorTableName("Table name is Already Existed");
            hasError = true;
        }
        if (capacity <= 0) {
            setErrorTableCapacity("Capacity must be greater than 0");
            hasError = true;
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/table/create`, {
                    table_name,
                    capacity,
                    email,
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
    
                setAlertMessage(responseData.message ?? "Account created successfully");
                console.log("Account created successfully:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }

        
    }
    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <label className="text-lg font-semibold">Table Name 
                            { errorTableName && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorTableName}</label>}
                        </label>
                        <input type="text" value={table_name} onChange={(e) => setTable_name(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Capacity
                            { errorTableCapacity && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorTableCapacity}</label>}
                        </label>
                        <input type="text" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => {setTrigger(false); fetchData();}}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                                onClick={loginHandle}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function UpdateTable({ trigger, setTrigger, data, tables_name, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; tables_name: any; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    const [table_name, setTable_name] = useState(data.table_name ?? "");
    const [capacity, setCapacity,] = useState<number>(data.capacity ?? 0);
    const [status, setStatus] = useState(data.status ?? "inactive");
    const [istablenameupdate, setIstablenameupdate] = useState(false);
    
    
    const [errorTableName, setErrorTableName] = useState("");
    const [errorTableCapacity, setErrorTableCapacity] = useState("");

    const istablenameupdateToggle = () => {setIstablenameupdate(prev => !prev); setTable_name(data.table_name ?? "")};

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorTableName("");
        setErrorTableCapacity("");

        let hasError = false;

        // Validate the input fields
        if (istablenameupdate && table_name === "") {
            setErrorTableName("Table name is required");
            hasError = true;
        }else if(istablenameupdate && tables_name.includes(table_name)){
            setErrorTableName("Table name is Already Existed");
            hasError = true;
        }
        
        if (capacity <= 0) {
            setErrorTableCapacity("Capacity must be greater than 0");
            hasError = true;
        }

        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/table/${data.id}/update`, {
                    table_name,
                    capacity,
                    status,
                    istablenameupdate
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

            setAlertMessage(responseData.message ?? "Update Table Successful");
            console.log("Update Table Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.delete(`${API_URL}/table/${data.id}/delete`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} // ใช้ `data` สำหรับส่ง body ในคำขอ DELETE
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">

                    <div className="flex flex-row justify-center pb-3">
                        <label className="text-lg font-bold text-center">Table {data.id}</label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">
                            <button type="button" className={`relative inline-flex h-6 w-11 me-3 items-center rounded-xl text-white transition ${istablenameupdate ? 'bg-green-500' : 'bg-red-500'}`}
                            onClick={istablenameupdateToggle}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                                                ${istablenameupdate ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                            Table Name
                        { errorTableName && 
                            <label className={"ml-5 text-sm font-medium text-red-900"}>* {errorTableName}</label>}
                        </label>
                        <input type="text" value={table_name} disabled={!istablenameupdate} onChange={(e) => setTable_name(e.target.value)} 
                            className={`border border-gray-300 rounded-md p-2 ${istablenameupdate ? 'bg-white' : 'bg-gray-300'}`} />

                        <label className="text-lg font-semibold">Capacity
                        { errorTableCapacity && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorTableCapacity}</label>}
                        </label>
                        <input type="text" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Status</label>
                        <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800"
                            value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            
                        </select>
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function UpdateIngredient({ trigger, setTrigger, data, ingrs_name, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; ingrs_name: any ; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    
    const [name, setName] = useState(data.name ?? "");
    const [type, setType] = useState(data.type ?? "none");
    const [unit, setUnit] = useState(data.unit ?? "none");
    const [status, setStatus] = useState(data.status ?? "inactive");
    const [isNameupdate, setIsNameupdate] = useState(false);
    
    const [errorName, setErrorName] = useState("");
    const [errorType, setErrorType] = useState("");
    const [errorUnit, setErrorUnit] = useState("");

    const UnitOptions = [
    { value: "none", label: "กรุณาระบุประเภทหน่วยบอกปริมาณวัตถุดิบ" },
    { value: "กรัม", label: "กรัม" },
    { value: "มิลลิลิตร", label: "มิลลิลิตร" },
    { value: "ชิ้น", label: "ชิ้น" },
    { value: "ฟอง", label: "ฟอง" },
    { value: "ลูก", label: "ลูก" },
    { value: "ใบ", label: "ใบ" },
    ];

    const unitmenuOptions = unit === "none"
    ? UnitOptions
    : UnitOptions.filter(opt => opt.value !== "none");

    const TypeOptions = [
    { value: "none", label: "กรุณาระบุประเภทประเภทวัตถุดิบ" },
    { value: "เนื้อสัตว์", label: "เนื้อสัตว์" },
    { value: "อาหารทะเล", label: "อาหารทะเล" },
    { value: "ผัก/สมุนไพร", label: "ผัก/สมุนไพร" },
    { value: "ผลไม้", label: "ผลไม้" },
    { value: "เครื่องเทศ", label: "เครื่องเทศ" },
    { value: "เครื่องปรุงรส", label: "เครื่องปรุงรส" },
    { value: "ของแห้ง", label: "ของแห้ง" },
    { value: "วัตถุดิบแปรรูป", label: "วัตถุดิบแปรรูป" },
    { value: "วัตถุดิบปรุงสุก", label: "วัตถุดิบปรุงสุก" },
    { value: "ไข่และผลิตภัณฑ์ไข่", label: "ไข่และผลิตภัณฑ์ไข่" },
    ];

    const TypemenuOptions = unit === "none"
    ? TypeOptions
    : TypeOptions.filter(opt => opt.value !== "none");

    const isnameupdateToggle = () => {setIsNameupdate(prev => !prev); setName(data.name ?? "")};

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorName("");
        setErrorType("");
        setErrorUnit("");

        let hasError = false;

        // Validate the input fields
        if (name === "") {
            setErrorName("Name is required");
            hasError = true;
        }
        
        if (type === "") {
            setErrorType("Type is required");
            hasError = true;
        }

        if (unit === "") {
            setErrorUnit("Unit is required");
            hasError = true;
        }

        if (isNameupdate && ingrs_name.includes(name)) {
            setErrorName("Ingredient name is Already Existed");
            hasError = true;
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/ingr/${data.id}/update`, {
                    name,
                    type,
                    unit,
                    status,
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

            setAlertMessage(responseData.message ?? "Update Table Successful");
            console.log("Update Table Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.delete(`${API_URL}/ingr/${data.id}/delete`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} // ใช้ `data` สำหรับส่ง body ในคำขอ DELETE
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-row justify-center pb-5">
                        <label className="text-lg font-bold text-center">Ingredient {data.id}</label>
                    </div>

                        <label className="text-lg font-semibold">
                            <button type="button" className={`relative inline-flex h-6 w-11 me-3 items-center rounded-xl text-white transition ${isNameupdate ? 'bg-green-500' : 'bg-red-500'}`}
                            onClick={isnameupdateToggle}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                                                ${isNameupdate ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                            Name 
                        { errorName && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorName}</label>}
                        </label>
                        <input type="text" value={name} disabled={!isNameupdate} onChange={(e) => setName(e.target.value)} 
                        className={`border border-gray-300 rounded-md p-2 ${isNameupdate ? 'bg-white' : 'bg-gray-300'}`} />

                        <label className="text-lg font-semibold">Type
                        { errorType && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorType}</label>}
                        </label>
                        <Select
                            options={TypemenuOptions}
                            value={TypeOptions.find(opt => opt.value === type)}
                            onChange={option => setType(option ? option.value : "none")}
                            className="w-full"
                            placeholder="กรุณาระบุประเภทประเภทวัตถุดิบ"
                        />

                        <label className="text-lg font-semibold">Unit
                        { errorUnit && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorUnit}</label>}
                        </label>
                        <Select
                            options={unitmenuOptions}
                            value={UnitOptions.find(opt => opt.value === unit)}
                            onChange={option => setUnit(option ? option.value : "none")}
                            className="w-full"
                            placeholder="เลือกหน่วยคิดจำนวนเมนู"
                        />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function UpdateIngredientStock({ trigger, setTrigger, data , ingr_id, setAlert, setAlertMessage, fetchData, email}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; ingr_id: number ; setAlert: (value: boolean) => void; 
        setAlertMessage: (value: String) => void; fetchData: () => void; email: any;}) {

    const [stock_id, setStock_id] = useState<number>(data.stock_id ?? 0);
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [expired_year, setExpired_year] = useState<number>(data.expired_year ?? 0);
    const [expired_month, setExpired_month] = useState<number>(data.expired_month ?? 0);
    const [expired_day, setExpired_day] = useState<number>(data.expired_day ?? 0);
    
    
    const [errorQty, setErrorQty] = useState(""); 
    const [errorExpired_year, setErrorExpired_year] = useState("");
    const [errorExpired_month, setErrorExpired_month] = useState("");
    const [errorExpired_day, setErrorExpired_day] = useState("");



    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");
        setErrorExpired_year("");
        setErrorExpired_month("");
        setErrorExpired_day("");

        let hasError = false;

        // Validate the input fields
        if (qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }
        
        if (expired_year <= 0) {
            setErrorExpired_year("Expired Year must be greater than 0");
            hasError = true;
        }

        if (expired_month <= 0) {
            setErrorExpired_month("Expired Month must be greater than 0");
            hasError = true;
        }

        if (expired_day <= 0) {
            setErrorExpired_day("Expired Day must be greater than 0");
            hasError = true;
        }



        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/ingr/${ingr_id}/updatestock`, {
                    stock_id,
                    qty,
                    expired_year,
                    expired_month,
                    expired_day,
                    email
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

            setAlertMessage(responseData.message ?? "Update Table Successful");
            console.log("Update Table Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.post(`${API_URL}/ingr/${ingr_id}/decreasestock/${data.stock_id}`, {
                    qty: data.qty,
                    description: "Delete Stock",
                    email
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">

                    <div className="flex flex-row justify-center pb-3">
                        <label className="text-lg font-bold text-center">Stock {data.stock_id}</label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Quantity 
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Day
                        { errorExpired_day && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_day}</label>}
                        </label>
                        <input type="text" value={expired_day} onChange={(e) => setExpired_day(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Month
                        { errorExpired_month && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_month}</label>}
                        </label>
                        <input type="text" value={expired_month} onChange={(e) => setExpired_month(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Year
                        { errorExpired_year && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_year}</label>}
                        </label>
                        <input type="text" value={expired_year} onChange={(e) => setExpired_year(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function UpdateReadyMadeStock({ trigger, setTrigger, data , menu_id, setAlert, setAlertMessage, fetchData, email}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; menu_id: number ; setAlert: (value: boolean) => void;
         setAlertMessage: (value: String) => void; fetchData: () => void; email: string}) {

    const [stock_id, setStock_id] = useState<number>(data.stock_id ?? 0);
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [expired_year, setExpired_year] = useState<number>(data.expired_year ?? 0);
    const [expired_month, setExpired_month] = useState<number>(data.expired_month ?? 0);
    const [expired_day, setExpired_day] = useState<number>(data.expired_day ?? 0);
    
    
    const [errorQty, setErrorQty] = useState(""); 
    const [errorExpired_year, setErrorExpired_year] = useState("");
    const [errorExpired_month, setErrorExpired_month] = useState("");
    const [errorExpired_day, setErrorExpired_day] = useState("");



    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");
        setErrorExpired_year("");
        setErrorExpired_month("");
        setErrorExpired_day("");

        let hasError = false;

        // Validate the input fields
        if (qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }
        
        if (expired_year <= 0) {
            setErrorExpired_year("Expired Year must be greater than 0");
            hasError = true;
        }

        if (expired_month <= 0) {
            setErrorExpired_month("Expired Month must be greater than 0");
            hasError = true;
        }

        if (expired_day <= 0) {
            setErrorExpired_day("Expired Day must be greater than 0");
            hasError = true;
        }



        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try { 
            const res = await axios.post(`${API_URL}/menu/readymade/${menu_id}/updatestock`, {
                    stock_id,
                    qty,
                    expired_year,
                    expired_month,
                    expired_day,
                    email
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

            setAlertMessage(responseData.message ?? "Update Table Successful");
            console.log("Update Table Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.post(`${API_URL}/menu/readymade/${menu_id}/decreasestock/${data.stock_id}`, {
                    qty: data.qty,
                    description: "Delete Stock",
                    email
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">

                    <div className="flex flex-row justify-center pb-3">
                        <label className="text-lg font-bold text-center">Menu {menu_id} Stock {data.stock_id}</label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Quantity 
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Day
                        { errorExpired_day && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_day}</label>}
                        </label>
                        <input type="text" value={expired_day} onChange={(e) => setExpired_day(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Month
                        { errorExpired_month && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_month}</label>}
                        </label>
                        <input type="text" value={expired_month} onChange={(e) => setExpired_month(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Year
                        { errorExpired_year && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpired_year}</label>}
                        </label>
                        <input type="text" value={expired_year} onChange={(e) => setExpired_year(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function DecreaseIngredientStock({ trigger, setTrigger, data , ingr_id, setAlert, setAlertMessage, fetchData, email}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; ingr_id: number ; setAlert: (value: boolean) => void; 
        setAlertMessage: (value: String) => void; fetchData: () => void; email: any;}) {

    const [qty, setQty] = useState<number>(0);
    
    
    const [errorQty, setErrorQty] = useState(""); 


    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();

        let hasError = false;

        if( qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }else if( qty > data.qty) {
            setErrorQty("Quantity must be less than or equal to current stock quantity");
            hasError = true;
        }

        if (hasError) {
            return; 
        }

        
        try {

            const res = await axios.post(`${API_URL}/ingr/${ingr_id}/decreasestock/${data.stock_id}`, {
                    qty: qty,
                    description: "Decrease Ingreident Stock id : "+data.stock_id,
                    email
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">

                    <div className="flex flex-row justify-center pb-3">
                        <label className="text-lg font-bold text-center">Ingredient {ingr_id} Stock {data.stock_id}</label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Quantity 
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Quantity Remain
                        </label>
                        <input type="text" value={data.qty} disabled={true} className="border border-gray-300 bg-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Date
                        </label>
                        <input type="text" value={data.expired_date} disabled={true} className="border border-gray-300 bg-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={deleteHandle}>
                            Decrease
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function DecreaseReadyMadeMenuStock({ trigger, setTrigger, data , menu_id, setAlert, setAlertMessage, fetchData, email}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; menu_id: number ; setAlert: (value: boolean) => void; 
        setAlertMessage: (value: String) => void; fetchData: () => void; email: any;}) {

    const [qty, setQty] = useState<number>(0);
    
    
    const [errorQty, setErrorQty] = useState(""); 


    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();

        let hasError = false;

        if( qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }else if( qty > data.qty) {
            setErrorQty("Quantity must be less than or equal to current stock quantity");
            hasError = true;
        }

        if (hasError) {
            return; 
        }

        
        try {

            const res = await axios.post(`${API_URL}/menu/readymade/${menu_id}/decreasestock/${data.stock_id}`, {
                    qty: qty,
                    description: "Decrease Ingreident Stock id : "+data.stock_id,
                    email
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

            setAlertMessage(responseData.message ?? "Deleted Account Successful");
            console.log("Deleted Account Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">

                    <div className="flex flex-row justify-center pb-3">
                        <label className="text-lg font-bold text-center">Ingredient {menu_id} Stock {data.stock_id}</label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Quantity 
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Quantity Remain
                        </label>
                        <input type="text" value={data.qty} disabled={true} className="border border-gray-300 bg-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Day
                        </label>
                        <input type="text" value={data.expired_date} disabled={true} className="border border-gray-300 bg-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={deleteHandle}>
                            Decrease
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function AddStock({ trigger, setTrigger, product_type, product_id, email, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void;product_type: String ; product_id: number ; email: String ;
         setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    const [qty, setQty] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [expiredDate, setExpiredDate] = useState<Date | null>(null);
    
    const [errorQty, setErrorQty] = useState(""); 
    const [errorDescription, setErrorDescription] = useState("");
    const [errorExpiredDate, setErrorExpiredDate] = useState("");

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");
        setErrorDescription("");
        setErrorExpiredDate("");

        let hasError = false;

        // Validate the input fields
        if (qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }

        if (description == "") {
            setErrorDescription("Description is required");
            hasError = true;
        }
        
        if (!expiredDate) {
            setErrorExpiredDate("Expired date is required");
            hasError = true;
        }

        const exp_year = expiredDate?.getFullYear() ?? 0;
        const exp_month = (expiredDate?.getMonth() ?? 0) + 1;
        const exp_day = expiredDate?.getDate() ?? 0;


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/transaction/addTransaction`, {
                    product_id,
                    product_type,
                    qty,
                    description,
                    exp_year: exp_year + 543,
                    exp_month,
                    exp_day,
                    email
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

            setAlertMessage(responseData.message ?? "Update Table Successful");
            console.log("Update Table Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }


    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">Quantity 
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Description 
                        { errorDescription && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorDescription}</label>}
                        </label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Expired Day
                        { errorExpiredDate && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorExpiredDate}</label>}
                        </label>
                        <ReactDatePicker
                            selected={expiredDate}
                            onChange={date => setExpiredDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholderText="เลือกวันหมดอายุ"
                            minDate={new Date()}
                        />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}


export function UpdateMenu({ trigger, setTrigger, data, menu_name, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; menu_name: any; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    
    const [name, setName] = useState(data.name ?? "");
    const [price, setPrice] = useState<number>(data.price ?? 0);
    const [unit, setUnit] = useState(data.unit ?? "none");
    const [category_name, setCategory_name] = useState(data.category_name ?? "none");
    const [status, setStatus] = useState(data.status ?? "inactive");
    const [description, setDescription] = useState(data.description ?? "");
    const [isNameupdate, setIsNameupdate] = useState(false);
    
    const [errorName, setErrorName] = useState("");
    const [errorPrice, setErrorPrice] = useState("");
    const [errorUnit, setErrorUnit] = useState("");
    const [errorCategory_name, setErrorCategory_name] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const CategoryNameOptions = [
    { value: "none", label: "กรุณาระบุประเภทของเมนู" },
    { value: "อาหารจานเดี่ยว", label: "อาหารจานเดี่ยว" },
    { value: "ของว่าง", label: "ของว่าง" },
    { value: "ของหวาน", label: "ของหวาน" },
    { value: "กับข้าว", label: "กับข้าว" },
    { value: "ยำ/สลัด", label: "ยำ/สลัด" },
    { value: "เครื่องดื่ม", label: "เครื่องดื่ม" },
    ];

    const categoryOptions = category_name === "none"
    ? CategoryNameOptions
    : CategoryNameOptions.filter(opt => opt.value !== "none");

    const UnitOptions = [
    { value: "none", label: "กรุณาระบุประเภทหน่วยบอกจำนวนเมนู" },
    { value: "จาน", label: "จาน" },
    { value: "ชิ้น", label: "ชิ้น" },
    { value: "ชุด", label: "ชุด" },
    { value: "ถ้วย", label: "ถ้วย" },
    { value: "แก้ว", label: "แก้ว" },
    { value: "ขวด", label: "ขวด" },
    ];

    const unitmenuOptions = unit === "none"
    ? UnitOptions
    : UnitOptions.filter(opt => opt.value !== "none");

    const StatusOptions = [
    { value: "available", label: "available" },
    { value: "inactive", label: "inactive" },
    ];

    //"name", "price", "unit", "status", "description"

    const isnameupdateToggle = () => {setIsNameupdate(prev => !prev); setName(data.name ?? "")};

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorName("");
        setErrorUnit("");


        let hasError = false;

        // Validate the input fields
        if (name === "") {
            setErrorName("Name is required");
            hasError = true;
        }
        
        if (price <= 0) {
            setErrorPrice("Price must be greater than 0");
            hasError = true;
        }

        if (unit === "") {
            setErrorUnit("Unit is required");
            hasError = true;
        }

        if(category_name === ""){
            setCategory_name("Category is required");
            hasError = true;
        }

        if (description === "") {
            setErrorDescription("Description is required");
            hasError = true;
        }

        if (isNameupdate && menu_name.includes(name)) {
            setErrorName("Menu name is Already Existed");
            hasError = true;
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/menu/${data.id}/update`, { 
                    name,
                    price,
                    unit,
                    status,
                    description,
                    category_name
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

            setAlertMessage(responseData.message ?? "Update Menu Infomation Successful");
            console.log("Update Menu Infomation Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        } catch (error) {
            console.error("Error Update Menu Infomation:", error);

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();

        console.log(data.id);
        
        try {

            const res = await axios.delete(`${API_URL}/menu/${data.id}/delete`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} // ใช้ `data` สำหรับส่ง body ในคำขอ DELETE
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

            setAlertMessage(responseData.message ?? "Deleted Menu Successful");
            console.log("Deleted Menu Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
            console.error("Error Deleted Menu :", error);

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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Menu {data.id}</label>
                        </div>

                        <label className="text-lg font-semibold">
                            <button type="button" className={`relative inline-flex h-6 w-11 me-3 items-center rounded-xl text-white transition ${isNameupdate ? 'bg-green-500' : 'bg-red-500'}`}
                            onClick={isnameupdateToggle}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                                                ${isNameupdate ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                            Name 
                        { errorName && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorName}</label>}
                        </label>
                        <input type="text" value={name} disabled={!isNameupdate} onChange={(e) => setName(e.target.value)} 
                        className={`border border-gray-300 rounded-md p-2 ${isNameupdate ? 'bg-white' : 'bg-gray-300'}`} />

                        <label className="text-lg font-semibold">price
                        { errorPrice && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorPrice}</label>}
                        </label>
                        <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Unit
                        { errorUnit && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorUnit}</label>}
                        </label>
                        <Select
                            options={unitmenuOptions}
                            value={UnitOptions.find(opt => opt.value === unit)}
                            onChange={option => setUnit(option ? option.value : "none")}
                            className="w-full"
                            placeholder="เลือกหน่วยคิดจำนวนเมนู"
                        />

                        <label className="text-lg font-semibold">Category Name
                        { errorCategory_name && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorCategory_name}</label>}
                        </label>
                        <Select
                            options={categoryOptions}
                            value={CategoryNameOptions.find(opt => opt.value === category_name)}
                            onChange={option => setCategory_name(option ? option.value : "none")}
                            className="w-full"
                            placeholder="เลือกหน่วยคิดจำนวนเมนู"
                        />

                        <label className="text-lg font-semibold">Status</label>
                        <Select
                            options={StatusOptions}
                            value={StatusOptions.find(opt => opt.value === status)}
                            onChange={option => setStatus(option ? option.value : "none")}
                            className="w-full"
                            placeholder="เลือกสถานะของเมนู"
                        />

                        <label className="text-lg font-semibold">Description
                        { errorDescription && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorDescription}</label>}
                        </label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function AddIngrMenuUsed({ trigger, setTrigger, data,  setAlert, setAlertMessage, fetchData, ingr}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; setAlert: (value: boolean) => void; 
        setAlertMessage: (value: String) => void; fetchData: () => void; ingr: any;}) {

    const [selectedIngrId, setSelectedIngrId] = useState<number>(0);
    const [qty, setQty] = useState<number>(0);

    const [errorIngr, setErrorIngr] = useState("");
    const [errorQty, setErrorQty] = useState("");

    const usedIngrIds = data.ingr_used.ingredient_id || [];

    const ingrOptions = ingr.map((item: any) => ({
        value: item.id,
        label: item.name + (usedIngrIds.includes(item.id) ? " (already used)" : ""),
        isDisabled: usedIngrIds.includes(item.id)
    }));

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");


        let hasError = false;

        // Validate the input fields
        if( qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }
        if (selectedIngrId === 0) {
            setErrorIngr("Please select an ingredient");
            hasError = true;
        }
        if (usedIngrIds.includes(selectedIngrId)) {
            setErrorIngr("Ingredient already used in this menu");
            hasError = true;
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/menu/ingrbase/${data.id}/addingr_used`, 
                    {
                        ingr_id: selectedIngrId,
                        qty: qty
                    }
                , {
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

            setAlertMessage(responseData.message ?? "Update Ingredient In Menu Successful");

            setAlert(true);
            setTrigger(false);
            fetchData();

        } catch (error) {
            console.error("Error Update Menu Infomation:", error);

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
            setTrigger(false);
        }


    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Add Ingredient Used Menu : {data.name}</label>
                        </div>

                        <label className="text-lg font-semibold">Ingredient
                            {errorIngr && <label className="ml-5 text-sm font-medium text-red-900">* {errorIngr}</label>}
                        </label>
                        <Select
                            options={ingrOptions}
                            value={ingrOptions.find(opt => opt.value === selectedIngrId) || null}
                            onChange={option => setSelectedIngrId(option ? option.value : 0)}
                            placeholder="Please select an ingredient"
                            menuPlacement="auto"
                            menuShouldScrollIntoView={false}
                            maxMenuHeight={220}
                            styles={{
                                menu: provided => ({ ...provided, maxHeight: 220 }),
                            }}
                        />
                        
                        <label className="text-lg font-semibold">Quantity
                            {errorQty && <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input
                            type="number"
                            value={qty}
                            min={1}
                            onChange={e => setQty(parseInt(e.target.value, 10) || 1)}
                            className="border border-gray-300 rounded-md p-2"
                        /> 
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function UpdateIngrMenu({ trigger, setTrigger, data, menu_id, menu_name, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; menu_id: any; menu_name; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    
    const [qty, setQty] = useState<number>(data.qty ?? 0);

    
    const [errorQty, setErrorQty] = useState("");

    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");


        let hasError = false;

        // Validate the input fields
        if( qty <= 0) {
            setErrorQty("Quantity must be greater than 0");
            hasError = true;
        }
        


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/menu/ingrbase/${menu_id}/menu_ingr/${data.menuingr_id}`,  ///menu/ingrbase/{id}/menu_ingr/{menuingr_id}
                    qty
                , {
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

            setAlertMessage(responseData.message ?? "Update Ingredient In Menu Successful");

            setAlert(true);
            setTrigger(false);
            fetchData();

        } catch (error) {
            console.error("Error Update Menu Infomation:", error);

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
            setTrigger(false);
        }


    }

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.delete(`${API_URL}/menu/ingrbase/${menu_id}/removeingr_used/${data.menuingr_id}`, { 
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} // ใช้ `data` สำหรับส่ง body ในคำขอ DELETE
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

            setAlertMessage(responseData.message ?? "Deleted Menu Successful");
            console.log("Deleted Menu Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
            console.error("Error Deleted Menu :", error);

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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Menu {menu_name}</label>
                        </div>

                        <label className="text-lg font-semibold">
                            Menu Ingredient : {data.menuingr_id}
                        </label>

                        <label className="text-lg font-semibold">Ingredient : {data.ingredient_id}
                        </label>
                        <input type="text" value={data.ingredient_name} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Quantity
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />  
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            Delete
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function CreateIngredient({ trigger, setTrigger, setAlert, setAlertMessage, fetchData, email, data}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void; email: string, data: any}) {


    const [name, setName] = useState("");
    const [type, setType] = useState("none");
    const [unit, setUnit] = useState("none");


    const [errorName, setErrorName] = useState("");
    const [errorType, setErrorType] = useState("");
    const [errorUnit, setErrorUnit] = useState("");

    const UnitOptions = [
    { value: "none", label: "กรุณาระบุประเภทหน่วยบอกปริมาณวัตถุดิบ" },
    { value: "กรัม", label: "กรัม" },
    { value: "มิลลิลิตร", label: "มิลลิลิตร" },
    { value: "ชิ้น", label: "ชิ้น" },
    { value: "ฟอง", label: "ฟอง" },
    { value: "ลูก", label: "ลูก" },
    { value: "ใบ", label: "ใบ" },
    ];

    const unitmenuOptions = unit === "none"
    ? UnitOptions
    : UnitOptions.filter(opt => opt.value !== "none");

    const TypeOptions = [
    { value: "none", label: "กรุณาระบุประเภทประเภทวัตถุดิบ" },
    { value: "เนื้อสัตว์", label: "เนื้อสัตว์" },
    { value: "อาหารทะเล", label: "อาหารทะเล" },
    { value: "ผัก/สมุนไพร", label: "ผัก/สมุนไพร" },
    { value: "ผลไม้", label: "ผลไม้" },
    { value: "เครื่องเทศ", label: "เครื่องเทศ" },
    { value: "เครื่องปรุงรส", label: "เครื่องปรุงรส" },
    { value: "ของแห้ง", label: "ของแห้ง" },
    { value: "วัตถุดิบแปรรูป", label: "วัตถุดิบแปรรูป" },
    { value: "วัตถุดิบปรุงสุก", label: "วัตถุดิบปรุงสุก" },
    { value: "ไข่และผลิตภัณฑ์ไข่", label: "ไข่และผลิตภัณฑ์ไข่" },
    ];

    const TypemenuOptions = unit === "none"
    ? TypeOptions
    : TypeOptions.filter(opt => opt.value !== "none");

    const names =  data.map(item => item.name).filter((name): name is string => typeof name === 'string');

    const loginHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorName("");
        setErrorType("");
        setErrorUnit("");

        let hasError = false;
        
        // Validate the input fields
        if (name === "") {
            setErrorName("Name is required");
            hasError = true;
        }else if(names.includes(name)){
            setErrorName("Name is Already Existed");
            hasError = true;
        }
        if (type === "") {
            setErrorType("Type is required");
            hasError = true;
        }
        if (unit === "") {
            setErrorUnit("Unit is required");
            hasError = true;
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            const res = await axios.post(`${API_URL}/ingr/addIngr`, {
                    name,
                    type,
                    unit,
                    email,
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
    
                setAlertMessage(responseData.message ?? "Account created successfully");
                console.log("Account created successfully:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

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
            setTrigger(false);
        }

        
    }
    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">

                        <label className="text-lg font-semibold">Ingredient Name 
                            { errorName && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorName}</label>}
                        </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Type
                            { errorType && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorType}</label>}
                        </label>
                        <Select
                            options={TypemenuOptions}
                            value={TypeOptions.find(opt => opt.value === type)}
                            onChange={option => setType(option ? option.value : "none")}
                            className="w-full"
                            placeholder="กรุณาระบุประเภทประเภทวัตถุดิบ"
                        />
                        

                        <label className="text-lg font-semibold">Unit
                            { errorUnit && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorUnit}</label>}
                        </label>
                        <Select
                            options={unitmenuOptions}
                            value={UnitOptions.find(opt => opt.value === unit)}
                            onChange={option => setUnit(option ? option.value : "none")}
                            className="w-full"
                            placeholder="เลือกหน่วยคิดจำนวนเมนู"
                        />

                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => {setTrigger(false); fetchData();}}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                                onClick={loginHandle}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function CreateMenu({setAlert, setAlertMessage, fetchData, email, menus_name, ingr_data, isAdded}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; 
        fetchData: () => void; email: string, menus_name: any; ingr_data: any; isAdded: (value: boolean) => void;}) {

    
    const [name, setName] = useState("");
    const [category_name, setCategory_name] = useState("none");
    const [price, setPrice] = useState<number>(0);
    const [unit, setUnit] = useState("none");
    const [description, setDescription] = useState("");
    const [menuType, setMenuType] = useState("readymademenu");
    const [ingrUsedNumber, setIngrUsedNumber] = useState<number>(1);
    const [ingrUsed, setIngrUsed] = useState<{ ingr_id: number; qty: number }[]>([{ ingr_id: 0, qty: 0 }]);

    const CategoryNameOptions = [
    { value: "none", label: "กรุณาระบุประเภทของเมนู" },
    { value: "อาหารจานเดี่ยว", label: "อาหารจานเดี่ยว" },
    { value: "ของว่าง", label: "ของว่าง" },
    { value: "ของหวาน", label: "ของหวาน" },
    { value: "กับข้าว", label: "กับข้าว" },
    { value: "ยำ/สลัด", label: "ยำ/สลัด" },
    { value: "เครื่องดื่ม", label: "เครื่องดื่ม" },
    ];

    const categoryOptions = category_name === "none"
    ? CategoryNameOptions
    : CategoryNameOptions.filter(opt => opt.value !== "none");

    const NumberIngrUsedOptions = [
    { value: 1, label: "1 วัตถุดิบ" },
    { value: 2, label: "2 วัตถุดิบ" },
    { value: 3, label: "3 วัตถุดิบ" },
    { value: 4, label: "4 วัตถุดิบ" },
    { value: 5, label: "5 วัตถุดิบ" },
    ];

    const UnitOptions = [
    { value: "none", label: "กรุณาระบุประเภทหน่วยบอกจำนวนเมนู" },
    { value: "จาน", label: "จาน" },
    { value: "ชิ้น", label: "ชิ้น" },
    { value: "ชุด", label: "ชุด" },
    { value: "ถ้วย", label: "ถ้วย" },
    { value: "แก้ว", label: "แก้ว" },
    { value: "ขวด", label: "ขวด" },
    ];

    const unitmenuOptions = unit === "none"
    ? UnitOptions
    : UnitOptions.filter(opt => opt.value !== "none");



    const [imgFile, setImgFile] = useState(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [errorName, setErrorName] = useState("");
    const [errorCategory_name, setErrorCategory_name] = useState("");
    const [errorPrice, setErrorPrice] = useState("");
    const [errorUnit, setErrorUnit] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorMenuType, setErrorMenuType] = useState("");
    const [errorImgFile, setErrorImgFile] = useState("");

    const ingrOptions = ingr_data.map((ingr: any) => ({
        value: ingr.id,
        label: ingr.name + (ingr.unit ? ` (${ingr.unit})` : "")
    }));

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setImgFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Files Must be an image");
      }
  };

    const handlesubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorName("");
        setErrorCategory_name("");
        setErrorPrice("");
        setErrorUnit("");
        setErrorDescription("");
        setErrorMenuType("");
        setErrorImgFile("");

        let hasError = false;
        
        // Validate the input fields
        if (name === "") {
            setErrorName("จำเป็นต้องระบุชื่อเมนู");
            hasError = true;
        }else if(menus_name.includes(name)){
            setErrorName("ชื่อเมนูนี้มีอยู่แล้ว");
            hasError = true;
        }
        if (price <= 0) {
            setErrorPrice("ราคาต้องมากกว่า 0");
            hasError = true;
        }
        if (unit === "") {
            setErrorUnit("จำเป็นต้องระบุชื่อเมนู");
            hasError = true;
        }
        if (category_name === "" || category_name === "none") {
            setErrorCategory_name("จำเป็นต้องระบุชื่อหมวดหมู่");
            hasError = true;
        }
        if (imgFile === null) {
            setErrorImgFile("จำเป็นต้องใส่รูปภาพ");
            hasError = true;
        }

        if (menuType === "ingredientbasemenu") {
        for (let i = 0; i < ingrUsed.length; i++) {
            if (ingrUsed[i].qty <= 0) {
                setErrorMenuType("จำนวนวัตถุดิบต้องมากกว่า 0 ");
                hasError = true;
                break;
            }

            if (ingrUsed.some(ingr => ingr.ingr_id === 0)) {
                setErrorMenuType("กรุณาเลือกวัตถุดิบให้ครบทุกช่อง");
                hasError = true;
            }

            const ingrIds = ingrUsed.map(ingr => ingr.ingr_id);
            const hasDuplicate = ingrIds.some((id, idx) => ingrIds.indexOf(id) !== idx && id !== 0);
            if (hasDuplicate) {
                setErrorMenuType("ห้ามเลือกวัตถุดิบซ้ำกัน");
                hasError = true;
            }
        }

    }


        if (hasError) {
            return; 
        }

        try {
            const formData = new FormData();
            const dataObj: any = {
                name,
                price,
                unit,
                description,
                menu_type: menuType,
                email,
                category_name, // ปรับตามระบบคุณ
            };

            if (menuType === "ingredientbasemenu") {
                dataObj.ingr_used = ingrUsed;
            }
            formData.append("data", new Blob([JSON.stringify(dataObj)], { type: "application/json" }));
            if (imgFile) {
                formData.append("image", imgFile);
            }

            const res = await axios.post(`${API_URL}/menu/createmenu`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
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
    
                setAlertMessage(responseData.message ?? "Account created successfully");
                console.log("Account created successfully:", responseData);

            setAlert(true);
            isAdded(true);

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
        <form onSubmit={handlesubmit}>
            <div className="flex flex-col gap-4">

                <label className="text-lg font-semibold">Menu Name 
                    { errorName && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorName}</label>}
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                <label className="text-lg font-semibold">Update Image 
                    { errorImgFile && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorImgFile}</label>}</label>
                { imagePreview ? 
                    <img src={imagePreview} alt="Upload" className="h-48 w-72 object-contain"/>
                    : <img src="https://via.placeholder.com/150" alt="No Image Chosen" className="h-48 w-72 object-cover bg-gray-100 rounded-lg border-2 border-stone-500" />
                }

                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm py-1 px-2 rounded-md bg-gray-200 border-2 border-stone-500 
                    cursor-pointer h-8 w-50" />

                <label className="text-lg font-semibold">Category Name
                    { errorCategory_name && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorCategory_name}</label>}
                </label>
                <Select
                    options={categoryOptions}
                    value={CategoryNameOptions.find(opt => opt.value === category_name)}
                    onChange={option => setCategory_name(option ? option.value : "none")}
                    className="w-full"
                    placeholder="เลือกประเภทเมนู"
                />


                <label className="text-lg font-semibold">Price
                    { errorPrice && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorPrice}</label>}
                </label>
                <input type="text" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                <label className="text-lg font-semibold">Unit
                    { errorUnit && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorUnit}</label>}
                </label>
                <Select
                    options={unitmenuOptions}
                    value={UnitOptions.find(opt => opt.value === unit)}
                    onChange={option => setUnit(option ? option.value : "none")}
                    className="w-full"
                    placeholder="เลือกหน่วยคิดจำนวนเมนู"
                />

                <label className="text-lg font-semibold">Description
                    { errorDescription && 
                    <label className="ml-5 text-sm font-medium text-red-900">* {errorDescription}</label>}
                </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-md p-2" />

                <label className="text-lg font-semibold">Menu Type</label>
                <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800 w-50"
                    value={menuType} onChange={(e) => setMenuType(e.target.value)}>
                    <option value="readymademenu">เมนูสำเร็จรูป</option>
                    <option value="ingredientbasemenu">เมนูที่ใช้วัตถุดิบ</option>
                </select>

                {
                    menuType === "ingredientbasemenu" && (
                        <div className="flex flex-col gap-2">

                            <label className="text-lg font-semibold">Ingredient Used 
                                { errorMenuType && 
                                    <label className="ml-5 text-sm font-medium text-red-900">* {errorMenuType}</label>}
                            </label>
                            <Select
                                options={NumberIngrUsedOptions}
                                value={NumberIngrUsedOptions.find(opt => opt.value === ingrUsedNumber)}
                                onChange={option => {
                                    const val = option ? option.value : 1;
                                    setIngrUsedNumber(val);
                                    setIngrUsed(prev => {
                                    const arr = [...prev];
                                    while (arr.length < val) arr.push({ ingr_id: 0, qty: 0 });
                                    return arr.slice(0, val);
                                    });
                                }}
                                className="w-full"
                                placeholder="เลือกจำนวนวัตถุดิบ (สูงสุด 5)"
                                />

                            {
                                Array.from({ length: ingrUsedNumber }).map((_, index) => {
                                    const ingr = ingr_data.find((ingr: any) => ingr.id === ingrUsed[index].ingr_id);
                                    const unit = ingr ? ingr.unit : "";
                                    return (
                                    <div key={index} className="flex flex-col gap-4">
                                        <label className="text-lg font-semibold">Ingredient Used : {index+1}</label>
                                        <div className="flex flex-row gap-x-4 items-center">
                                            <Select
                                                options={ingrOptions}
                                                value={ingrOptions.find(opt => opt.value === ingrUsed[index].ingr_id) || null}
                                                onChange={option => {
                                                    const newIngrUsed = [...ingrUsed];
                                                    newIngrUsed[index].ingr_id = option ? option.value : 0;
                                                    setIngrUsed(newIngrUsed);
                                                }}
                                                placeholder="กรุณาเลือกวัตถุดิบ"
                                                menuPlacement="auto"
                                                menuShouldScrollIntoView={false}
                                                maxMenuHeight={220}
                                                styles={{
                                                    menu: provided => ({ ...provided, maxHeight: 220 }),
                                                }}
                                            />
                                            <label className="text-lg font-semibold pl-10">Quantity Used</label>
                                            <input type="number" value={ingrUsed[index].qty}
                                                disabled={!ingrUsed[index].ingr_id}
                                                onChange={(e) => {
                                                    const newIngrUsed = [...ingrUsed];
                                                    newIngrUsed[index].qty = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                    setIngrUsed(newIngrUsed);
                                                }}
                                                className="border border-gray-300 rounded-md p-2 w-24 disabled:bg-gray-200"
                                            />
                                            <label className="text-lg font-semibold pl-2">{unit}</label>
                                        </div>
                                        
                                    </div>
                                )})
                            }

                        </div>
                    )
                }

            </div>
            <div className="flex flex-row-reverse gap-4">
                <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                        onClick={handlesubmit}>
                    Create
                </button>
            </div>
        </form>
    );
}

export function CHOrderItem({ trigger, setTrigger, data, order_id, setAlert, setAlertMessage, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; order_id: any; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void}) {

    const [orderitem_id, setOrderItem_id] = useState(data.orderitem_id ?? "");
    const [name, setName] = useState(data.name ?? "");
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [unit, setUnit] = useState(data.unit ?? "");
    const [priceperitem, setPriceperitem] = useState<number>(data.priceperitem ?? 0);
    const [total_price, setTotal_price] = useState<number>(data.total_price ?? 0);
    const [comment, setComment] = useState(data.comment ?? "");

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        
        try {

            const res = await axios.post(`${API_URL}/order/${order_id}/orderitem/${orderitem_id}/cancelorder`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {} 
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

            setAlertMessage(responseData.message ?? "Cancel Order Item Successful");


            setAlert(true);
            setTrigger(false);
            fetchData();

        }catch (error) {
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
            setTrigger(false);
        }
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <label className="text-lg font-bold">OrderItem {orderitem_id}</label>
                            <label className="text-lg font-bold pr-5">Order {order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={name} disabled={true} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวน</label>
                        <input type="text" value={qty} disabled={true} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">หน่วย</label>
                        <input type="text" value={unit} disabled={true} onChange={(e) => setUnit(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{unit}</label>
                        <input type="text" value={priceperitem} disabled={true} onChange={(e) => setPriceperitem(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคารวม</label>
                        <input type="text" value={total_price} disabled={true} onChange={(e) => setTotal_price(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">คำอธิบายายเพิ่มเติม</label>
                        <input type="text" value={comment} disabled={true} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                            onClick={deleteHandle}>
                            ยกเลิกออเดอร์นี้
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function OrderCustomerDetail({ trigger, setTrigger, order}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; order: any}) {

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Order {order.order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">Customer ID</label>
                        <input type="text" value={order.customer_id} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Role</label>
                        <input type="text" value={order.customer_role} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">First name</label>
                        <input type="text" value={order.customer_fname} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Last Name</label>
                        <input type="text" value={order.customer_lname} disabled={true} className="border border-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function UpdateOrderStatus({ trigger, setTrigger, setAlert, setAlertMessage, fetchData, order}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void; order: any}) {

    const [status, setStatus] = useState(order.status ?? "received");
    
    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();


        let hasError = false;

        // Validate the input fields


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/order/${order.order_id}/updatestatus`, { 
                    status
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

            setAlertMessage(responseData.message ?? "Update Menu Infomation Successful");
            console.log("Update Menu Infomation Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        } catch (error) {
            console.error("Error Update Menu Infomation:", error);

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
            setTrigger(false);
        }

    }


    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Order {order.order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">Customer ID</label>
                        <input type="text" value={order.customer_id} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">Role</label>
                        <input type="text" value={order.customer_role} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <label className="text-lg font-semibold">First name</label>
                                <input type="text" value={order.customer_fname} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-lg font-semibold">Last Name</label>
                                <input type="text" value={order.customer_lname} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />
                            </div>
                        </div>

                        <label className="text-lg font-semibold">Cashier Email</label>
                        <input type="text" value={order.cashier_email} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">Status</label>
                        <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800"
                            value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="received">Received</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Complete</option>
                        </select>



                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function ReservationCustomerDetail({ trigger, setTrigger, data}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any}) {

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Reservation {data.id}</label>
                        </div>

                        <label className="text-lg font-semibold">Customer ID</label>
                        <input type="text" value={data.customer?.id} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Role</label>
                        <input type="text" value={data.customer?.role} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">First name</label>
                        <input type="text" value={data.customer?.fname} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Last Name</label>
                        <input type="text" value={data.customer?.fname} disabled={true} className="border border-gray-300 rounded-md p-2" />
    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function UpdateReservationStatus({ trigger, setTrigger, setAlert, setAlertMessage, fetchData, data}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void; data: any}) {

    const [status, setStatus] = useState(data.status ?? "received");
    
    const updateHandle = async (e: React.FormEvent) => {

        e.preventDefault();


        let hasError = false;

        // Validate the input fields


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {
            console.log("status", status);
            const res = await axios.post(`${API_URL}/reservation/${data.id}/updatestatus`, { 
                    status
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

            setAlertMessage(responseData.message ?? "Update Menu Infomation Successful");
            console.log("Update Menu Infomation Successful:", responseData);

            setAlert(true);
            setTrigger(false);
            fetchData();

        } catch (error) {
            console.error("Error Update Menu Infomation:", error);

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
            setTrigger(false);
        }

    }


    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Reservation {data.id}</label>
                        </div>

                        <label className="text-lg font-semibold">Customer ID</label>
                        <input type="text" value={data.customer?.id} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">Role</label>
                        <input type="text" value={data.customer?.role} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <label className="text-lg font-semibold">First name</label>
                                <input type="text" value={data.customer?.fname} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-lg font-semibold">Last Name</label>
                                <input type="text" value={data.customer?.lname} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />
                            </div>
                        </div>

                        <label className="text-lg font-semibold">People Count</label>
                        <input type="text" value={data.people_count} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">CheckIn Date</label>
                        <input type="text" value={data.checkin_date} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">Created At</label>
                        <input type="text" value={data.created_date} disabled={true} className="border border-gray-500 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">Status</label>
                        <select className="px-4 py-1 rounded-xl bg-gray-100 border-2 border-stone-800"
                            value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="checked_in">Checked In</option>
                            <option value="cancelled">Cancelled</option>
                        </select>



                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                         onClick={updateHandle}>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function BillCustomerDetail({ trigger, setTrigger, data}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any}) {

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Bill {data.id}</label>
                        </div>

                        <label className="text-lg font-semibold">Customer ID</label>
                        <input type="text" value={data.order?.reservation?.customer?.id} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Role</label>
                        <input type="text" value={data.order?.reservation?.customer?.role} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">First name</label>
                        <input type="text" value={data.order?.reservation?.customer?.fname} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">Last Name</label>
                        <input type="text" value={data.order?.reservation?.customer?.lname} disabled={true} className="border border-gray-300 rounded-md p-2" />

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}

export function CustomerOrderItem({ trigger, setTrigger, data, order_id, idx, menu, orderitems, setAlert, setAlertMessage, fetchData, setOrderItems}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; idx: any; order_id: any; menu: any; orderitems: any;
        setAlert: (value: boolean) => void; setAlertMessage: (value: String) => void; fetchData: () => void; setOrderItems: (value: any) => void;}) {

    const [name, setName] = useState(menu.name ?? "");
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [unit, setUnit] = useState(menu.unit ?? "");
    const [priceperitem, setPriceperitem] = useState<number>(menu.price ?? 0);
    const [total_price, setTotal_price] = useState<number>(menu.totalprice ?? 0);
    
    const [errorQty, setErrorQty] = useState("");

    const [comment, setComment] = useState(data.comment ?? "");

    const deleteHandle = async (e: React.FormEvent) => {

        e.preventDefault();

        let hasError = false;

        if (qty < 0) {
            setErrorQty("กรุณากรอกจำนวนที่ต้องการสั่งให้มากกว่า 0");
            hasError = true;
        }else if(qty > menu.available_stock_qty){
            setErrorQty("จำนวนสินค้าไม่เพียงพอ");
            hasError = true;
        }

        if(hasError){
            return;
        }

        let newItems = [...orderitems];
        if (qty === 0) {
            newItems.splice(idx, 1);
        } else {
            const pricePerItem = menu.price ?? 0;
            const newTotalPrice = pricePerItem * qty;
            newItems[idx] = { 
                ...newItems[idx], 
                qty, 
                price: newTotalPrice, 
                comment,
                total_price: newTotalPrice 
            };
        }
        setOrderItems(newItems);
        sessionStorage.setItem('orderitems', JSON.stringify(newItems));
        setTrigger(false);
        
        
    }

    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <label className="text-lg font-bold pr-5">Order {order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={name} disabled={true} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่เหลือ</label>
                        <input type="text" value={menu.available_stock_qty} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่สั่ง
                                { errorQty && 
                        <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">หน่วย</label>
                        <input type="text" value={unit} disabled={true} onChange={(e) => setUnit(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{unit}</label>
                        <input type="text" value={priceperitem} disabled={true} onChange={(e) => setPriceperitem(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">คำอธิบายายเพิ่มเติม</label>
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2" />

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                            onClick={deleteHandle}>
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}



export function ShowCustomerOrderItem({ trigger, setTrigger, data, order_id}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; order_id: any}) {

    const [orderitem_id, setOrderItem_id] = useState(data.orderitem_id ?? "");
    const [name, setName] = useState(data.name ?? "");
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [unit, setUnit] = useState(data.unit ?? "");
    const [priceperitem, setPriceperitem] = useState<number>(data.priceperitem ?? 0);
    const [total_price, setTotal_price] = useState<number>(data.total_price ?? 0);
    const [comment, setComment] = useState(data.comment ?? "");


    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <label className="text-lg font-bold pr-5">Order {order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={name} disabled={true} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวน</label>
                        <input type="text" value={qty} disabled={true} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">หน่วย</label>
                        <input type="text" value={unit} disabled={true} onChange={(e) => setUnit(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{unit}</label>
                        <input type="text" value={priceperitem} disabled={true} onChange={(e) => setPriceperitem(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคารวม</label>
                        <input type="text" value={total_price} disabled={true} onChange={(e) => setTotal_price(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">คำอธิบายายเพิ่มเติม</label>
                        <input type="text" value={comment} disabled={true} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}

export function ShowCashierOrderItem({ trigger, setTrigger, data, order_id, bill_id}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; data: any; order_id: any; bill_id: any}) {

    const [orderitem_id, setOrderItem_id] = useState(data.orderitem_id ?? "");
    const [name, setName] = useState(data.menuItem?.name ?? "");
    const [qty, setQty] = useState<number>(data.qty ?? 0);
    const [unit, setUnit] = useState(data.menuItem?.unit ?? "");
    const [priceperitem, setPriceperitem] = useState<number>(data.menuItem?.price ?? 0);
    const [total_price, setTotal_price] = useState<number>(data.total_price ?? 0);
    const [comment, setComment] = useState(data.comment ?? "");


    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <label className="text-lg font-bold pr-5">Bill : {bill_id}</label>
                            <label className="text-lg font-bold pr-5">Order : {order_id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={name} disabled={true} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวน</label>
                        <input type="text" value={qty} disabled={true} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">หน่วย</label>
                        <input type="text" value={unit} disabled={true} onChange={(e) => setUnit(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{unit}</label>
                        <input type="text" value={priceperitem} disabled={true} onChange={(e) => setPriceperitem(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคารวม</label>
                        <input type="text" value={total_price} disabled={true} onChange={(e) => setTotal_price(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">คำอธิบายายเพิ่มเติม</label>
                        <input type="text" value={comment} disabled={true} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";

}