import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // Load keranjang dari localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Simpan ke localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { 
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.cover_image,
                maxStock: product.stock,
                quantity: 1
            }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    };

    const toggleSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    const getSelectedTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getSelectedCount = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((count, item) => count + item.quantity, 0);
    };

    // FUNGSI BARU: Simpan transaksi ke database
    const saveTransaction = async (userData, items, total, itemCount) => {
        try {
            const transactionCode = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            
            const itemsData = items.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            }));

            const { error } = await supabase
                .from('transactions')
                .insert([{
                    transaction_code: transactionCode,
                    user_id: userData?.id || null,
                    user_email: userData?.email || 'Guest',
                    user_name: userData?.full_name || userData?.username || 'Guest',
                    total_amount: total,
                    total_items: itemCount,
                    items: itemsData,
                    status: 'completed'
                }]);

            if (error) throw error;
            
            console.log("Transaksi berhasil disimpan:", transactionCode);
            return true;
        } catch (error) {
            console.error("Gagal menyimpan transaksi:", error);
            return false;
        }
    };

    // UPDATE FUNGSI CHECKOUT
    const checkout = async () => {
        const itemsToBuy = cartItems.filter(item => selectedItems.includes(item.id));
        const total = getSelectedTotal();
        const itemCount = getSelectedCount();
        
        // Ambil data user dari localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        // Update stok di database
        for (const item of itemsToBuy) {
            const newStock = item.maxStock - item.quantity;
            const { error } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.id);

            if (error) {
                alert(`Gagal update stok ${item.title}`);
                return false;
            }
        }

        // Simpan transaksi ke database
        const saved = await saveTransaction(userData, itemsToBuy, total, itemCount);
        
        if (!saved) {
            alert("Gagal menyimpan transaksi!");
            return false;
        }

        // Hapus item yang dibeli dari keranjang
        setCartItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        
        return true;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            selectedItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            toggleSelect,
            toggleSelectAll,
            getSelectedTotal,
            getSelectedCount,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    );
};