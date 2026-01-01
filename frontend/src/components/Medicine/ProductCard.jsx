import { ShoppingCart, AlertCircle, Plus, Info, CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000";

const ProductCard = ({ medicine }) => {
    const { addToCart } = useCart();
    const [showPrescriptionAlert, setShowPrescriptionAlert] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Fix: use _id
    if (!medicine.id && medicine._id) medicine.id = medicine._id;

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (medicine.requiresPrescription) {
            setShowPrescriptionAlert(true);
            setTimeout(() => setShowPrescriptionAlert(false), 3000);
        } else {
            addToCart(medicine);
        }
    };

    return (
        <div
            className="card-premium group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative mb-6">
                {/* Badges */}
                <div className="absolute -top-2 -left-2 z-10 flex flex-col gap-2">
                    {medicine.requiresPrescription && (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                            Rx Required
                        </span>
                    )}
                    {medicine.stock < 20 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Product Image */}
                <div className="bg-health-bg h-48 rounded-2xl flex items-center justify-center overflow-hidden relative">
                    <img
                        src={`${BACKEND_URL}/${encodeURI(medicine.image)}`}
                        alt={medicine.name}
                        className={`h-full w-full object-contain transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"
                            }`}
                        onError={(e) => {
                            e.target.src = `${BACKEND_URL}/uploads/medicines/default.jpeg`;
                        }}
                    />

                    {/* Quick Action Overlay */}
                    <div
                        className={`absolute inset-0 bg-health-primary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="bg-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-health-primary"
                        >
                            <Plus className="w-6 h-6 stroke-[3]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-health-secondary uppercase tracking-[0.2em] bg-health-secondary/5 px-2 py-0.5 rounded-md">
                        {medicine.category}
                    </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-1 group-hover:text-health-primary transition-colors">
                    {medicine.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
                    {medicine.description}
                </p>

                <div className="pt-2 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                            Price
                        </p>
                        <p className="text-2xl font-black text-gray-900">
                            ₹{medicine.price}
                            <span className="text-sm font-bold text-gray-400">.00</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        {medicine.stock > 0 ? (
                            <div className="flex items-center text-green-600 text-[10px] font-bold mb-2">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                IN STOCK
                            </div>
                        ) : (
                            <div className="flex items-center text-rose-500 text-[10px] font-bold mb-2">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                OUT OF STOCK
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all ${medicine.requiresPrescription
                                ? "bg-gray-100 hooking text-gray-400 cursor-not-allowed"
                                : "bg-health-primary text-white hover:bg-health-primary-dark shadow-lg shadow-health-primary/20"
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                                {medicine.requiresPrescription ? "NEEDS RX" : "ADD"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Prescription Alert */}
            <div
                className={`absolute left-0 right-0 bottom-4 px-4 transition-all duration-300 pointer-events-none z-20 ${showPrescriptionAlert
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                    }`}
            >
                <div className="bg-amber-500 text-white text-[10px] font-black p-3 rounded-xl shadow-2xl flex items-center justify-center space-x-2 border border-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>PRESCRIPTION REQUIRED FOR THIS MEDICINE</span>
                </div>
            </div>

            {/* Manufacturer Info */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 italic">
                    By {medicine.manufacturer}
                </span>
                <button className="text-gray-300 hover:text-health-primary transition-colors">
                    <Info className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
