import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const collections = [
    {
        id: 1,
        title: 'Urban Essence',
        description: 'Street-inspired luxury meets contemporary style',
        image: 'https://images.unsplash.com/photo-1538329972958-465d6d2144ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjkzOTQ0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        items: '24 pieces',
    },
    {
        id: 2,
        title: 'Executive Line',
        description: 'Timeless elegance for the modern sophisticate',
        image: 'https://images.unsplash.com/photo-1768696083080-15d4218ce844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY5NDI0ODE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        items: '18 pieces',
    },
    {
        id: 3,
        title: 'Minimal Maven',
        description: 'Less is more - refined minimalist aesthetics',
        image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3Njk0MzY5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        items: '32 pieces',
    },
];

const NewCollections = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-brand-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4">
                        <span className="text-white">New </span>
                        <span className="text-brand-gold">Collections</span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Discover our latest curated collections that define the future of fashion
                    </p>
                </motion.div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            onClick={() => navigate('/shop')}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl bg-brand-brown cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-96 overflow-hidden">
                                <ImageWithFallback
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent opacity-80"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="text-brand-gold text-sm mb-2">{collection.items}</div>
                                <h3 className="text-white text-2xl mb-2">{collection.title}</h3>
                                <p className="text-white/70 text-sm mb-4">{collection.description}</p>

                                <button className="flex items-center gap-2 text-brand-gold group-hover:gap-4 transition-all">
                                    <span>Explore Collection</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 border-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewCollections;
