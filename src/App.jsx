
import './App.css'
import { ChevronLeft, ChevronRight, ShoppingCart, User } from 'lucide-react'
import Header from './Header'
import Banner from './Banner'
import Band from './Band'
import Tending from './TendingCollections'
import Exclusive from './ExclusiveFashion'
import Fashion from './Fashion'
import Footer from './Footer'

function App() {
  return (
    <div className="bg-Brown text-white min-h-screen">
    <Header/>
    <main>
    <Banner/>
    <Band/>
    <Tending/>
    <Exclusive/>
    <Fashion/>
    </main>
    <Footer/> 
    </div>
  )
}

export default App
