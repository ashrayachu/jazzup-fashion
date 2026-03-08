import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
// import Navbar from "../navbar/Navbar";
import Header from "../Header";

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setMobileOpen(true);
                setIsSidebarOpen(false); // Close sidebar on resize to mobile
            } else {
                setMobileOpen(false);
                setIsSidebarOpen(false);
            }
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close sidebar when clicking outside (mobile only)
    const handleBackdropClick = () => {
        if (mobileOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Backdrop for mobile */}
            {mobileOpen && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={handleBackdropClick}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
    
            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Navbar */}
                <div className="">
                    <Header
                        mobileOpen={mobileOpen}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}