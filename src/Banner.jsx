import React from 'react'
import logo from './assets/logo_transparent.png'
import logo1 from './assets/logo1-removebg.png'


function Banner() {
  return (
    <section className="container mx-auto px-4 py-12 text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-4">
      <span className="text-yellow-400">✨ KEEP UP YOUR FASHION</span><br />
      TRENDS STUFF WITH JAZZUP
    </h1>
    <p className="mb-8 max-w-2xl mx-auto">Get Ready To Elevate Fashion Life</p>
    <button className="mb-8 bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300">
      Get Started
    </button>
    <div className="flex justify-around items-center ">
      <img className="hidden md:flex w-64 h-64 rotate-45" src={logo1} alt="" />
       <img className="w-96" src={logo} alt="" srcset="" />
       <img className="hidden md:flex w-64 h-64 -rotate-45" src={logo1} alt="" />
    </div>
  </section>
  )
} 

export default Banner