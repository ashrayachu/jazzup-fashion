import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, ShoppingBag, ArrowRight } from 'lucide-react';

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

const highlights = [
    'Premium Fragrances - Signature scents crafted for distinction',
    'Luxury Belts - Handcrafted Italian leather accessories',
    'Designer Footwear - Comfort meets sophisticated style',
    'Exclusive Designs - Limited edition collections',
];

const ExclusiveCollections = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-gradient-to-b from-brand-brown to-brand-black relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold rounded-l-full opacity-5 blur-[150px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 px-4 py-1.5 rounded-full mb-8">
                            <Star className="w-4 h-4 text-brand-gold" />
                            <span className="text-brand-gold text-sm tracking-wider uppercase">Premium Men's Collection</span>
                        </div>

                        <h2 className="text-5xl sm:text-6xl md:text-7xl mb-8 leading-tight">
                            <span className="text-white">Refine Your </span>
                            <span className="text-brand-gold">Style</span>
                        </h2>

                        <p className="text-white/70 text-lg mb-10 max-w-xl">
                            Discover our exclusive range of men's essentials. From signature scents to premium leather accessories and comfort footwear.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {highlights.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-3 text-white/90"
                                >
                                    <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-brand-gold" />
                                    </div>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.button
                            onClick={() => navigate('/shop')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-brand-gold text-brand-black rounded-full text-lg font-medium hover:bg-white transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Shop Now
                        </motion.button>
                    </motion.div>

                    {/* Visual Showcase */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Main Image */}
                        <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-gold/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60"></div>
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1759090889314-193a95f14428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDM3Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Men's Fashion Accessories"
                                className="w-full h-[600px] object-cover"
                            />

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white text-xl font-medium">New Arrivals</h3>
                                        <p className="text-white/60 text-sm">Check out our latest collection</p>
                                    </div>
                                    <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors group">
                                        <ArrowRight className="w-6 h-6 text-brand-black group-hover:text-brand-black" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Background Decorations */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-transparent border-2 border-brand-gold/20 rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-transparent border border-brand-gold/10 rounded-full"></div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ExclusiveCollections;
