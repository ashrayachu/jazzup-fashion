import { ChevronLeft, ChevronRight, ShoppingCart, User } from 'lucide-react'
import logo from './assets/cropped logo.png'



function Header() {
  return (
    <header className="container mx-auto px-4 py-4 flex justify-between">
    <div className="text-2xl flex flex-col max-w-20 justify-center items-center mx-10 font-bold"> 
      <img className='w-10 md:w-28'src={logo} alt="" />
      <span className='hidden md:flex'>JAZZUP</span>  
    </div>  
    <nav className="hidden md:flex justify-center  items-center space-x-4">
      <a href="#" className="hover:text-yellow-400">Shop</a>
      <a href="#" className="hover:text-yellow-400">Sale</a>
      <a href="#" className="hover:text-yellow-400">Categories</a>
    </nav>
    <div className=" flex items-center space-x-4 mx-10">
      {/* <Search className="w-6 h-6" /> */}  
      <ShoppingCart className="w-6 h-6" />
      <User className="w-6 h-6" />
    </div>
  </header> 
  )
}

export default Header