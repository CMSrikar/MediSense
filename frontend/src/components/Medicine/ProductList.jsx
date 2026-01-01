import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Filter, X, Search, SlidersHorizontal, LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// Hardcoded categories for now, can be fetched or moved to constants
const categories = [
    "All",
    "Pain Relief",
    "Antibiotics",
    "Supplements",
    "Cardiology",
    "Dermatology",
    "Pediatric"
];

const ProductList = ({ medicines }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [viewType, setViewType] = useState('grid');

    const filteredAndSortedMedicines = useMemo(() => {
        let filtered = medicines;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(med => med.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(med =>
                med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                med.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                med.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return sorted;
    }, [medicines, selectedCategory, searchQuery, sortBy]);

    return (
        <div className="bg-health-bg min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="max-w-4xl mb-12 animate-slide-up flex justify-between items-end">
                    <div>
                        <h1 className="lab-section-title mb-4">Our Medicine <span className="text-gradient">Catalog</span></h1>
                        <p className="text-gray-500 text-lg">Browse through our extensive range of high-quality medications verified by our professional team.</p>
                    </div>
                    <Link to="/cart" className="hidden lg:flex items-center space-x-2 bg-white px-6 py-3 rounded-xl shadow-glass hover:shadow-lg transition-all text-health-primary font-bold">
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {useCart().cartItems.length}
                            </span>
                        </div>
                        <span>View Cart</span>
                    </Link>
                </div>

                {/* Dynamic Toolbar */}
                <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-glass mb-10 flex flex-col lg:flex-row gap-6 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-health-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-modern pl-14 w-full border-none bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        {/* Sort */}
                        <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Sort</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent font-bold text-sm outline-none cursor-pointer pr-4"
                            >
                                <option value="name">A to Z</option>
                                <option value="price-low">Lowest Price</option>
                                <option value="price-high">Highest Price</option>
                            </select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white shadow-md text-health-primary' : 'text-gray-400'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white shadow-md text-health-primary' : 'text-gray-400'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center space-x-2 bg-health-primary text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-health-primary/20"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-64 space-y-8 ${showFilters ? 'fixed inset-0 z-[100] bg-white p-8 overflow-y-auto' : 'hidden lg:block'}`}>
                        <div className="flex items-center justify-between lg:hidden mb-8">
                            <h2 className="text-2xl font-black">Filters</h2>
                            <button onClick={() => setShowFilters(false)} className="bg-gray-100 p-2 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Categories</h3>
                            <div className="flex flex-col space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setShowFilters(false);
                                        }}
                                        className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCategory === category
                                            ? 'bg-health-primary text-white shadow-lg shadow-health-primary/20'
                                            : 'text-gray-500 hover:bg-white hover:text-health-primary'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Promotions</h3>
                            <div className="bg-gradient-to-br from-health-secondary to-health-secondary-dark p-6 rounded-2xl text-white">
                                <p className="font-black text-xl mb-2">Free Delivery</p>
                                <p className="text-sm opacity-80 mb-4">On orders above ₹500. Get your medicines fast!</p>
                                <button className="w-full bg-white text-health-secondary font-black py-2 rounded-lg text-sm">
                                    Details
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm font-bold text-gray-400">
                                Found <span className="text-gray-900">{filteredAndSortedMedicines.length}</span> Results
                            </p>
                            {selectedCategory !== 'All' && (
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className="text-xs font-black text-health-primary underline underline-offset-4"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {filteredAndSortedMedicines.length > 0 ? (
                            <div className={`grid gap-8 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {filteredAndSortedMedicines.map((medicine, i) => (
                                    <div key={medicine._id || medicine.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <ProductCard medicine={medicine} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] shadow-glass border border-dashed border-gray-200">
                                <div className="text-8xl mb-6">🔎</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No medicines match your search</h3>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Try adjusting your filters or search for something more general.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                    }}
                                    className="lab-btn-primary"
                                    style={{ backgroundColor: '#2563EB', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Floating Cart Button for Mobile */}
                <Link to="/cart" className="lg:hidden fixed bottom-6 right-6 z-50 bg-health-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-health-primary">
                            {useCart().cartItems.length}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ProductList;
