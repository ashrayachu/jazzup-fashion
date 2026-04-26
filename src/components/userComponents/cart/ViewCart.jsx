/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from 'lucide-react';
import {
    clearCart as clearCartApi,
    getCart,
    removeFromCart,
    updateCartItem,
} from '../../../api/user/cartApi';
import useCartStore from '../../../store/useCartStore';

const placeholderImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"%3E%3Crect width="600" height="800" fill="%231E140F"/%3E%3Cpath d="M120 540h360L390 340l-62 80-50-58-158 178Z" fill="%23FFD700" fill-opacity=".22"/%3E%3Ccircle cx="405" cy="260" r="48" fill="%23FFD700" fill-opacity=".28"/%3E%3C/svg%3E';

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

const formatPrice = (price) => `Rs. ${Number(price || 0).toFixed(2)}`;

const getProductImage = (product) => {
    if (!product) return placeholderImage;
    if (typeof product.image === 'string') return product.image;
    if (Array.isArray(product.image)) return product.image[0];
    return product.variants?.[0]?.images?.[0] || placeholderImage;
};

const getCartPayload = (response) => response?.data?.data || response?.data || {};

const getSelectedVariant = (product, variantId) => {
    if (!product?.variants?.length) return null;
    return product.variants.find((variant) => variant._id === variantId) || product.variants[0];
};

const normalizeCartItem = (item) => {
    const product = item?.productId && typeof item.productId === 'object' ? item.productId : null;
    const selectedVariant = getSelectedVariant(product, item?.variantId);
    const quantity = Number(item?.quantity || 1);
    const lineTotal = Number(item?.price || product?.price || 0);
    const unitPrice = quantity > 0 ? lineTotal / quantity : lineTotal;

    return {
        id: item?._id || item?.id,
        productId: product?._id || item?.productId,
        name: product?.name || item?.name || 'Product',
        brand: product?.brand || 'JazzUp',
        description: product?.description || '',
        image: selectedVariant?.images?.[0] || getProductImage(product || item),
        color: item?.color || selectedVariant?.color || 'Default',
        colorCode: item?.colorCode || selectedVariant?.colorCode || '#FFD700',
        size: item?.size || selectedVariant?.sizes?.[0]?.size || 'Standard',
        quantity,
        unitPrice,
        lineTotal,
    };
};

const ViewCart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const { setItemCount } = useCartStore();

    const items = useMemo(() => cartItems.map(normalizeCartItem), [cartItems]);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingCost = subtotal > 100 ? 0 : 15;
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const finalTotal = subtotal + shippingCost - discount;

    const loadCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCart();
            const cartPayload = getCartPayload(response);
            const nextItems = cartPayload?.cart || [];
            setCartItems(nextItems);
            setItemCount(cartPayload?.itemCount ?? nextItems.length);
        } catch (error) {
            console.log('get cart error', error);
            setCartItems([]);
            setItemCount(0);
        } finally {
            setLoading(false);
        }
    }, [setItemCount]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const handleApplyPromo = () => {
        if (promoCode.trim().toLowerCase() === 'jazz10') {
            setPromoApplied(true);
        }
    };

    const handleUpdateQuantity = async (item, quantity) => {
        if (quantity < 1 || !item.id) return;

        const nextLineTotal = item.unitPrice * quantity;
        setUpdatingItemId(item.id);
        setCartItems((currentItems) =>
            currentItems.map((currentItem) =>
                (currentItem._id || currentItem.id) === item.id
                    ? { ...currentItem, quantity, price: nextLineTotal }
                    : currentItem
            )
        );

        try {
            await updateCartItem(item.id, quantity);
            await loadCart();
        } catch (error) {
            console.log('update cart error', error);
            await loadCart();
        } finally {
            setUpdatingItemId('');
        }
    };

    const handleRemoveItem = async (cartId) => {
        if (!cartId) return;

        try {
            setUpdatingItemId(cartId);
            await removeFromCart(cartId);
            const nextItems = cartItems.filter((item) => (item._id || item.id) !== cartId);
            setCartItems(nextItems);
            setItemCount(nextItems.length);
        } catch (error) {
            console.log('remove cart error', error);
            await loadCart();
        } finally {
            setUpdatingItemId('');
        }
    };

    const handleClearCart = async () => {
        try {
            setUpdatingItemId('clear-cart');
            await clearCartApi();
            setCartItems([]);
            setItemCount(0);
        } catch (error) {
            console.log('clear cart error', error);
            await loadCart();
        } finally {
            setUpdatingItemId('');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-black pt-24 pb-20 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 h-10 w-56 animate-pulse rounded-lg bg-white/10" />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="h-44 animate-pulse rounded-lg bg-brand-brown" />
                            ))}
                        </div>
                        <div className="h-96 animate-pulse rounded-lg bg-brand-brown" />
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-brand-black pt-32 pb-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-brown">
                            <ShoppingBag className="h-12 w-12 text-white/30" />
                        </div>

                        <h1 className="mb-4 text-4xl text-white sm:text-5xl">Your Cart is Empty</h1>
                        <p className="mx-auto mb-10 max-w-md text-lg text-white/60">
                            Looks like you have not added anything to your cart yet. Start shopping to find your perfect style.
                        </p>

                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 font-semibold text-brand-black transition-all hover:bg-white"
                        >
                            Continue Shopping
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black pt-24 pb-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-4xl text-white sm:text-5xl">Shopping Cart</h1>
                        <p className="text-white/60">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearCart}
                        disabled={updatingItemId === 'clear-cart'}
                        className="mt-4 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-lg border border-white/5 bg-brand-brown p-4 transition-all hover:border-white/10 sm:p-6"
                                >
                                    <div className="flex gap-4 sm:gap-6">
                                        <Link
                                            to={`/product/${item.productId}`}
                                            className="group relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-black/20 sm:h-40 sm:w-32"
                                        >
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </Link>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                                            <div>
                                                <div className="mb-2 flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <span className="mb-1 block text-xs uppercase tracking-widest text-brand-gold">
                                                            {item.brand}
                                                        </span>
                                                        <Link
                                                            to={`/product/${item.productId}`}
                                                            className="block truncate text-lg font-medium text-white transition-colors hover:text-brand-gold"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={updatingItemId === item.id}
                                                        className="flex-shrink-0 text-white/40 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                                                    <div className="flex items-center gap-2">
                                                        <span>Color:</span>
                                                        <div
                                                            className="h-5 w-5 rounded-full border border-white/20"
                                                            style={{ backgroundColor: item.colorCode }}
                                                            title={item.color}
                                                        />
                                                    </div>
                                                    <span>Size: <span className="text-white">{item.size}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || updatingItemId === item.id}
                                                        className="flex h-8 w-8 items-center justify-center text-white/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        disabled={updatingItemId === item.id}
                                                        className="flex h-8 w-8 items-center justify-center text-white/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-xl font-medium text-white">{formatPrice(item.lineTotal)}</div>
                                                    {item.quantity > 1 && (
                                                        <div className="text-xs text-white/40">{formatPrice(item.unitPrice)} each</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <Link
                            to="/shop"
                            className="mt-4 inline-flex items-center gap-2 text-brand-gold transition-colors hover:text-white"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div>
                        <div className="sticky top-28 rounded-lg border border-white/5 bg-brand-brown p-6">
                            <h2 className="mb-6 text-2xl text-white">Order Summary</h2>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm text-white/60">Promo Code</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(event) => setPromoCode(event.target.value)}
                                            placeholder="Enter code"
                                            disabled={promoApplied}
                                            className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        disabled={promoApplied || !promoCode}
                                        className="rounded-lg bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoApplied && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 flex items-center gap-1 text-xs text-green-500"
                                    >
                                        Promo code applied. 10% discount
                                    </motion.p>
                                )}
                            </div>

                            <div className="mb-6 h-px w-full bg-white/10" />

                            <div className="mb-6 space-y-3">
                                <div className="flex justify-between text-white/60">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-500' : 'text-white'}>
                                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-white/60">
                                        <span>Discount (10%)</span>
                                        <span className="text-green-500">-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                {subtotal <= 100 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="rounded-lg bg-brand-gold/10 px-3 py-2 text-xs text-brand-gold"
                                    >
                                        Add {formatPrice(100 - subtotal)} more for FREE shipping.
                                    </motion.div>
                                )}
                            </div>

                            <div className="mb-6 h-px w-full bg-white/10" />

                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-lg text-white">Total</span>
                                <span className="text-2xl font-semibold text-white">{formatPrice(finalTotal)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold py-4 text-lg font-semibold text-brand-black transition-all hover:bg-white"
                            >
                                <Lock className="h-5 w-5" />
                                Proceed to Checkout
                            </button>

                            <div className="space-y-2 text-xs text-white/50">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5 text-green-500" />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="h-3.5 w-3.5 text-brand-gold" />
                                    <span>Free shipping on orders over {formatPrice(100)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCart;
