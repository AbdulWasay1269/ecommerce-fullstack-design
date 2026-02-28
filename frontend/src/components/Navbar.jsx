import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Mobile Phones',
  'Laptops',
  'Watches',
  'Headphones',
  'Cameras',
  'Accessories',
  'Sports & Outdoors',
  'Home & Garden'
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cartItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Welcome to our eCommerce store</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>English, USD</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-blue-500 font-bold text-xl hidden sm:block">Brand</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full border-2 border-blue-500 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 outline-none text-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-l border-blue-200 px-3 py-2 text-sm bg-white text-gray-600 outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-5 py-2 hover:bg-blue-600 transition-colors"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
                    <FiUser size={20} />
                    <span className="text-xs mt-0.5">{user.name?.split(' ')[0]}</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
                      <FiGrid size={20} />
                      <span className="text-xs mt-0.5">Admin</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors">
                    <FiLogOut size={20} />
                    <span className="text-xs mt-0.5">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
                  <FiUser size={20} />
                  <span className="text-xs mt-0.5">Sign in</span>
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors relative">
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
              <span className="text-xs mt-0.5 hidden md:block">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 p-1"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2"
            >
              <FiSearch size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Category Nav - Desktop */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm overflow-x-auto">
            <Link to="/products" className="text-gray-600 hover:text-blue-500 whitespace-nowrap transition-colors">
              All Products
            </Link>
            {categories.slice(1, 8).map(cat => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="text-gray-600 hover:text-blue-500 whitespace-nowrap transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-gray-600 hover:text-blue-500"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-500 text-white rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-blue-500 text-blue-500 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
            <div className="border-t pt-3">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Categories</p>
              {categories.slice(1).map(cat => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600 text-sm hover:text-blue-500"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
