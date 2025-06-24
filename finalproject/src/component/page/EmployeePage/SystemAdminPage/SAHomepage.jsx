import React, { useState } from "react";
import 'tailwindcss';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import SASidebar from "../../../sidebar/SASidebar";
import { AccountTable } from "../../../content/DataTable";

const SAHomepage = () => {

    const email = sessionStorage.getItem('email');
    const fname = sessionStorage.getItem('fname');

    return (

        <div className="bg-blue-100 grid gap-3 grid-cols-[250px_1fr] ">
            <SASidebar email={email !== null ? email : "null"} name={fname !== null ? fname : "null"} selectedPage={0}></SASidebar>
            <div className="bg-white rounded-lg pb-4 p-4 shadow h-[100vh]">
            </div>

        </div>
    );
}

export default SAHomepage;