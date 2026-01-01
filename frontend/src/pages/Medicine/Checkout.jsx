import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'card',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = useMemo(() => getCartTotal(), [getCartTotal]);
    const tax = useMemo(() => subtotal * 0.18, [subtotal]);
    const deliveryFee = useMemo(() => subtotal > 500 ? 0 : 50, [subtotal]);
    const total = useMemo(() => subtotal + tax + deliveryFee, [subtotal, tax, deliveryFee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits)';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode (6 digits)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    medicineId: item._id || item.id,
                    quantity: item.quantity
                })),
                customer: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                paymentMethod: formData.paymentMethod
            };

            const response = await fetch(`${BACKEND_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            clearCart();
            navigate('/order-success');
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-md p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <Link to="/medicines" className="lab-btn-primary inline-flex items-center space-x-2 mt-4">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/cart" className="inline-flex items-center text-health-primary hover:text-health-primary-dark mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cart
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Information */}
                        <div className="card p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <MapPin className="w-6 h-6 text-health-secondary" />
                                <h3 className="text-xl font-bold text-gray-900">Delivery Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.name ? 'border-red-500' : ''}`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.email ? 'border-red-500' : ''}`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.phone ? 'border-red-500' : ''}`}
                                        placeholder="1234567890"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.city ? 'border-red-500' : ''}`}
                                        placeholder="Mumbai"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.state ? 'border-red-500' : ''}`}
                                        placeholder="Maharashtra"
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className={`input-modern ${errors.pincode ? 'border-red-500' : ''}`}
                                        placeholder="400001"
                                    />
                                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`input-modern ${errors.address ? 'border-red-500' : ''}`}
                                    placeholder="Street address, apartment, suite, etc."
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="card p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <CreditCard className="w-6 h-6 text-health-secondary" />
                                <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center justify-start gap-4 p-4 border-2 border-health-primary rounded-lg cursor-pointer hover:bg-health-bg transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-health-primary focus:ring-health-primary"
                                    />
                                    <div className="text-left">
                                        <span className="block font-semibold text-gray-900">Credit/Debit Card</span>
                                        <p className="text-sm text-gray-600">Pay securely with your card</p>
                                    </div>
                                </label>

                                <label className="flex items-center justify-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-health-bg transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="upi"
                                        checked={formData.paymentMethod === 'upi'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-health-primary focus:ring-health-primary"
                                    />
                                    <div className="text-left">
                                        <span className="block font-semibold text-gray-900">UPI</span>
                                        <p className="text-sm text-gray-600">Pay using UPI apps</p>
                                    </div>
                                </label>

                                <label className="flex items-center justify-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-health-bg transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-health-primary focus:ring-health-primary"
                                    />
                                    <div className="text-left">
                                        <span className="block font-semibold text-gray-900">Cash on Delivery</span>
                                        <p className="text-sm text-gray-600">Pay when you receive</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item._id || item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span className="font-semibold text-gray-900">
                                        {deliveryFee === 0 ? <span className="text-green-600">Free</span> : `₹${deliveryFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-health-primary">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`lab-btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
