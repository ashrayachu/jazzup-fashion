import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoImage from '../../../assets/logo_transparent.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#010001]/95 backdrop-blur-sm border-b border-white/10'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logoImage}
                            alt="JazzUp"
                            className="h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)]"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/shop" className="text-white hover:text-[#FFD700] transition-colors">Shop</a>
                        <a href="#" className="text-white hover:text-[#FFD700] transition-colors">New Arrivals</a>
                        <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Collections</a>
                        <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Sale</a>
                        <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Categories</a>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-[#FFD700] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-[#FFD700] transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-[#FFD700] transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-[#FFD700] text-[#010001] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">0</span>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <nav className="flex flex-col gap-4">
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Shop</a>
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">New Arrivals</a>
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Collections</a>
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Sale</a>
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">Categories</a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;