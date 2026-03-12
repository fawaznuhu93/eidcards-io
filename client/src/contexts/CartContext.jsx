import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('eid_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eid_cart', JSON.stringify(cart));
    
    // Update cart count and total
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    setCartTotal(total);
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, itemType) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.id === itemId && item.type === itemType)
    ));
  };

  // Update item quantity
  const updateQuantity = (itemId, itemType, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => prevCart.map(item => {
      if (item.id === itemId && item.type === itemType) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get item count
  const getItemCount = (itemId, itemType) => {
    const item = cart.find(i => i.id === itemId && i.type === itemType);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};