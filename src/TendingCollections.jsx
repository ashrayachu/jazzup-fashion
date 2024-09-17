import React from 'react'


import lacoste from './assets/lacoste.jpg'
import shirts from './assets/tommy shirt.jpg'
import jeans from './assets/jeans.png'
import shoes from './assets/shoes.jpg'





function TendingCollections() {
  return (
    <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Collection</h2>
          <button className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-full">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-8">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img src={jeans} className="w-full h-full object-cover opacity-50" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-bold mb-2">Casual Jeans</h3>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full">
                Shop Now
              </button>
            </div>
          </div>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img src={shirts} alt="Shirts" className="w-full h-full object-cover opacity-50" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-bold mb-2">Shirts</h3>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full">
                Shop Now
              </button>
            </div>
          </div>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img src={lacoste} className="w-full h-full object-cover opacity-50" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-bold mb-2">T-Shirts</h3>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full">
                Shop Now
              </button>
            </div>
          </div>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img src={shoes} alt="Shirts" className="w-full h-full object-cover opacity-50" />
            <div className="absolute bottom-4 left-4 ">
              <h3 className="text-xl font-bold mb-2">Shoes</h3>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full">
                Shop Now
              </button>
            </div>
          </div>
          
        </div>
        
      </section>
  )
}

export default TendingCollections