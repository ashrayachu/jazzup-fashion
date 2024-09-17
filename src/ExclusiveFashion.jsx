import React from 'react'
import products from './data/Exclusive.js';


function ExclusiveFashion() {
  return (
    <>
    <section className="container mx-auto px-4 py-12">
    <h2 className="text-2xl font-bold mb-8">Exclusive Fashion Outfit Of The Day</h2>
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {products.map((product, index) => (
          <div key={index} className="flex-none w-64">
            <img src={product.Image} alt={`Outfit`} className="w-full h-64 object-cover rounded-lg mb-2" />
            <p className="font-bold">{product.name}</p>
            <p className="text-yellow-400">${product.price}</p>
          </div>  
        ))}
      </div>
    
    </div>
  </section>
  <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Try to find out the best outfit to make your<br />
          look more attractive. Continues to create a<br />
          new fashion trend to the finest product
        </h2>
        <button className="bg-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-500">
          Shop Now
        </button>
      </section>
      </>
  )
}

export default ExclusiveFashion
