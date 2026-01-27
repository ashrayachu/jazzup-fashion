import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import logoImage from '../../../assets/logo_transparent.png';

// Image component with fallback
const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Fallback to a placeholder or default image
            setImgSrc('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1080');
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#010001] pt-20">
            {/* Split Layout with Images */}
            <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
                {/* Left Image */}
                <div className="relative h-full">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzY5MzUxNTA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Fashion Model 1"
                        className="w-full h-full object-cover opacity-40 lg:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#010001] via-[#010001]/50 to-transparent"></div>
                </div>

                {/* Right Image */}
                <div className="relative h-full hidden lg:block">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1759090889314-193a95f14428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDM3Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Fashion Model 2"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-[#010001] via-[#010001]/50 to-transparent"></div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFD700] rounded-full blur-[100px] opacity-20"
                />
                <motion.div
                    animate={{
                        y: [0, 40, 0],
                        x: [0, -20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#FFD700] rounded-full blur-[120px] opacity-15"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <img
                                src={logoImage}
                                alt="JazzUp Logo"
                                className="w-56 h-auto object-contain filter drop-shadow-[0_4px_20px_rgba(255,215,0,0.4)]"
                            />
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-[#FFD700]"></div>
                                <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Winter 2026 Collection</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-none">
                                <span className="block text-white mb-3">ELEVATE</span>
                                <span className="block text-[#FFD700] mb-3">YOUR STYLE</span>
                                <span className="block text-white/90 text-3xl sm:text-4xl lg:text-5xl">to new heights</span>
                            </h1>

                            <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-lg leading-relaxed">
                                Discover premium fashion that speaks volumes. Curated collections designed for those who refuse to blend in.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <motion.button
                                    whileHover={{ scale: 1.05, x: 10 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group px-8 py-4 bg-[#FFD700] text-[#010001] rounded-none text-lg hover:bg-white transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    <span className="relative z-10">Shop Collection</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <motion.div
                                        className="absolute inset-0 bg-[#FFC700]"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-none text-lg hover:bg-white hover:text-[#010001] transition-all"
                                >
                                    View Lookbook
                                </motion.button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="border-l-2 border-[#FFD700] pl-4">
                                    <div className="text-[#FFD700] text-3xl">500+</div>
                                    <div className="text-white/60 text-sm">Products</div>
                                </div>
                                <div className="border-l-2 border-[#FFD700] pl-4">
                                    <div className="text-[#FFD700] text-3xl">50K+</div>
                                    <div className="text-white/60 text-sm">Happy Customers</div>
                                </div>
                                <div className="border-l-2 border-[#FFD700] pl-4">
                                    <div className="text-[#FFD700] text-3xl">100%</div>
                                    <div className="text-white/60 text-sm">Premium Quality</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Feature Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden lg:flex flex-col gap-6"
                    >
                        {/* Card 1 */}
                        <motion.div
                            whileHover={{ scale: 1.05, x: -10 }}
                            className="bg-[#1E140F]/80 backdrop-blur-sm border border-[#FFD700]/30 p-6 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xl mb-2">New Arrivals</h3>
                                    <p className="text-white/60 text-sm">Fresh styles dropping weekly. Be the first to discover our latest pieces.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            whileHover={{ scale: 1.05, x: -10 }}
                            className="bg-[#1E140F]/80 backdrop-blur-sm border border-[#FFD700]/30 p-6 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xl mb-2">Trending Now</h3>
                                    <p className="text-white/60 text-sm">See what's hot this season. Styles that everyone's talking about.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            whileHover={{ scale: 1.05, x: -10 }}
                            className="bg-[#1E140F]/80 backdrop-blur-sm border border-[#FFD700]/30 p-6 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Award className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xl mb-2">VIP Access</h3>
                                    <p className="text-white/60 text-sm">Join our exclusive club. Early access & special member benefits.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
                    <div className="w-px h-16 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;