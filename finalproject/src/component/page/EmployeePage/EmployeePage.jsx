import React, { useState } from "react";
import AuthPage from "../../layout/AuthLayout";

const EmployeeSelectionPage = () => {

    return (
        <AuthPage>
            <div className="grid grid-cols-3 gap-15">
                <div className="container mx-auto my-auto bg-cyan-800 border-2 border-black px-20 py-15">
                    <div className="text-sm font-bold font-white justify-center items-center">Test1</div>
                </div>
                <div className="container mx-auto my-auto bg-cyan-800 border-2 border-black px-20 py-15">
                    <div className="text-sm font-bold font-white justify-center items-center">Test2</div>
                </div>
                <div className="container mx-auto my-auto bg-cyan-800 border-2 border-black px-20 py-15">
                    <div className="text-sm font-bold font-white justify-center items-center">Test3</div>
                </div>
            </div>


            <form onSubmit={loginhandle} className="space-y-6 w-full">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-x-5">
                        <label className="block mb-3 text-sm font-medium">Email</label>
                        { errorEmail && 
                            <label className="ml-5 text-sm font-medium text-red-900">{errorEmail}</label>
                        }
                    </div>
                    <input 
                        type="text" placeholder="example@email.com" 
                        className="flex-1 bg-gray-200 border border-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block p-2" 
                        value={email} onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col">
                <div className="flex flex-row mb-3 gap-x-5">
                        <label className="block text-sm font-medium">Password</label> 
                        {errorPassword && <label className="ml-5 text-sm font-medium text-red-900">{errorPassword}</label>}
                    </div>
                    <input 
                        type="password" placeholder="****" 
                        className="flex-1 bg-gray-200 border border-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block p-2" 
                        value={password} onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="w-full text-black bg-blue-600 font-medium rounded-2xl px-5 py-2.5 hover:bg-blue-700">Login</button>
            </form>
            

        </AuthPage>
    )

}

export default EmployeeSelectionPage;