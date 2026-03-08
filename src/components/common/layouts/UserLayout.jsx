import React from 'react';
import Footer from '../Footer'
import Navbar from '../../userComponents/common/Navbar'
import { Outlet } from 'react-router-dom'

const userLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className=" flex-1 bg-white">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default userLayout;