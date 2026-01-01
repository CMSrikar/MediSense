const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchLabs = async (city) => {
    try {
        const url = city ? `${API_URL}/labs?city=${encodeURIComponent(city)}` : `${API_URL}/labs`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch labs');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchLabById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/labs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch lab details');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};
