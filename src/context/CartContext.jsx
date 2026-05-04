import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('sks_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('sks_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => [...prev, { ...product, uniqueId: Date.now() }]);
    };

    const removeFromCart = (uniqueId) => {
        setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
    };

    const updateQuantity = (uniqueId, quantity) => {
        setCart(prev => prev.map(item => 
            item.uniqueId === uniqueId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};
