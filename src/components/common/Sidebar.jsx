import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChevronLeft,
    FaChevronRight,
    FaTachometerAlt,
    FaCalendarAlt,
    FaBox,
    FaExchangeAlt,
    FaUsers,
    FaFileAlt,
    FaInfoCircle,
    FaEnvelope,
    FaCog
} from 'react-icons/fa';
import { Tooltip } from 'antd';

function Sidebar({ mobileOpen, isSidebarOpen, setIsSidebarOpen }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [cmsExpanded, setCmsExpanded] = useState(true);
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/admin/dashboard' },
        { id: 'schemes', label: 'Schemes', icon: FaCalendarAlt, path: '/scheme-list' },
        { id: 'products', label: 'Products', icon: FaBox, path: '/admin/product-list' },
        { id: 'transactions', label: 'Transactions', icon: FaExchangeAlt, path: '/transaction-list' },
        { id: 'investors', label: 'Investors', icon: FaUsers, path: '/investor-list' },
        {
            id: 'cms',
            label: 'CMS',
            icon: FaFileAlt,
            children: [
                { id: 'about', label: 'About', icon: FaInfoCircle, path: '/about' },
                { id: 'contact', label: 'Contact Us', icon: FaEnvelope, path: '/contact' }
            ]
        }
    ];

    const bottomMenuItem = {
        id: 'settings',
        label: 'Settings',
        icon: FaCog,
        path: '/settings'
    };

    const handleMenuClick = (itemId) => {
        if (itemId === 'cms') {
            setCmsExpanded(!cmsExpanded);
        }
    };

    const handleLinkClick = () => {
        if (mobileOpen) {
            setIsSidebarOpen(false);
        }
    };

    const MenuItem = ({ item, isBottom = false }) => {
        const isActive = currentPath === item.path || (item.children && item.children.some(child => child.path === currentPath));
        const IconComponent = item.icon;

        const content = (
            <Link
                to={item.path || '#'}
                className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'
                    } px-3 py-3 rounded-lg cursor-pointer transition-colors ${isActive
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                onClick={() => {
                    handleMenuClick(item.id);
                    if (item.path) handleLinkClick();
                }}
            >
                <IconComponent
                    className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                />
                {!isCollapsed && (
                    <span
                        className={`ml-3 text-sm ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}
                    >
                        {item.label}
                    </span>
                )}
            </Link>
        );

        if (isCollapsed) {
            return (
                <Tooltip
                    title={item.label}
                    placement="right"
                    color="#1890FF"
                >
                    {content}
                </Tooltip>
            );
        }

        return content;
    };

    const sidebarClasses = mobileOpen
        ? `fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-20' : 'w-64'}`
        : `${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`;

    return (
        <div className={`${sidebarClasses} bg-white border-r border-gray-200 flex flex-col`}>
            {/* Header */}
            <div className={`px-6 ${isCollapsed ? "py-[29px]" : "py-6"} border-b border-gray-200 flex items-center justify-between`}>
                {!isCollapsed && (
                    <h1 className="text-xl font-bold text-black">S.N.K. Jewellers</h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
                >
                    {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <MenuItem item={item} />

                            {item.children && (
                                <>
                                    {!isCollapsed && cmsExpanded && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon;
                                                const isChildActive = currentPath === child.path;

                                                return (
                                                    <Link
                                                        key={child.id}
                                                        to={child.path}
                                                        className={`relative flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${isChildActive
                                                            ? 'bg-blue-50'
                                                            : 'hover:bg-gray-50'
                                                            }`}
                                                        onClick={handleLinkClick}
                                                    >
                                                        <ChildIcon
                                                            className={`w-5 h-5 ${isChildActive ? 'text-blue-600' : 'text-gray-600'}`}
                                                        />
                                                        <span
                                                            className={`ml-3 text-sm ${isChildActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
                                                        >
                                                            {child.label}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {isCollapsed && (
                                        <div className="space-y-1 mt-1">
                                            {item.children.map((child) => {
                                                const ChildIcon = child.icon;
                                                const isChildActive = currentPath === child.path;

                                                return (
                                                    <Tooltip
                                                        key={child.id}
                                                        title={child.label}
                                                        placement="right"
                                                        color="#1890FF"
                                                    >
                                                        <Link
                                                            to={child.path}
                                                            className={`relative flex items-center justify-center px-3 py-3 rounded-lg cursor-pointer transition-colors ${isChildActive
                                                                ? 'bg-blue-50'
                                                                : 'hover:bg-gray-50'
                                                                }`}
                                                            onClick={handleLinkClick}
                                                        >
                                                            <ChildIcon
                                                                className={`w-5 h-5 ${isChildActive ? 'text-blue-600' : 'text-gray-600'}`}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Settings at Bottom */}
            <div className="border-t border-gray-200 p-3">
                <MenuItem item={bottomMenuItem} isBottom />
            </div>
        </div>
    );
}

export default Sidebar;