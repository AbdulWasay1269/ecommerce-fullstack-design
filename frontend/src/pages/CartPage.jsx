import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartItemCount, cartTotal } = useCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const shippingCost = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + shippingCost + tax;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={40} className="text-grey-300" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <span className="text-gray-800">Shopping Cart</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Cart ({cartItemCount} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {cart.items.map((item, index) => {
                const product = item.product;
                if (!product) return null;
                const productId = product._id || product;

                return (
                  <div
                    key={productId}
                    className={`flex gap-4 p-4 ${index !== cart.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    {/* Product Image */}
                    <Link to={`/products/${productId}`} className="shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${productId}`}
                            className="font-medium text-gray-800 hover:text-blue-500 line-clamp-1 block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {product.brand && <span>{product.brand} &middot; </span>}
                            {product.category}
                          </p>
                        </div>
                        <span className="font-bold text-gray-800 whitespace-nowrap">
                          ${(product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(productId)}
                          className="text-red-500 text-sm hover:text-red-600 flex items-center gap-1"
                        >
                          <FiTrash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <Link
                to="/products"
                className="flex items-center gap-2 text-blue-500 text-sm hover:underline"
              >
                <FiArrowLeft size={14} />
                Continue Shopping
              </Link>
              <button
                onClick={handleClearCart}
                className="text-red-500 text-sm hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-500' : ''}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {cartTotal < 100 && (
                  <p className="text-xs text-gray-400">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between font-bold text-gray-800 text-lg border-t border-gray-200 mt-4 pt-4">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              <button className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                Proceed to Checkout
              </button>

              <div className="mt-3 flex justify-center gap-3 text-gray-400">
                <img src="https://img.icons8.com/color/32/visa.png" alt="Visa" className="h-6" />
                <img src="https://img.icons8.com/color/32/mastercard.png" alt="Mastercard" className="h-6" />
                <img src="https://img.icons8.com/color/32/paypal.png" alt="PayPal" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
