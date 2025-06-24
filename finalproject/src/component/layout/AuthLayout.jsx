import React from "react";
import 'tailwindcss';

const AuthPage = ( {children} ) => {
    return (
        <section className="bg-blue-100">
            <div className="flex flex-col items-center justify-center mx-auto px-10 py-10 h-screen">
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    
                    <div className="p-6 sm:p-8 m-5">
                        {children}
                    </div>
                </div>
            </div>
        </section>
        
    );
};

export default AuthPage;