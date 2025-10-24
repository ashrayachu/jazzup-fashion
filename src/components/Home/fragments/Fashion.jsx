import React from 'react'
import { MapPinned } from 'lucide-react';


function Fashion() {
  return (
    <section className="bg-Black grid grid-cols-1  md:grid-cols-2 md:p-14">
          <form className="bg-transparent p-10 space-y-10">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-white"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-white"
          />
        </div>
        <div>
          <input
            type="phone"
            placeholder="Your Mobile Number"
            className="w-full px-4 py-2 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-white"
          />
        </div>
        <div>
          <textarea
            placeholder="Your Message"
            className="w-full px-4 py-2 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-white"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="relative px-8 py-3 bg-white text-black font-semibold rounded-full transition-transform hover:scale-105 focus:outline-none"
          >
            <span className="absolute inset-0 bg-yellow-400 rounded-full "></span>
            <span className="relative">SHARE YOUR MESSAGE</span>
          </button>
        </div>
      </form>
        <div className='flex flex-col gap-10 justify-center items-center'>
          <h1 className='text-2xl text-center font-bold text-gray-300'>Visit Our Store<br/>Click On The Location Pin For Directions</h1>
        <MapPinned className='text-yellow-400 hover:scale-105' size={200} onClick={()=>window.open('https://maps.app.goo.gl/f4zhvjbR7S3SiGMR8')}/>
        </div>
         
      </section>
  )
}

export default Fashion