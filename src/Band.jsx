import React from 'react'

function Band() {
  return (
    <section className="bg-yellow-400 text-black font-semibold py-4 overflow-x-auto whitespace-nowrap">
    <div className="container text-sm mx-auto px-4 flex justify-around">
      <span className='hidden md:flex'>NEW ARRIVALS</span>
      <span>FLASH SALE</span>
      <span className='hidden md:flex'>FASHION TRENDS</span>
      <span>NEW ARRIVALS</span>
    </div>
  </section>
  )
}

export default Band