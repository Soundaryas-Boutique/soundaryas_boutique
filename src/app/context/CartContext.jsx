"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage or database (for persistence)
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Function to determine if two items are the same based on _id AND selectedColor
  const getItemIdentifier = (item) => {
    // If selectedColor exists, use it to distinguish variants
    return `${item._id}_${item.selectedColor || ''}`;
  };


  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // ✅ CRITICAL FIX: Use a unique identifier (ID + Color) to check for existence
      const identifier = getItemIdentifier(product);

      // Check if the item already exists in the cart.
      const existingItem = prevItems.find((item) => getItemIdentifier(item) === identifier);

      if (existingItem) {
        // If it exists, increase the quantity of that specific variant
        return prevItems.map((item) =>
          getItemIdentifier(item) === identifier
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If not, add the new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (id, color) => {
    const identifierToRemove = `${id}_${color || ''}`;
    setCartItems((prevItems) => 
        prevItems.filter((item) => getItemIdentifier(item) !== identifierToRemove)
    );
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id, color, newQuantity) => {
    const identifierToUpdate = `${id}_${color || ''}`;
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        getItemIdentifier(item) === identifierToUpdate
          ? { ...item, quantity: newQuantity } 
          : item
      );
      // Filter out items with quantity <= 0
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