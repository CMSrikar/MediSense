const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createTestBooking = async (payload) => {
    const response = await fetch(`${API_URL}/test-bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to create test booking');
    }

    return response.json();
};
