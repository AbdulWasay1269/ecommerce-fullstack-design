import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiGrid, FiList, FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
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

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const isFeatured = searchParams.get('featured') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort
        };
        if (currentCategory) params.category = currentCategory;
        if (currentSearch) params.search = currentSearch;
        if (currentMinPrice) params.minPrice = currentMinPrice;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;
        if (isFeatured) params.featured = isFeatured;

        const response = await productAPI.getAll(params);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice, isFeatured]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when filters change (unless page itself is being updated)
    if (!updates.page) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice || isFeatured;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <span className="text-gray-800">
            {currentCategory || currentSearch ? (currentCategory || `Search: "${currentSearch}"`) : 'All Products'}
          </span>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-500 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => updateParams({ category: '' })}
                    className={`block w-full text-left text-sm px-2 py-1.5 rounded ${
                      !currentCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParams({ category: cat })}
                      className={`block w-full text-left text-sm px-2 py-1.5 rounded ${
                        currentCategory === cat ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentMinPrice}
                    onChange={(e) => updateParams({ minPrice: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentMaxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Featured Filter */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured === 'true'}
                    onChange={(e) => updateParams({ featured: e.target.checked ? 'true' : '' })}
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  Featured Products Only
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600"
                >
                  <FiFilter size={14} /> Filters
                </button>
                <p className="text-sm text-gray-500">
                  {total} items found
                  {currentSearch && <span> for "<strong>{currentSearch}</strong>"</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1.5 outline-none"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Best Rating</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    {currentCategory}
                    <button onClick={() => updateParams({ category: '' })}><FiX size={14} /></button>
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    "{currentSearch}"
                    <button onClick={() => updateParams({ search: '' })}><FiX size={14} /></button>
                  </span>
                )}
                {(currentMinPrice || currentMaxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    ${currentMinPrice || '0'} - ${currentMaxPrice || '∞'}
                    <button onClick={() => updateParams({ minPrice: '', maxPrice: '' })}><FiX size={14} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                <button
                  onClick={() => updateParams({ page: String(currentPage - 1) })}
                  disabled={currentPage <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 disabled:opacity-40 hover:border-blue-500 hover:text-blue-500"
                >
                  <FiChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => updateParams({ page: String(page) })}
                    className={`w-9 h-9 flex items-center justify-center rounded text-sm ${
                      page === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => updateParams({ page: String(currentPage + 1) })}
                  disabled={currentPage >= totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 disabled:opacity-40 hover:border-blue-500 hover:text-blue-500"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { updateParams({ category: '' }); setShowFilters(false); }}
                    className={`block w-full text-left text-sm px-2 py-1.5 rounded ${
                      !currentCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { updateParams({ category: cat }); setShowFilters(false); }}
                      className={`block w-full text-left text-sm px-2 py-1.5 rounded ${
                        currentCategory === cat ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentMinPrice}
                    onChange={(e) => updateParams({ minPrice: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-sm outline-none"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentMaxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-sm outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => { clearFilters(); setShowFilters(false); }}
                className="w-full py-2 bg-gray-100 text-gray-600 rounded text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
