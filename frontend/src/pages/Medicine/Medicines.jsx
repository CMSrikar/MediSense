import { useState, useEffect } from 'react';
import ProductList from '../../components/Medicine/ProductList.jsx';
import { fetchMedicines } from '../../services/medicineApi.js';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMedicines = async () => {
            try {
                const data = await fetchMedicines();
                setMedicines(data);
            } catch (err) {
                setError('Failed to load medicines. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getMedicines();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-health-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-health-bg">
                <div className="text-center p-8 bg-white rounded-2xl shadow-premium">
                    <p className="text-rose-500 font-bold mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="lab-btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return <ProductList medicines={medicines} />;
};

export default Medicines;
