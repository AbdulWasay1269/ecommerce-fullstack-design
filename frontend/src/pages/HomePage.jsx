import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeadphones, FiSmartphone, FiWatch, FiMonitor, FiCamera, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryIcons = {
  'Electronics': <FiMonitor size={24} />,
  'Mobile Phones': <FiSmartphone size={24} />,
  'Laptops': <FiMonitor size={24} />,
  'Watches': <FiWatch size={24} />,
  'Headphones': <FiHeadphones size={24} />,
  'Cameras': <FiCamera size={24} />,
  'Clothing': <FiShoppingBag size={24} />,
  'Accessories': <FiShoppingBag size={24} />,
  'Sports & Outdoors': <FiShoppingBag size={24} />,
  'Home & Garden': <FiMonitor size={24} />
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ limit: 10 })
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setRecommendedProducts(allRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <LoadingSpinner />;

  const categories = [
    'Electronics', 'Mobile Phones', 'Laptops', 'Watches',
    'Headphones', 'Cameras', 'Clothing', 'Accessories'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Categories - Desktop */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-0 overflow-hidden">
            <nav className="py-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  {categoryIcons[cat]}
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Banner */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-8 flex items-center min-h-[300px] relative overflow-hidden">
            <div className="relative z-10 text-white">
              <p className="text-sm mb-2 opacity-90">Latest trending</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Electronic Items</h1>
              <Link
                to="/products?category=Electronics"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Learn More <FiArrowRight />
              </Link>
            </div>
            <div className="absolute right-4 bottom-4 opacity-20">
              <FiMonitor size={150} />
            </div>
          </div>

          {/* Side banners */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-orange-50 rounded-lg p-5 flex-1 flex flex-col justify-center">
              <p className="text-sm text-gray-500">Summer Sale</p>
              <h3 className="font-semibold text-gray-800">Smart Watches</h3>
              <p className="text-xs text-red-500 font-medium mt-1">FROM $149</p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 flex-1 flex flex-col justify-center">
              <p className="text-sm text-gray-500">New Arrival</p>
              <h3 className="font-semibold text-gray-800">Headphones</h3>
              <p className="text-xs text-green-600 font-medium mt-1">BEST DEALS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals & Offers */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side */}
            <div className="p-6 md:w-64 bg-white flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Deals and offers</h2>
              <p className="text-sm text-gray-500 mt-1">Hygiene equipments</p>
              <div className="flex gap-2 mt-4">
                {['04', '13', '34', '56'].map((val, idx) => (
                  <div key={idx} className="bg-gray-700 text-white text-center rounded px-2 py-1">
                    <span className="text-lg font-bold">{val}</span>
                    <p className="text-[10px] opacity-70">{['Days', 'Hour', 'Min', 'Sec'][idx]}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Product thumbnails */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-gray-200">
              {featuredProducts.slice(0, 5).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain mb-2"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                  />
                  <p className="text-sm text-gray-700 line-clamp-1">{product.name}</p>
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-1">
                    -{product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 10}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid for Mobile */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-lg text-center hover:border-blue-300 transition-colors"
            >
              <div className="text-blue-500">{categoryIcons[cat]}</div>
              <span className="text-[10px] text-gray-600 line-clamp-1">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products?featured=true" className="text-blue-500 text-sm hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.slice(0, 10).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Request for Quotation Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">An easy way to send requests to all suppliers</h2>
            <p className="text-sm opacity-90">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Recommended Items */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Our Extra Services */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Our extra services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Source from Industry Hubs', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', color: 'bg-blue-50' },
            { title: 'Customize Your Products', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300', color: 'bg-orange-50' },
            { title: 'Fast, Reliable Shipping', img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=300', color: 'bg-green-50' },
            { title: 'Product Monitoring', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300', color: 'bg-purple-50' }
          ].map((service, idx) => (
            <div key={idx} className={`${service.color} rounded-lg overflow-hidden group`}>
              <div className="h-32 md:h-40 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="p-3 text-sm font-medium text-gray-700">{service.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Region */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Explore by region</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { flag: '🇦🇪', name: 'UAE' },
            { flag: '🇺🇸', name: 'United States' },
            { flag: '🇬🇧', name: 'United Kingdom' },
            { flag: '🇩🇪', name: 'Germany' },
            { flag: '🇨🇳', name: 'China' },
            { flag: '🇯🇵', name: 'Japan' }
          ].map((region, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 cursor-pointer">
              <span className="text-lg">{region.flag}</span>
              <span>{region.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
