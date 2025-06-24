import React, { use, useState } from "react";
import validator from 'validator';
import axios from "axios";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';

export function CHMenuItem({data, usedTo, order_Id, fetchData, setOrderItems}: 
    {  data: any; usedTo: any; order_Id?: number; fetchData?: () => void; setOrderItems?: (value: any) => void;}) {

    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [alert, setAlert] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");

    return (
        <>
        <button className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200
                                hover:cursor-pointer"
                onClick={() => {
                    if (usedTo === 'CHCheckDetail'){
                        setShowPopup(true);
                    }
                    if (usedTo === 'CHAddMenu' || usedTo === 'CustomerAddMenu') { 
                        if (data.available_stock_qty !== 0) {
                            setShowPopup(true);
                        }
                    }
                  }}>

            <div className="relative w-full h-48">
                <img 
                    className="w-full h-full object-cover" 
                    src={`http://localhost:3001/api/menu/${data.id}/imgFile`} 
                    alt={data.name}
                />

                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                    ฿{data.price}
                </div>
            </div>


            <div className="p-5 space-y-3">

                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {data.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                    {data.description}
                </p>

                <div className="pt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {data.category_name}
                    </span>
                    { data.available_stock_qty === 0 ? 
                        <span className="text-sm font-medium text-red-600">
                            สินค้าหมด
                        </span> :
                        <span className="text-sm font-medium text-green-600">
                            สินค้าเหลือ {data.available_stock_qty} ชิ้น
                        </span>
                    }
                    <span className="text-sm font-medium text-emerald-600">
                        {data.unit}
                    </span>
                </div>
            </div>
        </button>

        {
            showPopup && usedTo === 'CHCheckDetail' ? 
            createPortal(
                <CHMenuDetail trigger={showPopup} setTrigger={setShowPopup} menu={data}></CHMenuDetail>, document.body
            ) : showPopup && usedTo === 'CHAddMenu' ? createPortal(
                <CHMenuAdd trigger={showPopup} setTrigger={setShowPopup} menu={data} order_Id={order_Id} setAlert={setAlert} setAlertMessage={setAlertMessage}></CHMenuAdd>, document.body
            ) : showPopup && usedTo === 'CustomerAddMenu' && createPortal(
                <CustomerMenuAdd trigger={showPopup} setTrigger={setShowPopup} menu={data} order_Id={order_Id} setAlert={setAlert} setAlertMessage={setAlertMessage} setOrderItems={setOrderItems}></CustomerMenuAdd>, document.body
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
                                    if (usedTo === 'CHAddMenu') {
                                        navigate('/cashier/order/');
                                    }
                                }}>
                        Close
                        </button>
                    </div>          
                </div>
            </div>, document.body
         )}

        </>
    );

}

export function CHMenuDetail({ trigger, setTrigger, menu}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; menu: any;}) {

    const [data, setData] = useState<any>();
    const [ingrUsed, setIngrUsed] = useState<any[]>([]);

    useEffect(() => {
        if (trigger && menu.type === 'IngredientBaseMenu') {
            fetchIngrbase();
            console.log("data ", data);
        }
    }, [trigger, menu]);

    const fetchIngrbase = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/menu/ingrbase/"+menu.id, );
    
            setData(response.data);
            setIngrUsed(response.data.ingr_used || []);

        } catch (error) {
            console.error("Error fetching data:", error);

        } 
    };



    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Menu {menu.id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={menu.name} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">ราคาต่อ{menu.unit}</label>
                        <input type="text" value={menu.price} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">สถานะ</label>
                        <input type="text" value={menu.status} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">คำอธิบาย</label>
                        <input type="text" value={menu.description} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">ประเภท</label>
                        <input type="text" value={menu.category_name} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">จำนวนที่สั่งได้</label>
                        <input type="text" value={menu.available_stock_qty} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">อีเมลผู้สร้างรายการสินค้า</label>
                        <input type="text" value={menu.account_email} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        {menu.type === 'IngredientBaseMenu' && (
                        <div className="mt-4">
                                    <label className="text-lg font-semibold">วัตถุดิบที่ใช้</label>
                                    <div className="mt-2 space-y-2">
                                        {ingrUsed.map((ingr) => (
                                            <div key={ingr.id} 
                                                className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{ingr.ingredient_name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        ใช้ {ingr.qty} ต่อ 1 เมนู
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-medium ${
                                                        ingr.available_stock_qty === 0 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                    }`}>
                                                        {ingr.available_stock_qty === 0 
                                                            ? 'วัตถุดิบหมด'
                                                            : `ใช้ทำได้ ${Math.floor(ingr.available_stock_qty / ingr.qty)} เมนู`
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        (เหลือ {ingr.available_stock_qty})
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
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

export function CHMenuAdd({ trigger, setTrigger, menu, order_Id, setAlert, setAlertMessage}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; menu: any; order_Id: any; setAlert: (value: boolean) => void; 
        setAlertMessage: (message: string) => void;}) {

    const [qty, setQty] = useState<number>(0);
    const [comment, setComment] = useState("");

    const [errorQty, setErrorQty] = useState("");

    const submitHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");

        let hasError = false;
        
        if (qty <= 0) {
            setErrorQty("กรุณากรอกจำนวนที่ต้องการสั่งให้มากกว่า 0");
            hasError = true;
        }else if(qty > menu.available_stock_qty){
            setErrorQty("จำนวนสินค้าไม่เพียงพอ");
            hasError = true;
        }


        if (hasError) {
            return; 
        }
        
        console.log("orderId", order_Id);
        console.log("menu", menu.id);
        console.log("qty", qty);
        console.log("comment", comment);

        try {
            const res = await axios.post(`http://localhost:3001/api/order/${order_Id}/createorderitem`, {
                    menu_id: menu.id,
                    qty,
                    comment,
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
                            <label className="text-lg font-bold text-center">Menu ID : {menu.id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={menu.name} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{menu.unit}</label>
                        <input type="text" value={menu.price} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่สั่งได้</label>
                        <input type="text" value={menu.available_stock_qty} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่สั่ง
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 " />

                        <label className="text-lg font-semibold">คำอธิบายเพิ่มเติม
                        </label>
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2" />
    
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


export function CustomerMenuAdd({ trigger, setTrigger, menu, order_Id, setAlert, setAlertMessage, setOrderItems}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; menu: any; order_Id: any; setAlert: (value: boolean) => void; 
        setAlertMessage: (message: string) => void; setOrderItems?: (value: any) => void;}) {

    const [qty, setQty] = useState<number>(0);
    const [comment, setComment] = useState("");

    const [errorQty, setErrorQty] = useState("");

    const submitHandle = async (e: React.FormEvent) => {

        e.preventDefault();
        setErrorQty("");

        let hasError = false;
        
        if (qty <= 0) {
            setErrorQty("กรุณากรอกจำนวนที่ต้องการสั่งให้มากกว่า 0");
            hasError = true;
        }else if(qty > menu.available_stock_qty){
            setErrorQty("จำนวนสินค้าไม่เพียงพอ");
            hasError = true;
        }

        if(hasError){
            return;
        }

        let orderitems = JSON.parse(sessionStorage.getItem("orderitems") || "[]");

        
        const newOrderItem = {
            menu_id: menu.id,
            menu_name: menu.name,
            qty: qty,
            price: menu.price*qty,
            comment: comment
        };

        
        orderitems.push(newOrderItem);

        
        sessionStorage.setItem("orderitems", JSON.stringify(orderitems));
        if (setOrderItems) setOrderItems(orderitems);

        
        setAlertMessage("เพิ่มรายการสำเร็จ");
        setAlert(true);
        setTrigger(false);


        if (hasError) {
            return; 
        }
        
        
    }


    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-5 rounded-lg shadow-md w-1/3">
                <form action="" onSubmit={submitHandle}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Menu ID : {menu.id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={menu.name} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">ราคาต่อ{menu.unit}</label>
                        <input type="text" value={menu.price} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่สั่งได้</label>
                        <input type="text" value={menu.available_stock_qty} disabled={true} className="border border-gray-300 rounded-md p-2 bg-gray-300" />

                        <label className="text-lg font-semibold">จำนวนที่สั่ง
                        { errorQty && 
                            <label className="ml-5 text-sm font-medium text-red-900">* {errorQty}</label>}
                        </label>
                        <input type="text" value={qty} onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)} className="border border-gray-300 rounded-md p-2 " />

                        <label className="text-lg font-semibold">คำอธิบายเพิ่มเติม
                        </label>
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="border border-gray-300 rounded-md p-2" />
    
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

export function ISMenuItem({data, usedTo, order_Id, fetchData, setOrderItems, menu_name}: 
    {  data: any; usedTo: any; order_Id?: number; fetchData?: () => void; setOrderItems?: (value: any) => void; menu_name: any}) {

    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [alert, setAlert] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");

    return (
        <>
        <button className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200
                                hover:cursor-pointer"
                onClick={() => {
                    if (usedTo === 'CHCheckDetail'){
                        setShowPopup(true);
                    }
                    if (usedTo === 'CHAddMenu' || usedTo === 'CustomerAddMenu') { 
                        if (data.available_stock_qty !== 0) {
                            setShowPopup(true);
                        }
                    }
                  }}>

            <div className="relative w-full h-48">
                <img 
                    className="w-full h-full object-cover" 
                    src={`http://localhost:3001/api/menu/${data.id}/imgFile`} 
                    alt={data.name}
                />

                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                    ฿{data.price}
                </div>
            </div>


            <div className="p-5 space-y-3">

                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {data.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                    {data.description}
                </p>

                <div className="pt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {data.category_name}
                    </span>
                    { data.available_stock_qty === 0 ? 
                        <span className="text-sm font-medium text-red-600">
                            สินค้าหมด
                        </span> :
                        <span className="text-sm font-medium text-green-600">
                            สินค้าเหลือ {data.available_stock_qty} ชิ้น
                        </span>
                    }
                    <span className="text-sm font-medium text-emerald-600">
                        {data.unit}
                    </span>
                </div>
            </div>
        </button>

        {
            showPopup && 
            createPortal(
                <ISMenuDetail trigger={showPopup} setTrigger={setShowPopup} menu={data} menu_name={menu_name} fetchData={fetchData}></ISMenuDetail>, document.body
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
                                    if (usedTo === 'CHAddMenu') {
                                        navigate('/cashier/order/');
                                    }
                                }}>
                        Close
                        </button>
                    </div>          
                </div>
            </div>, document.body
         )}

        </>
    );

}

export function ISMenuDetail({ trigger, setTrigger, menu, menu_name, fetchData}: 
    { trigger: boolean; setTrigger: (value: boolean) => void; menu: any; menu_name: any; fetchData?: () => void;}) {

    const [data, setData] = useState<any>();
    const [ingrUsed, setIngrUsed] = useState<any[]>([]);

    useEffect(() => {
        if (trigger && menu.type === 'IngredientBaseMenu') {
            fetchIngrbase();
            console.log("data ", data);
        }
    }, [trigger, menu]);

    const fetchIngrbase = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/menu/ingrbase/"+menu.id, );
    
            setData(response.data);
            setIngrUsed(response.data.ingr_used || []);

        } catch (error) {
            console.error("Error fetching data:", error);

        } 
    };



    return (trigger) ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
                <form action="">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-center pb-3">
                            <label className="text-lg font-bold text-center">Menu {menu.id}</label>
                        </div>

                        <label className="text-lg font-semibold">ชื่อเมนู</label>
                        <input type="text" value={menu.name} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">ราคาต่อ{menu.unit}</label>
                        <input type="text" value={menu.price} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">สถานะ</label>
                        <input type="text" value={menu.status} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">คำอธิบาย</label>
                        <input type="text" value={menu.description} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">ประเภท</label>
                        <input type="text" value={menu.category_name} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">จำนวนที่สั่งได้</label>
                        <input type="text" value={menu.available_stock_qty} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">วันที่สร้างรายการสินค้า</label>
                        <input type="text" value={menu.created_date} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        <label className="text-lg font-semibold">อีเมลผู้สร้างรายการสินค้า</label>
                        <input type="text" value={menu.account_email} disabled={true} className="border border-gray-300 rounded-md p-2" />

                        {menu.type === 'IngredientBaseMenu' && (
                        <div className="mt-4">
                                    <label className="text-lg font-semibold">วัตถุดิบที่ใช้</label>
                                    <div className="mt-2 space-y-2">
                                        {ingrUsed.map((ingr) => (
                                            <div key={ingr.id} 
                                                className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{ingr.ingredient_name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        ใช้ {ingr.qty} ต่อ 1 เมนู
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-medium ${
                                                        ingr.available_stock_qty === 0 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                    }`}>
                                                        {ingr.available_stock_qty === 0 
                                                            ? 'วัตถุดิบหมด'
                                                            : `ใช้ทำได้ ${Math.floor(ingr.available_stock_qty / ingr.qty)} เมนู`
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        (เหลือ {ingr.available_stock_qty})
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
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