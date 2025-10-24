import React from 'react';
import Footer from '../Footer'
import Header from '../Header'
import { Outlet } from 'react-router-dom'

const userLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="p-4 flex-1 bg-white">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default userLayout;