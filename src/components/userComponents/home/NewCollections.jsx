import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProductsByCollectionApi } from '../../../api/user/productApi';

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

// Predefined collections to fetch
const COLLECTION_CONFIG = [
    {
        id: 'newarrivals',
        title: 'New Arrivals',
        description: 'Discover our latest curated pieces that define modern fashion',
        defaultImage: 'https://images.unsplash.com/photo-1538329972958-465d6d2144ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjkzOTQ0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'bestsellers',
        title: 'Best Sellers',
        description: 'Shop our most loved pieces chosen by fashion enthusiasts',
        defaultImage: 'https://images.unsplash.com/photo-1768696083080-15d4218ce844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY5NDI0ODE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'featured',
        title: 'Featured Collection',
        description: 'Handpicked essentials for the sophisticated wardrobe',
        defaultImage: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3Njk0MzY5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
];

const NewCollections = () => {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const collectionsData = await Promise.all(
                COLLECTION_CONFIG.map(async (config) => {

                    try {
                        const response = await getProductsByCollectionApi(config.id);
                        const products = response?.data?.data || [];
                        console.log("new collections", response?.data?.data);

                        return {
                            id: config.id,
                            title: config.title,
                            description: config.description,
                            // Use first product's first variant image, or default
                            image: products[0]?.variants?.[0]?.images?.[0] || config.defaultImage,
                            items: `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`,
                            products: products,
                        };
                    } catch (error) {
                        console.error(`Error fetching collection ${config.id}:`, error);
                        // Return collection with default data if fetch fails
                        return {
                            id: config.id,
                            title: config.title,
                            description: config.description,
                            image: config.defaultImage,
                            items: '0 pieces',
                            products: [],
                        };
                    }
                })
            );

            // TEMPORARILY SHOW ALL COLLECTIONS (even with 0 products)
            // Only show collections that have products
            // const activeCollections = collectionsData.filter(col => col.products.length > 0);
            // setCollections(activeCollections);

            setCollections(collectionsData); // Show all for testing
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionClick = (collectionId) => {
        // Navigate to shop with collection filter
        navigate(`/shop?collection=${collectionId}`);
    };

    // TEMPORARILY DISABLED: Don't hide if no collections (for testing)
    // if (!loading && collections.length === 0) {
    //     return null;
    // }

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
                {loading ? (
                    <div className="text-center text-white py-12">
                        <div className="animate-pulse">Loading collections...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection, index) => (
                            <motion.div
                                key={collection.id}
                                onClick={() => handleCollectionClick(collection.id)}
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
                )}
            </div>
        </section>
    );
};

export default NewCollections;
