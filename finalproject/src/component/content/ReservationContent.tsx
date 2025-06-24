import React, { use, useState } from "react";
import validator from 'validator';
import axios from "axios";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function CustomerReserveAdd({ trigger, setTrigger, customer_email, customerData, setAlert, setAlertMessage }: 
    { trigger: boolean; setTrigger: (value: boolean) => void; customer_email: any; customerData: any; setAlert: (value: boolean) => void; setAlertMessage: (message: string) => void }) {

    const [people_count, setPeople_count] = useState<number>(0);
    const [fname, setFname] = useState(customerData.fname ?? "");
    const [lname, setLname] = useState(customerData.lname ?? "");
    const [phone, setPhone] = useState(customerData.phone ?? "");
    const [checkedin_day, setCheckin_day] = useState<number>(0);
    const [checkedin_month, setCheckin_month] = useState<number>(0);
    const [checkedin_year, setCheckin_year] = useState<number>(0);
    const [checkedin_hour, setCheckin_hour] = useState<number>(0);
    const [checkedin_minute, setCheckin_minute] = useState<number>(0);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const hourOptions = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, "0"),
    }));
    const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, "0"),
    }));


    const [comment, setComment] = useState("");

    const [errorQty, setErrorQty] = useState("");
    const [errorFname, setErrorFname] = useState("");
    const [errorLname, setErrorLname] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorDate, setErrorDate] = useState("");

    function hasCustomerData(customerData: any): boolean {
        return !!(
            customerData &&
            typeof customerData === "object" &&
            customerData.fname &&
            customerData.lname &&
            customerData.phone
        );
    }

    const submitHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");
        setErrorFname("");
        setErrorLname("");
        setErrorPhone("");
        setErrorDate("");

        let hasError = false;
        
        // Validate the input fields
        if (people_count <= 0) {
            setErrorQty("กรุณากรอกจำนวนคนมากกว่า 0");
            hasError = true;
        }

        if (!selectedDate) {
            setErrorDate("กรุณาเลือกวันและเวลา");
            hasError = true;
        }

        const checkin_day = selectedDate?.getDate() ?? 0;
        const checkin_month = (selectedDate?.getMonth() ?? 0) + 1;
        const checkin_year = (selectedDate?.getFullYear() ?? 0) + 543;
        const checkin_hour = selectedDate?.getHours() ?? 0;
        const checkin_minute = selectedDate?.getMinutes() ?? 0;

        if(hasCustomerData(customerData)){
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
        }


        if (hasError) {
            return; // Stop the function if there are validation errors
        }

        try {


            if(hasCustomerData(customerData)){
                    const res = await axios.post(`http://localhost:3001/api/reservation/create`, {
                        customer_email,
                        people_count,
                        checkin_day,
                        checkin_month,
                        checkin_year,
                        checkin_hour,
                        checkin_minute
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                        }
                });

                let responseMessage = "";
                if (typeof res.data === "string") {
                    responseMessage = res.data; // ไม่ต้อง parse
                } else if (res.data && typeof res.data.message === "string") {
                    responseMessage = res.data.message;
                } else {
                    responseMessage = "เพิ่มรายการสำเร็จ";
                }
        
                setAlertMessage(responseMessage);
                setAlert(true);
                setTrigger(false);

            }else {
                const res = await axios.post(`http://localhost:3001/api/reservation/create`, {
                    fname,
                    lname,
                    phone,
                    people_count,
                    checkin_day,
                    checkin_month,
                    checkin_year,
                    checkin_hour,
                    checkin_minute
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                let responseMessage = "";
                if (typeof res.data === "string") {
                    responseMessage = res.data; // ไม่ต้อง parse
                } else if (res.data && typeof res.data.message === "string") {
                    responseMessage = res.data.message;
                } else {
                    responseMessage = "เพิ่มรายการสำเร็จ";
                }
        
                setAlertMessage(responseMessage);
                setAlert(true);
                setTrigger(false);

            }
    
            

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="" onSubmit={submitHandle}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">การจองคิว</label>
                        </div>

                        <label className="text-lg font-semibold">จำนวนคน</label>
                        <input type="text" value={people_count} onChange={(e) => setPeople_count(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">ชื่อจริง
                        { errorFname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorFname}</label>}
                        </label>
                        <input type="text" value={fname} disabled={hasCustomerData(customerData)} onChange={(e) => setFname(e.target.value)} 
                            className="border border-gray-300 rounded-md p-2 disabled:bg-gray-300" />

                        <label className="text-lg font-semibold">นามสกุล
                        { errorLname && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorLname}</label>}
                        </label>
                        <input type="text" value={lname} disabled={hasCustomerData(customerData)} onChange={(e) => setLname(e.target.value)} 
                            className="border border-gray-300 rounded-md p-2 disabled:bg-gray-300" />

                        <label className="text-lg font-semibold">เบอร์โทรศัพท์
                        { errorPhone && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorPhone}</label>}
                        </label>
                        <input type="text" value={phone} disabled={hasCustomerData(customerData)} onChange={(e) => setPhone(e.target.value)} 
                            className="border border-gray-300 rounded-md p-2 disabled:bg-gray-300" />

                       <div className="mb-6">
                        <label className="block text-lg font-semibold mb-1">วันที่และเวลา
                            { errorDate && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorDate}</label>}
                        </label>
                        <ReactDatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholderText="เลือกวันและเวลา"
                            minDate={new Date()}
                            locale="th"
                        />
                    </div>

    
                    </div>
                    <div className="flex flex-row-reverse gap-4">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
                                onClick={() => setTrigger(false)}>
                            Cancel
                        </button>
                        <button className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400"
                                type="submit" >
                            Confirm
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
        
    ) : "";
}