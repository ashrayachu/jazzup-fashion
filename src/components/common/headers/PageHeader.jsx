import React from 'react';
import { AiOutlinePlus, AiOutlineDownload } from 'react-icons/ai';

const PageHeader = ({ title, desc, addBtn, clrBtn, handleAddButton }) => {
    return (
        <section className='pageHeader mb-8 border-b border-gray-200 p-5'>
            <div className='flex flex-col md:flex-row md:justify-between gap-4'>
                {/* Header Text */}
                <div>
                    <h1 className='text-xl sm:text-2xl lg:text-3xl text-black font-semibold mb-1'>{title}</h1>
                    <p className='text-xs sm:text-sm text-lightGray'>{desc}</p>
                </div>

                {/* Action Buttons */}
                {addBtn && (
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
                        {/* Export Button (hide when addBtn === "publish") */}
                        {addBtn !== "Publish" && (
                            <button className='flex items-center justify-center gap-2 bg-white border border-gray-300 text-darkGray py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors'>
                                <AiOutlineDownload className='text-lg' />
                                <span className='text-sm sm:text-base'>Export to excel</span>
                            </button>
                        )}

                        {/* Add / Publish Button */}
                        <button
                            className='flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-all'
                            onClick={handleAddButton}
                        >
                            {/* Show plus icon only if not publishing */}
                            {addBtn !== "Publish" && <AiOutlinePlus className='text-lg' />}
                            <span className='text-sm sm:text-base'>{addBtn}</span>
                        </button>
                    </div>
                )}

                {clrBtn && (
                    <div>
                        <button className='flex items-center justify-center gap-2 bg-white border border-gray-300 text-darkGray py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors'>
                            <span className='text-sm sm:text-base'>{clrBtn}</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PageHeader;