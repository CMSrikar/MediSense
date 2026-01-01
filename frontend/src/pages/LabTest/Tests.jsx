import { useState, useMemo } from 'react';
import { Calendar, FlaskConical, HeartPulse, CheckCircle2, MapPin } from 'lucide-react';
import { createTestBooking } from '../../services/testBookingApi';
import { fetchLabs } from '../../services/labApi';

const Tests = () => {
    // Search & Lab Selection State
    const [locationInput, setLocationInput] = useState('');
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Booking Form State
    const [selectedCodes, setSelectedCodes] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        preferredDate: '',
        timeSlot: '',
        address: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successBooking, setSuccessBooking] = useState(null);
    const [apiError, setApiError] = useState('');

    // Derived State
    const selectedTests = useMemo(
        () => selectedLab ? selectedLab.tests.filter((t) => selectedCodes.includes(t.code)) : [],
        [selectedCodes, selectedLab],
    );

    const totalPrice = useMemo(
        () => selectedTests.reduce((sum, t) => sum + t.price, 0),
        [selectedTests],
    );

    // -- Search Handlers --

    const handleSearchLabs = async (e) => {
        e.preventDefault();
        if (!locationInput.trim()) return;

        setIsSearching(true);
        setSearchError('');
        setHasSearched(true);
        setSelectedLab(null); // Reset selection on new search

        try {
            const results = await fetchLabs(locationInput);
            setLabs(results);
        } catch (err) {
            setSearchError('Failed to fetch labs. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLab = (lab) => {
        setSelectedLab(lab);
        setSelectedCodes([]); // Reset selected tests when changing lab
        setSuccessBooking(null);
        setApiError('');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToResults = () => {
        setSelectedLab(null);
        setSuccessBooking(null);
    };

    // -- Booking Handlers --

    const handleToggleTest = (code) => {
        setSelectedCodes((prev) =>
            prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (selectedCodes.length === 0) {
            newErrors.tests = 'Please select at least one test';
        }
        if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits)';
        if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
        if (!formData.timeSlot.trim()) newErrors.timeSlot = 'Preferred time slot is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccessBooking(null);

        if (!validate()) return;
        if (!selectedLab) return;

        setIsSubmitting(true);
        try {
            const payload = {
                patientName: formData.patientName,
                email: formData.email || undefined,
                phone: formData.phone,
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender || undefined,
                labId: selectedLab._id,
                labName: selectedLab.name,
                tests: selectedTests,
                preferredDate: formData.preferredDate,
                timeSlot: formData.timeSlot,
                address: formData.address,
                notes: formData.notes || undefined,
            };

            const created = await createTestBooking(payload);
            setSuccessBooking(created);
            setSelectedCodes([]);
            setFormData({
                patientName: '',
                email: '',
                phone: '',
                age: '',
                gender: '',
                preferredDate: '',
                timeSlot: '',
                address: '',
                notes: '',
            });
        } catch (err) {
            setApiError(err.message || 'Something went wrong while booking your tests');
        } finally {
            setIsSubmitting(false);
        }
    };

    // -- Render Helpers --

    const renderSearchSection = () => (
        <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="lab-section-title mb-4">
                Find <span className="text-gradient">Diagnostic Labs</span> Near You
            </h1>
            <p className="text-gray-500 text-lg mb-8">
                Search for labs in your city to view available tests and book appointments.
            </p>

            <form onSubmit={handleSearchLabs} className="relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter your city (e.g., Mumbai, Delhi)..."
                    className="w-full pl-11 pr-32 py-4 rounded-full border border-gray-200 shadow-sm focus:border-health-primary focus:ring-2 focus:ring-health-primary/20 outline-none transition-all"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 top-2 bottom-2 bg-health-primary text-white px-6 rounded-full font-semibold hover:bg-health-primary-dark transition-colors disabled:opacity-70"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
        </div>
    );

    const renderLabResults = () => {
        if (!hasSearched) return null;

        if (labs.length === 0) {
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No labs found in "{locationInput}". Try "Palakollu", "Bhimavaram", or "Eluru".</p>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Labs in {locationInput}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {labs.map((lab) => (
                        <div key={lab._id} className="card hover:shadow-lg transition-shadow p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{lab.name}</h3>
                                    <p className="text-gray-500 text-sm flex items-center mt-1">
                                        <MapPin className="w-4 h-4 mr-1" /> {lab.address}
                                    </p>
                                </div>
                                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                    {lab.rating} ★
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                Offers {lab.tests.length} tests including {lab.tests.slice(0, 2).map(t => t.name).join(', ')}...
                            </p>
                            <button
                                onClick={() => handleSelectLab(lab)}
                                className="lab-btn-outline w-full mt-auto"
                            >
                                View Tests & Book
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBookingForm = () => (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={handleBackToResults}
                className="mb-6 flex items-center text-gray-500 hover:text-health-primary transition-colors"
            >
                ← Back to Labs
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedLab.name}</h1>
                    <p className="text-gray-500 flex items-center mt-2">
                        <MapPin className="w-5 h-5 mr-1" /> {selectedLab.address}, {selectedLab.city}
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Selected Lab
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Available tests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <FlaskConical className="w-6 h-6 text-health-secondary" />
                            <h2 className="text-xl font-bold text-gray-900">Select Tests</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Choose from the available tests at this lab.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedLab.tests.map((test) => {
                                const active = selectedCodes.includes(test.code);
                                return (
                                    <button
                                        key={test.code}
                                        type="button"
                                        onClick={() => handleToggleTest(test.code)}
                                        className={`text-left p-4 rounded-2xl border transition-all ${active
                                            ? 'border-health-primary bg-health-primary/5 shadow-md'
                                            : 'border-gray-200 hover:border-health-primary/60 hover:bg-white'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">{test.name}</p>
                                                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mt-1">
                                                    {test.category}
                                                </p>
                                            </div>
                                            {active && (
                                                <CheckCircle2 className="w-5 h-5 text-health-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="mt-3 font-bold text-health-primary">₹{test.price}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.tests && (
                            <p className="text-red-500 text-xs mt-3">{errors.tests}</p>
                        )}
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <HeartPulse className="w-6 h-6 text-health-secondary" />
                            <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Personal Info Group */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Patient Name *</label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        className={`input-modern w-full ${errors.patientName ? 'border-red-500 focus:ring-red-200' : ''}`}
                                        placeholder="e.g. Rahul Kumar"
                                    />
                                    {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`input-modern w-full ${errors.phone ? 'border-red-500 focus:ring-red-200' : ''}`}
                                        placeholder="e.g. 9876543210"
                                        maxLength={10}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (for Receipt)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-modern w-full"
                                    placeholder="e.g. rahul@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        min="1"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="input-modern w-full"
                                        placeholder="e.g. 28"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="input-modern w-full appearance-none bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date & Time Group */}
                            <div className="md:col-span-2 pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs">Schedule Appointment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="preferredDate"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.preferredDate}
                                                onChange={handleChange}
                                                className={`input-modern w-full pr-10 ${errors.preferredDate ? 'border-red-500' : ''}`}
                                            />
                                            <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                                        </div>
                                        {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Morning (8-11)', 'Afternoon (12-4)', 'Evening (5-8)'].map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, timeSlot: slot }));
                                                        if (errors.timeSlot) setErrors(prev => ({ ...prev, timeSlot: '' }));
                                                    }}
                                                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${formData.timeSlot === slot
                                                        ? 'bg-health-primary text-white border-health-primary'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-health-primary'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                        <input type="hidden" name="timeSlot" value={formData.timeSlot} />
                                        {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Address Group */}
                            <div className="md:col-span-2 pt-4 border-t border-gray-100">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
                                    <span>Address</span>
                                    <span className="text-gray-400 font-normal text-xs">(Home Collection Available)</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`input-modern w-full resize-none ${errors.address ? 'border-red-500' : ''}`}
                                    placeholder="House No, Street Area, City, Pincode"
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor's Note (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="2"
                                    className="input-modern w-full resize-none"
                                    placeholder="Any specific instructions..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking summary */}
                <div>
                    <div className="card p-6 sticky top-24 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Summary</h2>

                        <div className="space-y-2">
                            {selectedTests.length > 0 ? (
                                selectedTests.map((test) => (
                                    <div key={test.code} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{test.name}</span>
                                        <span className="font-semibold text-gray-900">₹{test.price}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No tests selected yet. Choose tests from the list.</p>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Total</span>
                                <span className="text-2xl font-bold text-health-primary">₹{totalPrice}</span>
                            </div>
                        </div>

                        {apiError && <p className="text-red-500 text-xs mt-1">{apiError}</p>}

                        {successBooking && (
                            <div className="mt-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5" />
                                <p>
                                    Your test booking has been submitted. Booking ID:{' '}
                                    <span className="font-mono font-semibold">{successBooking._id}</span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`lab-btn-primary w-full mt-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Booking...' : 'Book Tests'}
                        </button>

                        <p className="text-[11px] text-gray-400 mt-1">
                            Our team will review your request and confirm the appointment via call or SMS.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <div className="bg-health-bg min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                {!selectedLab ? (
                    <>
                        {renderSearchSection()}
                        {renderLabResults()}
                    </>
                ) : (
                    renderBookingForm()
                )}
            </div>
        </div>
    );
};

export default Tests;
