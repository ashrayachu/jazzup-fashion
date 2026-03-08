import { ChevronLeft, ChevronRight, ShoppingCart, User } from 'lucide-react'
import logo from "../../assets/cropped logo.png"
import { FaBars } from 'react-icons/fa';



function Header({ isSidebarOpen, setIsSidebarOpen, mobileOpen }) {

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="container mx-auto bg-Brown text-white px-4 py-4 flex justify-between">
      <div className="text-2xl flex flex-row max-w-20 justify-center items-center mx-10 font-bold">

        {mobileOpen && (
          <button
            onClick={handleMenuToggle}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors mr-3"
            aria-label="Toggle menu"
          >
            <FaBars size={20} className="text-white" />
          </button>
        )}
        <div className='flex flex-col justify-center items-center'>
          <img className='w-10 md:w-28' src={logo} alt="" />
          <span className='hidden md:flex'>JAZZUP</span>
        </div>

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