import React from 'react'

function Footer() {
  return (
    <footer className="bg-Black py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className='flex flex-col justify-center items-center'>
        <h3 className="text-xl font-bold mb-4">JAZZUP</h3>
        <p className="text-sm text-center text-gray-400">WV58+QQW, Mary Hill, Konchady, Mangaluru, Karnataka 575008</p>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h4 className="font-bold mb-4">Products</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>New Arrivals</li>
          <li>Best Seller</li>
          <li>On Sale</li>
        </ul>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h4 className="font-bold mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>About Us</li>
          <li>Contact</li>
          <li>Affiliates</li>
        </ul>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h4 className="font-bold mb-4">Social Media</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>Facebook</li>
          <li>Twitter</li>
          <li>Instagram</li>
        </ul>
      </div>
    </div>
  </footer>
  )
}

export default Footer