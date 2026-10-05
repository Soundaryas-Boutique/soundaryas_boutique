"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const fetchCart = useCallback(async () => {
    if (status === 'authenticated') {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items);
        } else {
          console.error('Failed to fetch cart:', res.statusText);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setCartItems([]);
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    if (status !== 'authenticated') {
      alert("Please log in to add items to your cart.");
      return false;
    }

    // Update locally first for instant feedback
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, productId: product.id }];
      }
    });

    // Then, send the update to the server
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        productName: product.productName,
        price: product.discountPrice || product.price,
        quantity: 1,
        images: product.images
      }),
    });
    
    // Open the drawer after adding
    setIsCartOpen(true);
    return true; 
  };

  const updateQuantity = (productId, newQuantity) => {
    if (status !== 'authenticated') return;

    // Update the state locally for instant UI changes
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
    
    // Use debouncing to send the update to the server
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetch('/api/cart/update-quantity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newQuantity }),
      });
    }, 500); 
  };
  
  const removeFromCart = (productId) => {
    if (status !== 'authenticated') return;

    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));

    fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  };

  const clearCart = async () => {
    if (status !== 'authenticated') return;
    try {
      const res = await fetch('/api/cart/clear', { method: 'POST' });
      // fetch only rejects on network failure, so a 404 or 500 has to be
      // checked explicitly -- otherwise the list is emptied locally while the
      // rows survive, and the next fetchCart() brings them back.
      if (!res.ok) {
        throw new Error(`Failed to clear cart: ${res.status}`);
      }
      setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  };
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        loading,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};