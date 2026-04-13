/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import useUserProductStore from '../../../store/useUserProductStore.jsx';

const placeholderImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"%3E%3Crect width="900" height="1200" fill="%231E140F"/%3E%3Cpath d="M200 770h500L585 520l-90 115-75-90-220 225Z" fill="%23FFD700" fill-opacity=".22"/%3E%3Ccircle cx="610" cy="380" r="72" fill="%23FFD700" fill-opacity=".28"/%3E%3C/svg%3E';

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

const getProductData = (data) => data?.product || data || null;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, clearCurrentProduct, loading } = useUserProductStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => clearCurrentProduct();
  }, [id, fetchProductById, clearCurrentProduct]);

  const product = useMemo(() => {
    return getProductData(currentProduct);
  }, [currentProduct]);

  const variants = product?.variants?.length ? product.variants : [];
  const currentVariant = variants[selectedVariantIndex] || variants[0];
  const images = currentVariant?.images?.length ? currentVariant.images : [placeholderImage];
  const currentImage = images[currentImageIndex] || images[0];
  const categoryName = product?.category?.name || product?.category || 'Product';

  useEffect(() => {
    if (selectedVariantIndex >= variants.length) {
      setSelectedVariantIndex(0);
      setCurrentImageIndex(0);
      setSelectedSize('');
      setQuantity(1);
    }
  }, [selectedVariantIndex, variants.length]);

  const selectedSizeData = currentVariant?.sizes?.find((item) => item.size === selectedSize);
  const maxStock = Number(selectedSizeData?.quantity || 1);

  const handleColorChange = (index) => {
    setSelectedVariantIndex(index);
    setCurrentImageIndex(0);
    setSelectedSize('');
    setQuantity(1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (selectedSize && quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getStockStatus = () => {
    if (!selectedSize) return null;
    if (!selectedSizeData) return <span className="text-red-400">Unavailable</span>;
    if (Number(selectedSizeData.quantity) < 5) {
      return <span className="text-brand-gold">Low stock: only {selectedSizeData.quantity} left</span>;
    }
    return <span className="text-green-400">In stock</span>;
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </button>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-16">
            <div className="aspect-[3/4] animate-pulse rounded-lg bg-brand-brown" />
            <div className="space-y-5 pt-4">
              <div className="h-4 w-28 animate-pulse rounded bg-brand-gold/30" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
              <div className="h-px bg-white/10" />
              <div className="h-24 animate-pulse rounded bg-white/10" />
              <div className="h-40 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-12 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mx-auto mb-8 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </button>
          <div className="rounded-lg border border-white/10 bg-brand-brown p-8">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-brand-gold">Product unavailable</p>
            <h1 className="mb-3 text-3xl font-light">We could not load this product.</h1>
            <p className="text-white/60">Please go back and choose another item from the shop.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-16">
          <div className="space-y-4">
            <motion.div
              layoutId={`product-image-${product?._id || product?.id || id}`}
              className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-brand-brown"
            >
              {loading && !currentProduct && (
                <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-white/10">
                  <div className="h-full w-1/3 animate-pulse bg-brand-gold" />
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={currentImage}
                    alt={product?.name || 'Product image'}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 lg:hidden">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      currentImageIndex === index ? 'w-6 bg-brand-gold' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsWishlisted((prev) => !prev)}
                aria-label="Toggle wishlist"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isWishlisted ? 'fill-brand-gold text-brand-gold' : 'text-white'
                  }`}
                />
              </button>
            </motion.div>

            <div className="hidden grid-cols-4 gap-3 lg:grid">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-brand-gold'
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product?.name || 'Product'} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pt-4">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-brand-gold">
              {product?.brand || 'Jazzup'}
            </p>

            <h1 className="mb-4 text-4xl font-light leading-tight text-white sm:text-5xl">
              {product?.name || 'Product details'}
            </h1>

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-medium text-white">Rs. {product?.price}</span>
              <div className="flex items-center gap-1 rounded-full bg-brand-gold/10 px-3 py-1 text-sm text-brand-gold">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-medium">4.8</span>
                <span className="ml-1 text-brand-gold/70">(124 reviews)</span>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/60">
                {categoryName}
              </span>
            </div>

            <div className="mb-8 h-px w-full bg-white/10" />

            <div className="mb-8 space-y-8">
              <div>
                <span className="mb-3 block text-sm text-white/60">
                  Color: <span className="ml-1 text-white">{currentVariant?.color || 'Default'}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant, index) => (
                    <button
                      type="button"
                      key={`${variant.color}-${index}`}
                      onClick={() => handleColorChange(index)}
                      title={variant.color}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-all ${
                        selectedVariantIndex === index
                          ? 'border-brand-gold ring-2 ring-brand-gold/40'
                          : 'border-white/10 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: variant.colorCode || '#1E140F' }}
                    >
                      {selectedVariantIndex === index && (
                        <span className="h-2 w-2 rounded-full bg-white shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-white/60">
                    Size: <span className="ml-1 text-white">{selectedSize || 'Select a size'}</span>
                  </span>
                  <button type="button" className="text-xs text-brand-gold hover:underline">
                    Size guide
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {currentVariant?.sizes?.map((sizeItem) => {
                    const isAvailable = Number(sizeItem.quantity) > 0;

                    return (
                      <button
                        type="button"
                        key={sizeItem.size}
                        disabled={!isAvailable}
                        onClick={() => handleSizeSelect(sizeItem.size)}
                        className={`rounded-lg border py-3 text-sm font-medium transition-all ${
                          selectedSize === sizeItem.size
                            ? 'border-brand-gold bg-brand-gold text-brand-black'
                            : isAvailable
                              ? 'border-white/20 bg-transparent text-white hover:border-brand-gold/60'
                              : 'cursor-not-allowed border-transparent bg-white/5 text-white/20 line-through'
                        }`}
                      >
                        {sizeItem.size}
                      </button>
                    );
                  })}
                </div>
                {!currentVariant?.sizes?.length && (
                  <p className="text-sm text-white/50">No sizes available for this color.</p>
                )}

                <div className="mt-2 h-5 text-sm">{getStockStatus()}</div>
              </div>

              <div>
                <span className="mb-3 block text-sm text-white/60">Quantity</span>
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10 bg-brand-brown">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    disabled={!selectedSize}
                    className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    disabled={!selectedSize || quantity >= maxStock}
                    className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                disabled={!selectedSize}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-gold py-4 text-lg font-semibold text-brand-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCard className="h-5 w-5" />
                Book now
              </button>
              <button
                type="button"
                disabled={!selectedSize}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 bg-transparent py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to cart
              </button>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-white/70">
              <p>{product?.description || 'No description available.'}</p>

              <div className="grid grid-cols-1 gap-4 border-y border-white/10 py-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 flex-shrink-0 text-brand-gold" />
                  <span>Free shipping on selected orders</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-brand-gold" />
                  <span>Quality checked before dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
