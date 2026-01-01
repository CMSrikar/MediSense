
const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const fetchMedicines = async () => {
    const res = await fetch(`${BACKEND_URL}/api/medicines`);
    if (!res.ok) {
        throw new Error('Failed to fetch medicines');
    }
    return await res.json();
};

export const fetchMedicineById = async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/medicines/${id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch medicine');
    }
    return await res.json();
};
