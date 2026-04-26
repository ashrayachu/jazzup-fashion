/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Banknote,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  Lock,
  MapPin,
  Plus,
  Store,
  Truck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { clearCart as clearCartApi, getCart } from '../../../api/user/cartApi';
import {
  addAddress,
  getAddresses,
  getStores,
  initiateCheckout,
  placeOrderCOD,
  verifyPayment,
} from '../../../api/user/checkoutApi';
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
const getPayload = (response) => response?.data?.data || response?.data || {};

const getNextDates = () => {
  const dates = [];
  const today = new Date();

  for (let index = 1; index <= 7; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    dates.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
    });
  }

  return dates;
};

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
    name: product?.name || item?.name || 'Product',
    image: selectedVariant?.images?.[0] || product?.variants?.[0]?.images?.[0] || placeholderImage,
    color: item?.color || selectedVariant?.color || 'Default',
    colorCode: item?.colorCode || selectedVariant?.colorCode || '#FFD700',
    size: item?.size || selectedVariant?.sizes?.[0]?.size || 'Standard',
    quantity,
    unitPrice,
    lineTotal,
  };
};

const normalizeAddress = (address) => ({
  id: address?._id || address?.id,
  fullName: address?.fullName || address?.name || '',
  phone: address?.phone || '',
  addressLine1: address?.addressLine1 || '',
  addressLine2: address?.addressLine2 || '',
  city: address?.city || '',
  state: address?.state || '',
  pincode: address?.pincode || '',
  isDefault: Boolean(address?.isDefault),
});

const toShippingAddress = (address) => ({
  fullName: address.fullName,
  phone: address.phone,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
});

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { setItemCount } = useCartStore();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [deliveryType, setDeliveryType] = useState('home');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedPickupDate, setSelectedPickupDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const items = useMemo(() => cartItems.map(normalizeCartItem), [cartItems]);
  const availableDates = useMemo(() => getNextDates(), []);
  const normalizedAddresses = useMemo(() => addresses.map(normalizeAddress), [addresses]);
  const fulfillmentType = deliveryType === 'home' ? 'home_delivery' : 'store_pickup';
  const appliedPromoCode = promoApplied ? promoCode.trim().toUpperCase() : '';

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingCost = deliveryType === 'store' ? 0 : subtotal > 1000 ? 0 : 99;
  const discountRate = appliedPromoCode === 'JAZZ20' ? 0.2 : appliedPromoCode === 'JAZZ10' ? 0.1 : 0;
  const discount = Math.round(subtotal * discountRate);
  const finalTotal = subtotal + shippingCost - discount;

  const activeAddress = normalizedAddresses.find((address) => address.id === selectedAddress);
  const activeStore = stores.find((store) => (store._id || store.id) === selectedStore);

  const loadCheckoutData = useCallback(async () => {
    try {
      setLoading(true);
      const [cartResponse, addressResponse, storeResponse] = await Promise.all([
        getCart(),
        getAddresses().catch(() => null),
        getStores().catch(() => null),
      ]);

      const cartPayload = getPayload(cartResponse);
      const nextCartItems = cartPayload?.cart || [];
      setCartItems(nextCartItems);
      setItemCount(cartPayload?.itemCount ?? nextCartItems.length);

      const addressPayload = getPayload(addressResponse);
      const nextAddresses = addressPayload?.addresses || addressPayload?.address || [];
      setAddresses(Array.isArray(nextAddresses) ? nextAddresses : []);

      const storePayload = getPayload(storeResponse);
      const nextStores = storePayload?.stores || [];
      setStores(nextStores);
    } catch (error) {
      console.log('checkout load error', error);
      toast.error('Unable to load checkout');
    } finally {
      setLoading(false);
    }
  }, [setItemCount]);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, loading, navigate]);

  useEffect(() => {
    if (!selectedAddress && normalizedAddresses.length > 0) {
      const defaultAddress = normalizedAddresses.find((address) => address.isDefault) || normalizedAddresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [normalizedAddresses, selectedAddress]);

  useEffect(() => {
    if (!selectedStore && stores.length > 0) {
      setSelectedStore(stores[0]._id || stores[0].id);
    }
  }, [selectedStore, stores]);

  useEffect(() => {
    if (deliveryType === 'store' && paymentMethod === 'cod') {
      setPaymentMethod('online');
    }
  }, [deliveryType, paymentMethod]);

  const handleCompleteStep = (step) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    if (step < 3) {
      setCurrentStep(step + 1);
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'JAZZ10' || code === 'JAZZ20') {
      setPromoApplied(true);
      return;
    }
    toast.error('Invalid promo code');
  };

  const handleSaveAddress = async () => {
    const { fullName, phone, addressLine1, city, state, pincode } = newAddress;
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      toast.error('Please fill the required address fields');
      return;
    }

    try {
      const response = await addAddress(newAddress);
      const payload = getPayload(response);
      const savedAddress = payload?.address || payload;
      await loadCheckoutData();
      if (savedAddress?._id || savedAddress?.id) {
        setSelectedAddress(savedAddress._id || savedAddress.id);
      }
      setShowAddAddressForm(false);
    } catch (error) {
      console.log('add address error', error);
    }
  };

  const buildOrderPayload = () => {
    const payload = {
      fulfillmentType,
      promoCode: appliedPromoCode || undefined,
    };

    if (deliveryType === 'home') {
      payload.shippingAddress = toShippingAddress(activeAddress || normalizeAddress(newAddress));
    } else {
      payload.pickupDetails = {
        storeId: selectedStore,
        pickupDate: selectedPickupDate,
      };
    }

    return payload;
  };

  const handlePlaceOrder = async () => {
    if (!completedSteps.has(3)) return;

    if (deliveryType === 'home' && !activeAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (deliveryType === 'store' && (!selectedStore || !selectedPickupDate)) {
      toast.error('Please select a store and pickup date');
      return;
    }

    try {
      setSubmitting(true);
      const orderPayload = buildOrderPayload();

      if (paymentMethod === 'cod') {
        const response = await placeOrderCOD(orderPayload);
        const payload = getPayload(response);
        await clearCartApi();
        setItemCount(0);
        toast.success(`Order placed${payload?.orderNumber ? `: ${payload.orderNumber}` : ''}`);
        navigate('/');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY;
      if (!scriptLoaded || !razorpayKey) {
        toast.error('Razorpay is not ready. Please check your payment key.');
        return;
      }

      const checkoutResponse = await initiateCheckout({
        fulfillmentType,
        promoCode: appliedPromoCode || undefined,
      });
      const checkoutPayload = getPayload(checkoutResponse);

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: checkoutPayload?.pricing?.total * 100,
        currency: 'INR',
        name: 'JazzUp Fashion',
        description: 'Order payment',
        order_id: checkoutPayload?.razorpayOrderId,
        handler: async (paymentResponse) => {
          const verifyResponse = await verifyPayment({
            ...orderPayload,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature,
          });
          const payload = getPayload(verifyResponse);
          setItemCount(0);
          toast.success(`Order placed${payload?.orderNumber ? `: ${payload.orderNumber}` : ''}`);
          navigate('/');
        },
        theme: { color: '#FFD700' },
      });

      razorpay.open();
    } catch (error) {
      console.log('place order error', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Complete = Boolean(deliveryType);
  const isStep2Complete =
    deliveryType === 'home' ? Boolean(selectedAddress) : Boolean(selectedStore && selectedPickupDate);
  const isStep3Complete = Boolean(paymentMethod);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 h-12 w-56 animate-pulse rounded-lg bg-white/10" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-32 animate-pulse rounded-2xl bg-brand-brown" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-brand-brown lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-4xl text-white sm:text-5xl">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-brand-brown">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <StepBadge step={1} completed={completedSteps.has(1)} />
                  <div>
                    <h2 className="text-xl text-white">Delivery Option</h2>
                    {completedSteps.has(1) && currentStep !== 1 && (
                      <p className="mt-1 text-sm text-white/60">
                        {deliveryType === 'home' ? 'Home Delivery' : 'Store Pickup'}
                      </p>
                    )}
                  </div>
                </div>
                {currentStep === 1 ? <ChevronUp className="h-5 w-5 text-white/60" /> : <span className="text-sm font-medium text-brand-gold">Edit</span>}
              </button>

              <StepPanel active={currentStep === 1}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <OptionButton
                    active={deliveryType === 'home'}
                    icon={<Home className="h-8 w-8" />}
                    title="Home Delivery"
                    text="Delivered to your address"
                    onClick={() => setDeliveryType('home')}
                  />
                  <OptionButton
                    active={deliveryType === 'store'}
                    icon={<Store className="h-8 w-8" />}
                    title="Store Pickup"
                    text="Collect from our store"
                    onClick={() => setDeliveryType('store')}
                  />
                </div>
                <StepButton disabled={!isStep1Complete} onClick={() => handleCompleteStep(1)}>
                  Continue
                </StepButton>
              </StepPanel>
            </div>

            <div className={`overflow-hidden rounded-2xl border border-white/5 bg-brand-brown ${!completedSteps.has(1) ? 'pointer-events-none opacity-50' : ''}`}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!completedSteps.has(1)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <StepBadge step={2} completed={completedSteps.has(2)} />
                  <div>
                    <h2 className="text-xl text-white">
                      {deliveryType === 'home' ? 'Delivery Address' : 'Store & Pickup Date'}
                    </h2>
                    {completedSteps.has(2) && currentStep !== 2 && (
                      <p className="mt-1 text-sm text-white/60">
                        {deliveryType === 'home' ? activeAddress?.addressLine1 : activeStore?.name}
                      </p>
                    )}
                  </div>
                </div>
                {currentStep === 2 ? <ChevronUp className="h-5 w-5 text-white/60" /> : completedSteps.has(2) && <span className="text-sm font-medium text-brand-gold">Edit</span>}
              </button>

              <StepPanel active={currentStep === 2}>
                {deliveryType === 'home' ? (
                  <>
                    {normalizedAddresses.map((address) => (
                      <button
                        type="button"
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                          selectedAddress === address.id ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioDot active={selectedAddress === address.id} />
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium text-white">{address.fullName}</span>
                              {address.isDefault && (
                                <span className="rounded bg-brand-gold/20 px-2 py-0.5 text-xs text-brand-gold">Default</span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-white/60">
                              <div>{address.phone}</div>
                              <div>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</div>
                              <div>{address.city}, {address.state} {address.pincode}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}

                    {!showAddAddressForm ? (
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 p-4 text-white/60 transition-all hover:border-brand-gold/50 hover:text-brand-gold"
                      >
                        <Plus className="h-5 w-5" />
                        Add New Address
                      </button>
                    ) : (
                      <AddressForm
                        value={newAddress}
                        onChange={setNewAddress}
                        onCancel={() => setShowAddAddressForm(false)}
                        onSave={handleSaveAddress}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm text-white/60">Select Store</label>
                      {stores.length > 0 ? (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                          <select
                            value={selectedStore}
                            onChange={(event) => setSelectedStore(event.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-black/30 py-3 pl-11 pr-10 text-white focus:border-brand-gold/50 focus:outline-none"
                          >
                            {stores.map((store) => (
                              <option key={store._id || store.id} value={store._id || store.id} className="bg-brand-brown">
                                {store.name} - {store.address}{store.city ? `, ${store.city}` : ''}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                        </div>
                      ) : (
                        <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                          No pickup stores are available right now.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="h-4 w-4" />
                        Preferred Pickup Date
                      </label>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {availableDates.slice(0, 5).map((dateObj) => (
                          <button
                            type="button"
                            key={dateObj.fullDate}
                            onClick={() => setSelectedPickupDate(dateObj.fullDate)}
                            className={`flex-shrink-0 rounded-lg border-2 px-5 py-3 transition-all ${
                              selectedPickupDate === dateObj.fullDate
                                ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                                : 'border-white/10 text-white hover:border-white/20'
                            }`}
                          >
                            <div className="mb-1 text-xs opacity-60">{dateObj.day}</div>
                            <div className="text-lg font-semibold">{dateObj.date}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <StepButton disabled={!isStep2Complete} onClick={() => handleCompleteStep(2)}>
                  Continue
                </StepButton>
              </StepPanel>
            </div>

            <div className={`overflow-hidden rounded-2xl border border-white/5 bg-brand-brown ${!completedSteps.has(2) ? 'pointer-events-none opacity-50' : ''}`}>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!completedSteps.has(2)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <StepBadge step={3} completed={completedSteps.has(3)} />
                  <div>
                    <h2 className="text-xl text-white">Payment Method</h2>
                    {completedSteps.has(3) && currentStep !== 3 && (
                      <p className="mt-1 text-sm text-white/60">
                        {paymentMethod === 'online' ? 'Pay Online' : 'Cash on Delivery'}
                      </p>
                    )}
                  </div>
                </div>
                {currentStep === 3 ? <ChevronUp className="h-5 w-5 text-white/60" /> : completedSteps.has(3) && <span className="text-sm font-medium text-brand-gold">Edit</span>}
              </button>

              <StepPanel active={currentStep === 3}>
                <PaymentOption
                  active={paymentMethod === 'online'}
                  icon={<CreditCard className="h-6 w-6 text-white/60" />}
                  title="Pay Online"
                  text="Razorpay, cards, UPI, wallets"
                  onClick={() => setPaymentMethod('online')}
                />
                <PaymentOption
                  active={paymentMethod === 'cod' && deliveryType === 'home'}
                  disabled={deliveryType === 'store'}
                  icon={<Banknote className="h-6 w-6 text-white/60" />}
                  title="Cash on Delivery"
                  text={deliveryType === 'store' ? 'Not available for store pickup' : 'Pay when your order arrives'}
                  onClick={() => deliveryType === 'home' && setPaymentMethod('cod')}
                />
                <StepButton disabled={!isStep3Complete} onClick={() => handleCompleteStep(3)}>
                  Continue
                </StepButton>
              </StepPanel>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-2xl border border-white/5 bg-brand-brown p-6">
              <h2 className="mb-6 text-2xl text-white">Order Summary</h2>

              <div className="mb-6 max-h-64 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-black/20">
                      <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 truncate text-sm font-medium text-white">{item.name}</div>
                      <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
                        <div className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: item.colorCode }} />
                        <span className="rounded bg-white/5 px-2 py-0.5">Size {item.size}</span>
                        <span>x {item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-sm font-medium text-white">{formatPrice(item.lineTotal)}</div>
                  </div>
                ))}
              </div>

              <div className="mb-6 h-px w-full bg-white/10" />

              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value);
                      setPromoApplied(false);
                    }}
                    placeholder="Promo code"
                    disabled={promoApplied}
                    className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                    className="rounded-lg bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs text-green-500">
                    Promo applied.
                  </motion.p>
                )}
              </div>

              <div className="mb-6 space-y-3">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                <SummaryRow label="Shipping" value={shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)} green={shippingCost === 0} />
                {discount > 0 && <SummaryRow label="Discount" value={`-${formatPrice(discount)}`} green />}
              </div>

              <div className="mb-6 h-0.5 w-full bg-white/20" />

              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg text-white">Total</span>
                <span className="text-2xl font-semibold text-white">{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!completedSteps.has(3) || submitting}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold py-4 text-lg font-semibold text-brand-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lock className="h-5 w-5" />
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <div className="space-y-2 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-green-500" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-brand-gold" />
                  <span>Free home delivery over {formatPrice(1000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepPanel = ({ active, children }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 px-6 pb-6">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

const StepBadge = ({ step, completed }) => (
  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${completed ? 'bg-brand-gold' : 'bg-white/10'}`}>
    {completed ? <Check className="h-5 w-5 text-brand-black" /> : <span className="text-sm font-semibold text-white">{step}</span>}
  </div>
);

const StepButton = ({ disabled, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full rounded-full bg-brand-gold py-3 font-semibold text-brand-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </button>
);

const OptionButton = ({ active, icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border-2 p-6 text-left transition-all ${
      active ? 'border-brand-gold bg-brand-gold/10' : 'border-white/10 hover:border-white/20'
    }`}
  >
    <div className={active ? 'mb-3 text-brand-gold' : 'mb-3 text-white/60'}>{icon}</div>
    <div className="mb-1 font-medium text-white">{title}</div>
    <div className="text-sm text-white/60">{text}</div>
  </button>
);

const RadioDot = ({ active }) => (
  <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-brand-gold' : 'border-white/30'}`}>
    {active && <div className="h-2.5 w-2.5 rounded-full bg-brand-gold" />}
  </div>
);

const PaymentOption = ({ active, disabled, icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
      disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
    } ${active ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/20'}`}
  >
    <div className="flex items-center gap-3">
      <RadioDot active={active} />
      {icon}
      <div className="flex-1">
        <div className="font-medium text-white">{title}</div>
        <div className="mt-1 text-xs text-white/40">{text}</div>
      </div>
    </div>
  </button>
);

const AddressForm = ({ value, onChange, onCancel, onSave }) => (
  <div className="space-y-4 rounded-xl border-2 border-white/10 p-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-medium text-white">New Address</h3>
      <button type="button" onClick={onCancel} className="text-sm text-white/60 hover:text-white">
        Cancel
      </button>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <AddressInput className="col-span-2 sm:col-span-1" placeholder="Full Name" value={value.fullName} onChange={(fullName) => onChange({ ...value, fullName })} />
      <AddressInput className="col-span-2 sm:col-span-1" placeholder="Phone Number" value={value.phone} onChange={(phone) => onChange({ ...value, phone })} />
      <AddressInput className="col-span-2" placeholder="Address Line 1" value={value.addressLine1} onChange={(addressLine1) => onChange({ ...value, addressLine1 })} />
      <AddressInput className="col-span-2" placeholder="Address Line 2" value={value.addressLine2} onChange={(addressLine2) => onChange({ ...value, addressLine2 })} />
      <AddressInput placeholder="City" value={value.city} onChange={(city) => onChange({ ...value, city })} />
      <AddressInput placeholder="State" value={value.state} onChange={(state) => onChange({ ...value, state })} />
      <AddressInput className="col-span-2" placeholder="Pincode" value={value.pincode} onChange={(pincode) => onChange({ ...value, pincode })} />
    </div>
    <button type="button" onClick={onSave} className="w-full rounded-lg bg-brand-gold py-3 font-semibold text-brand-black hover:bg-white">
      Save Address
    </button>
  </div>
);

const AddressInput = ({ className = '', placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`${className} rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none`}
  />
);

const SummaryRow = ({ label, value, green }) => (
  <div className="flex justify-between text-sm text-white/60">
    <span>{label}</span>
    <span className={green ? 'text-green-500' : 'text-white'}>{value}</span>
  </div>
);

export default Checkout;
