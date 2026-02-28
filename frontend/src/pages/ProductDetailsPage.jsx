import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiCheck, FiChevronRight, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
        setSelectedImage(0);
        setQuantity(1);

        // Fetch related products
        if (response.data.category) {
          const relatedRes = await productAPI.getAll({
            category: response.data.category,
            limit: 5
          });
          setRelatedProducts(
            relatedRes.data.products.filter(p => p._id !== id)
          );
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl text-gray-800 mb-2">Product not found</h2>
        <Link to="/products" className="text-blue-500 hover:underline">Browse products</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-blue-500 whitespace-nowrap">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-blue-500 whitespace-nowrap">Products</Link>
          <FiChevronRight size={14} />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-500 whitespace-nowrap">
            {product.category}
          </Link>
          <FiChevronRight size={14} />
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>

        {/* Product Detail Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {/* Image Gallery */}
            <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                        selectedImage === idx ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <FiCheck size={14} /> In stock
                  </span>
                ) : (
                  <span className="text-sm text-red-500">Out of stock</span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-orange-500">{product.rating}</span>
                <span className="text-sm text-gray-400">&middot; {product.reviewCount} reviews</span>
                <span className="text-sm text-gray-400">&middot; {product.stock} sold</span>
              </div>

              {/* Price */}
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-red-500">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="text-sm text-red-500">-{discount}% off</span>
                    </>
                  )}
                </div>
              </div>

              {/* Details Table */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-gray-500 w-28">Brand</td>
                      <td className="py-2 text-gray-800">{product.brand || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-gray-500">Category</td>
                      <td className="py-2 text-gray-800">{product.category}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-gray-500">Stock</td>
                      <td className="py-2 text-gray-800">{product.stock} units</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Features */}
              {product.features?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Key Features</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <FiCheck size={14} className="text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Action Sidebar */}
            <div className="p-4 md:p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {/* Supplier Info */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-sm">
                    {product.brand?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.brand || 'Supplier'}</p>
                    <p className="text-xs text-gray-500">Verified Seller</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button className="w-full py-2.5 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <FiHeart size={16} />
                    Save for Later
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FiTruck className="text-gray-400 shrink-0" size={18} />
                  <div>
                    <p className="text-gray-800">Free Delivery</p>
                    <p className="text-xs text-gray-500">Estimated: 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiShield className="text-gray-400 shrink-0" size={18} />
                  <div>
                    <p className="text-gray-800">Warranty</p>
                    <p className="text-xs text-gray-500">1 year manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiRefreshCw className="text-gray-400 shrink-0" size={18} />
                  <div>
                    <p className="text-gray-800">Free Returns</p>
                    <p className="text-xs text-gray-500">Within 30 days of delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="font-bold text-lg">Super discount on more than 100 USD</h3>
            <p className="text-sm opacity-90">Have you ever finally just gave in to that mail?</p>
          </div>
          <Link
            to="/products"
            className="bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors whitespace-nowrap"
          >
            Shop Now
          </Link>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Saved for Later section */}
        <section className="mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
