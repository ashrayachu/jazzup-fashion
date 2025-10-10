
import './App.css'

import Header from './components/common/Header'
import Banner from './components/Home/Banner'
import Band from './components/Home/Band'
import Tending from './components/Home/TendingCollections'
import Exclusive from './ExclusiveFashion'
import Fashion from './components/Home/Fashion'
import Footer from './components/common/Footer'

function App() {
  return (
    <div className="bg-Brown text-white min-h-screen">
      <Header />
      <main>
        <Banner />
        <Band />
        <Tending />
        <Exclusive />
        <Fashion />
      </main>
      <Footer />
    </div>
  )
}

export default App
