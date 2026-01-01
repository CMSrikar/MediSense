import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const subtotal = useMemo(() => getCartTotal(), [getCartTotal]);
    const tax = useMemo(() => subtotal * 0.18, [subtotal]);
    const deliveryFee = useMemo(() => (subtotal > 500 || subtotal === 0) ? 0 : 50, [subtotal]);
    const total = useMemo(() => subtotal + tax + deliveryFee, [subtotal, tax, deliveryFee]);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-health-bg pt-32 pb-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto animate-slide-up">
                        <div className="bg-white p-12 rounded-[3rem] shadow-glass border border-white relative overflow-hidden mb-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-health-primary/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="text-8xl mb-8 animate-float">🛒</div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Your basket is empty</h2>
                            <p className="text-gray-500 mb-10 leading-relaxed">It seems like you haven't added any medicines yet. Let's find something for you!</p>
                            <Link to="/medicines" className="lab-btn-primary inline-flex items-center group w-full justify-center">
                                Explore Catalog
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <Link to="/" className="text-health-secondary font-black flex items-center justify-center hover:opacity-80 transition-opacity">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-health-bg pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Cart Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-10 animate-slide-up">
                            <div>
                                <h1 className="lab-section-title mb-2">My <span className="text-gradient">Cart</span></h1>
                                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                                    Items Ready for Checkout: {cartItems.length}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={clearCart}
                                className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors border-b-2 border-rose-100 pb-1"
                            >
                                CLEAR ALL
                            </button>
                        </div>

                        <div className="space-y-6">
                            {cartItems.map((item, i) => (
                                <div
                                    key={item._id || item.id}
                                    className="bg-white p-6 md:p-8 rounded-[2rem] shadow-glass border border-white hover:shadow-premium transition-all duration-300 animate-fade-in"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                                        {/* Visual */}
                                        <div className="w-32 h-32 bg-health-bg rounded-2xl flex items-center justify-center overflow-hidden relative flex-shrink-0 shadow-inner">
                                            <img
                                                src={`${BACKEND_URL}/${encodeURI(item.image)}`}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = `${BACKEND_URL}/uploads/medicines/default.jpeg`;
                                                }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 space-y-2 text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start space-x-2">
                                                <span className="text-[10px] font-black text-health-secondary bg-health-secondary/5 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {item.category}
                                                </span>
                                                {item.requiresPrescription && (
                                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                        RX Required
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 leading-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-400 italic">By {item.manufacturer}</p>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-col items-center sm:items-end gap-6">
                                            <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-health-primary transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-health-primary transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <p className="text-2xl font-black text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item._id || item.id)}
                                                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <aside className="lg:w-[400px]">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-white">
                                <h3 className="text-2xl font-black mb-8">Order <span className="text-gradient">Summary</span></h3>

                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-xs tracking-[0.2em]">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900 text-lg font-black tracking-normal">₹{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-xs tracking-[0.2em]">
                                        <span>Est. GST (18%)</span>
                                        <span className="text-gray-900 text-lg font-black tracking-normal">₹{tax.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-xs tracking-[0.2em]">
                                        <span>Shipping</span>
                                        <span className={`text-lg font-black tracking-normal ${deliveryFee === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-100 pt-8 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                                        <span className="text-4xl font-black text-health-primary">₹{total.toFixed(0)}</span>
                                    </div>
                                </div>

                                <Link to="/checkout" className="lab-btn-primary w-full flex justify-center items-center group mb-6">
                                    Secure Checkout
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                                        <ShieldCheck className="w-5 h-5 text-health-secondary" />
                                        <span>SECURE TRANSACTION GUARANTEED</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                                        <Truck className="w-5 h-5 text-health-secondary" />
                                        <span>FREE SHIPPING ON ORDERS OVER ₹500</span>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Card */}
                            <div className="bg-health-secondary/10 p-8 rounded-[2rem] border border-health-secondary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 text-4xl opacity-20">🎁</div>
                                <h4 className="font-black text-health-secondary mb-2 uppercase tracking-widest text-xs">First Order Bonus</h4>
                                <p className="text-sm font-bold text-health-secondary/80">
                                    Get extra 10% off on your first order.
                                    Use code: <span className="bg-health-secondary text-white px-2 py-0.5 rounded-lg ml-1 font-black uppercase">FIRSTCARE</span>
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
