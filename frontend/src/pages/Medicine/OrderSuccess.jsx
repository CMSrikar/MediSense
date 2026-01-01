import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-xl shadow-xl p-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your order. We've received your order and will begin processing it right away.
                    </p>

                    <div className="bg-health-bg rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-center space-x-2 text-health-primary mb-2">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-semibold">Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            You will receive a confirmation email with order details shortly.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="lab-btn-primary inline-flex items-center justify-center space-x-2">
                            <Home className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                        <Link to="/medicines" className="lab-btn-secondary inline-flex items-center justify-center space-x-2">
                            <ShoppingBag className="w-5 h-5" />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
