"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};