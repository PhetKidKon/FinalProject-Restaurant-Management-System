import React from "react";
import 'tailwindcss';

export const AccountBar = ({ email, name }) => {
    return (
        <div className="border-b pb-2 ">
            <div className="flex flex-col p-0.5 gap-1 w-full">
                <label className="text-base font-bold block">{name}</label>
                <label className="text-sm text-gray-600 block">{email}</label>
            </div>
        </div>
    );
};