import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search } from 'lucide-react';

// Simple Image Component with Fallback
const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = React.useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc('/placeholder.jpg')}
        />
    );
};

// Mock Data
const allProducts = [
    {
        id: 1,
        name: 'Royal Oud Intense',
        price: 129,
        category: 'Fragrances',
        image: 'https://images.unsplash.com/photo-1767187861728-942f561b7103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBwZXJmdW1lJTIwYm90dGxlJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY5NTMzMTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tag: 'Best Seller'
    },
    {
        id: 2,
        name: 'Midnight Leather Belt',
        price: 89,
        category: 'Belts',
        image: 'https://images.unsplash.com/photo-1668954443591-ea2072a6b4b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBsZWF0aGVyJTIwYmVsdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2OTUzMzIwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Velvet Loafers',
        price: 249,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1761522001173-407848107951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBsdXh1cnklMjBzaG9lcyUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2OTUzMzIwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 4,
        name: 'Urban Sliders',
        price: 59,
        category: 'Sliders',
        image: 'https://images.unsplash.com/photo-1648320397369-85ab3fa368bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBzbGlkZXJzJTIwZmxpcGZsb3BzJTIwZGFyayUyMGJhY2tncm91bmQlMjBmYXNoaW9ufGVufDF8fHx8MTc2OTUzMzIwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 5,
        name: 'Noir Essence',
        price: 149,
        category: 'Fragrances',
        image: 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&q=80&w=1080',
        tag: 'Limited'
    },
    {
        id: 6,
        name: 'Cognac Leather Belt',
        price: 95,
        category: 'Belts',
        image: 'https://images.unsplash.com/photo-1624223032398-38c2089d8916?auto=format&fit=crop&q=80&w=1080',
    },
    {
        id: 7,
        name: 'Oxford Classic',
        price: 299,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80&w=1080',
    },
    {
        id: 8,
        name: 'Comfort Plush Slippers',
        price: 45,
        category: 'Slippers',
        image: 'https://images.unsplash.com/photo-1690048340324-78ff39457bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjb21mb3J0YWJsZSUyMHNsaXBwZXJzJTIwbHV4dXJ5fGVufDF8fHx8MTc2OTUzMzIwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 9,
        name: 'Beach Flipflops',
        price: 35,
        category: 'Flipflops',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1080',
    },
];

const categories = ['All', 'Fragrances', 'Belts', 'Shoes', 'Sliders', 'Flipflops', 'Slippers'];

const ShopSection = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-brand-black min-h-screen pt-20">

            {/* Page Header */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1764860753654-ee65d97be642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN0b3JlfGVufDF8fHx8MTc2OTUzMzU2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Shop Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
                            Men's <span className="text-brand-gold">Essentials</span>
                        </h1>
                        <p className="text-white/70 max-w-xl mx-auto px-4">
                            Explore our curated collection of premium accessories and footwear.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">

                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-brand-gold text-brand-black font-medium'
                                        : 'bg-brand-brown text-white hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-brand-brown rounded-full text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                            />
                            <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        {/* Simple Sort Dropdown (Visual only for now) */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-brown text-white rounded-full hover:bg-white/10">
                            <span className="hidden sm:inline">Sort</span>
                            <Filter className="w-4 h-4" />
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={product.id}
                            className="group relative bg-brand-brown rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand-gold/10 transition-all duration-300"
                        >
                            <div className="relative h-72 overflow-hidden">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {product.tag && (
                                    <div className="absolute top-3 left-3 bg-brand-gold text-brand-black text-xs font-bold px-3 py-1 rounded-full">
                                        {product.tag}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full group-hover:translate-y-0 bg-white text-black px-6 py-2 rounded-full font-medium text-sm transition-transform duration-300 hover:bg-brand-gold">
                                    Add to Cart
                                </button>
                            </div>

                            <div className="p-5">
                                <p className="text-brand-gold text-xs mb-1 uppercase tracking-wide">{product.category}</p>
                                <h3 className="text-white text-lg font-medium mb-2 truncate">{product.name}</h3>
                                <p className="text-white/80">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/50 text-lg">No products found matching your criteria.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ShopSection;
