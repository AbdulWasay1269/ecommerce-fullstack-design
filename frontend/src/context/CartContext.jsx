import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage for guests, from API for logged-in users
  const fetchCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await cartAPI.get();
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart({ items: [] });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage
  const saveGuestCart = (cartData) => {
    localStorage.setItem('guestCart', JSON.stringify(cartData));
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const response = await cartAPI.addItem(product._id, quantity);
        setCart(response.data.cart);
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    } else {
      // Guest cart using localStorage
      const newCart = { ...cart };
      const existingItem = newCart.items.find(
        item => (item.product?._id || item.product) === product._id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        newCart.items.push({ product, quantity });
      }
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      try {
        const response = await cartAPI.updateItem(productId, quantity);
        setCart(response.data.cart);
      } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
      }
    } else {
      const newCart = { ...cart };
      if (quantity <= 0) {
        newCart.items = newCart.items.filter(
          item => (item.product?._id || item.product) !== productId
        );
      } else {
        const item = newCart.items.find(
          item => (item.product?._id || item.product) === productId
        );
        if (item) item.quantity = quantity;
      }
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const response = await cartAPI.removeItem(productId);
        setCart(response.data.cart);
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    } else {
      const newCart = { ...cart };
      newCart.items = newCart.items.filter(
        item => (item.product?._id || item.product) !== productId
      );
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clear();
        setCart({ items: [] });
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } else {
      setCart({ items: [] });
      localStorage.removeItem('guestCart');
    }
  };

  const cartItemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartTotal = cart.items?.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartItemCount,
      cartTotal,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
