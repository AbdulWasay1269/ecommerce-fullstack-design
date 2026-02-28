import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // List view layout
  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product._id}`} className="block">
        <div className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="w-48 h-48 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-lg mb-1 truncate">{product.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-orange-500">{product.rating}</span>
              <span className="text-sm text-gray-400">&middot; {product.reviewCount} reviews</span>
            </div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors">
                <FiHeart size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view layout
  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative bg-gray-50 p-4 aspect-square flex items-center justify-center">
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-blue-500 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-800">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-orange-500">{product.rating}</span>
          </div>
          <h3 className="text-sm text-gray-600 line-clamp-2 flex-1">{product.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
