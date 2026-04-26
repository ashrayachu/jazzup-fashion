/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Search, ShoppingCart, X } from 'lucide-react';
import { getUserCategoriesApi, getUserProductsApi } from '../../../api/user/productApi';
import { addToCart } from '../../../api/user/cartApi';
import { toast } from 'react-toastify';
import useCartStore from '../../../store/useCartStore';

const placeholderImage = '/placeholder.jpg';

const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src || placeholderImage);

    useEffect(() => {
        setImgSrc(src || placeholderImage);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(placeholderImage)}
        />
    );
};

const getVariantImage = (variant) => variant?.images?.[0] || placeholderImage;

const getAvailableSizes = (variant) => {
    return (variant?.sizes || []).filter((sizeItem) => Number(sizeItem?.quantity || 0) > 0);
};

const ShopSection = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerProduct, setDrawerProduct] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    const { setItemCount } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        const AllCategories = async () => {
            const response = await getUserCategoriesApi();
            const cats = response?.data?.categories || [];
            setCategories(cats);
            if (cats.length > 0) {
                setSelectedCategory(cats[0]);
            }
        };

        AllCategories();
    }, []);

    useEffect(() => {
        const AllProducts = async () => {
            if (!selectedCategory?._id) return;

            const response = await getUserProductsApi({
                category: selectedCategory._id,
                limit: 20,
                page: 1,
            });
            setProducts(response?.data?.data?.products || []);
        };

        AllProducts();
    }, [selectedCategory]);

    const filteredProducts = (products || []).filter((product) => {
        return product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const closeDrawer = () => {
        setDrawerProduct(null);
        setSelectedVariantIndex(0);
        setSelectedSize('');
        setAddingToCart(false);
    };

    const openVariantDrawer = (product, variantIndex = 0) => {
        setDrawerProduct(product);
        setSelectedVariantIndex(variantIndex);
        setSelectedSize('');
    };

    const handleAddToCart = async (product) => {
        try {
            setAddingToCart(true);
            const data = await addToCart(product._id, {
                quantity: 1,
                // no variantId, color, size — accessories
            });
            setItemCount(data?.data?.cartSummary?.itemCount);
            toast.success('Added to cart');
            closeDrawer();
        } catch (e) {
            console.log('cart error', e);
            toast.error('Something went wrong');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleConfirmDrawerAdd = async () => {
        const selectedVariant = drawerProduct?.variants?.[selectedVariantIndex];
        const availableSizes = getAvailableSizes(selectedVariant);

        // If variant has sizes, one must be selected
        if (availableSizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        try {
            setAddingToCart(true);
            const data = await addToCart(drawerProduct._id, {
                variantId: selectedVariant?._id || null,
                color: selectedVariant?.color || null,
                colorCode: selectedVariant?.colorCode || null,
                size: selectedSize || null,
                quantity: 1,
            });
            setItemCount(data?.data?.cartSummary?.itemCount);
            toast.success('Added to cart');
            closeDrawer();
        } catch (e) {
            console.log('cart error', e);
            toast.error(e?.response?.data?.message || 'Something went wrong');
        } finally {
            setAddingToCart(false);
        }
    };

    const selectedVariant = drawerProduct?.variants?.[selectedVariantIndex];
    const selectedVariantSizes = getAvailableSizes(selectedVariant);
    const drawerImage = getVariantImage(selectedVariant) || drawerProduct?.variants?.[0]?.images?.[0];

    return (
        <div className="min-h-screen bg-brand-black pt-20">
            <div className="relative h-64 overflow-hidden md:h-80">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1764860753654-ee65d97be642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN0b3JlfGVufDF8fHx8MTc2OTUzMzU2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Shop Banner"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="mb-4 text-4xl font-light text-white md:text-6xl">
                            Men&apos;s <span className="text-brand-gold">Essentials</span>
                        </h1>
                        <p className="mx-auto max-w-xl px-4 text-white/70">
                            Explore our curated collection of premium accessories and footwear.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
                        {categories?.map((cat) => (
                            <button
                                type="button"
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap rounded-full px-6 py-2 transition-colors ${selectedCategory?._id === cat._id
                                    ? 'bg-brand-gold font-medium text-brand-black'
                                    : 'bg-brand-brown text-white hover:bg-white/10'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex w-full items-center gap-4 md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full bg-brand-brown py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full bg-brand-brown px-4 py-2 text-white hover:bg-white/10"
                        >
                            <span className="hidden sm:inline">Sort</span>
                            <Filter className="h-4 w-4" />
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts?.map((product) => {
                        const variants = product?.variants || [];
                        const hasVariants = variants.length > 0;

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key={product._id}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-brand-brown transition-all duration-300 hover:shadow-xl hover:shadow-brand-gold/10"
                                onClick={() => navigate(`/product/${product?._id}`)}
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <ImageWithFallback
                                        src={variants?.[0]?.images?.[0] || placeholderImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {product.collections?.includes('Sale') && (
                                        <div className="absolute left-3 top-3 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-black">
                                            Sale
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />

                                    <button
                                        type="button"
                                        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-full items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition-transform duration-300 hover:bg-brand-gold group-hover:translate-y-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (hasVariants) {
                                                openVariantDrawer(product);
                                                return;
                                            }
                                            handleAddToCart(product);
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </button>
                                </div>

                                <div className="p-5">
                                    <p className="mb-1 text-xs uppercase tracking-wide text-brand-gold">
                                        {product.category?.name || 'Uncategorized'}
                                    </p>
                                    <h3 className="mb-2 truncate text-lg font-medium text-white">{product.name}</h3>
                                    <p className="text-white/80">Rs. {product.price}</p>

                                    {hasVariants && (
                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                {variants.slice(0, 5).map((variant, index) => (
                                                    <button
                                                        type="button"
                                                        key={variant._id || `${variant.color}-${index}`}
                                                        title={variant.color}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openVariantDrawer(product, index);
                                                        }}
                                                        className="h-5 w-5 rounded-full border border-white/30 ring-offset-2 ring-offset-brand-brown transition hover:ring-2 hover:ring-brand-gold"
                                                        style={{ backgroundColor: variant.colorCode || '#FFD700' }}
                                                    />
                                                ))}
                                                {variants.length > 5 && (
                                                    <span className="text-xs text-white/50">+{variants.length - 5}</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-white/50">
                                                {variants.length} {variants.length === 1 ? 'color' : 'colors'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredProducts?.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-lg text-white/50">No products found matching your criteria.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {drawerProduct && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close variant selector"
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-brand-brown text-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 p-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-brand-gold">Choose options</p>
                                    <h2 className="mt-1 truncate text-xl font-medium">{drawerProduct.name}</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeDrawer}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5">
                                <div className="mb-6 overflow-hidden rounded-lg bg-black/20">
                                    <ImageWithFallback
                                        src={drawerImage}
                                        alt={drawerProduct.name}
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                </div>

                                <div className="mb-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm text-white/60">Color</span>
                                        <span className="text-sm text-white">{selectedVariant?.color || 'Default'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {drawerProduct.variants?.map((variant, index) => (
                                            <button
                                                type="button"
                                                key={variant._id || `${variant.color}-${index}`}
                                                onClick={() => {
                                                    setSelectedVariantIndex(index);
                                                    setSelectedSize('');
                                                }}
                                                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${selectedVariantIndex === index
                                                    ? 'border-brand-gold bg-brand-gold/10'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <span
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20"
                                                    style={{ backgroundColor: variant.colorCode || '#FFD700' }}
                                                >
                                                    {selectedVariantIndex === index && <Check className="h-4 w-4 text-white" />}
                                                </span>
                                                <span className="min-w-0 truncate text-sm">{variant.color || 'Default'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm text-white/60">Size</span>
                                        <span className="text-sm text-white">{selectedSize || 'Select a size'}</span>
                                    </div>

                                    {selectedVariantSizes.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-3">
                                            {selectedVariantSizes.map((sizeItem) => (
                                                <button
                                                    type="button"
                                                    key={sizeItem._id || sizeItem.size}
                                                    onClick={() => setSelectedSize(sizeItem.size)}
                                                    className={`rounded-lg border py-3 text-sm font-medium transition ${selectedSize === sizeItem.size
                                                        ? 'border-brand-gold bg-brand-gold text-brand-black'
                                                        : 'border-white/10 text-white hover:border-brand-gold/60'
                                                        }`}
                                                >
                                                    {sizeItem.size}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                                            No sizes are available for this color.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-white/10 p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-white/60">Price</span>
                                    <span className="text-xl font-semibold">Rs. {drawerProduct.price}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleConfirmDrawerAdd}
                                    disabled={addingToCart}   // ← removed the selectedVariantSizes.length === 0 check
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold py-4 font-semibold text-brand-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShopSection;
