import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false); // <-- TAMBAH STATE
    
    const {
        cartItems,
        selectedItems,
        updateQuantity,
        removeFromCart,
        toggleSelect,
        toggleSelectAll,
        getSelectedTotal,
        getSelectedCount,
        checkout
    } = useCart();

    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleCheckoutClick = () => {
        if (selectedItems.length === 0) {
            alert("Pilih minimal satu produk!");
            return;
        }
        setShowCheckoutModal(true); // <-- TAMPILIN MODAL
    };

    const handleConfirmCheckout = async () => {
        setShowCheckoutModal(false);
        setProcessing(true);
        
        const success = await checkout();
        setProcessing(false);

        if (success) {
            alert("✅ Pembelian berhasil! Stok telah diperbarui.");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="cart-header">
                    <h1>🛒 Keranjang Belanja</h1>
                    <button onClick={() => navigate("/dashboard")} className="back-btn">
                        Kembali Belanja
                    </button>
                </div>
                <div className="empty-cart">
                    <img src="https://via.placeholder.com/200x200?text=Keranjang+Kosong" alt="Empty cart" />
                    <h2>Keranjangmu masih kosong</h2>
                    <p>Yuk, belanja buku-buku menarik di toko kami!</p>
                    <button onClick={() => navigate("/dashboard")} className="shop-btn">
                        🛍️ Mulai Belanja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>🛒 Keranjang Belanja</h1>
                <button onClick={() => navigate("/dashboard")} className="back-btn">
                    Kembali Belanja
                </button>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    <div className="cart-select-all">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === cartItems.length}
                                onChange={toggleSelectAll}
                            />
                            <span className="checkmark"></span>
                            Pilih Semua ({cartItems.length} item)
                        </label>
                    </div>

                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-select">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => toggleSelect(item.id)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <div className="item-image" onClick={() => navigate(`/product/${item.id}`)}>
                                <img src={item.image || "https://via.placeholder.com/80x100?text=Buku"} alt={item.title} />
                            </div>

                            <div className="item-details">
                                <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.title}</h3>
                                <p className="item-price">Rp {formatPrice(item.price)}</p>
                                <p className="item-stock">Stok: {item.maxStock}</p>
                            </div>

                            <div className="item-quantity">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >-</button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxStock}
                                >+</button>
                            </div>

                            <div className="item-total">
                                Rp {formatPrice(item.price * item.quantity)}
                            </div>

                            <button 
                                className="item-remove"
                                onClick={() => removeFromCart(item.id)}
                                title="Hapus"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Ringkasan Belanja</h3>
                    
                    <div className="summary-row">
                        <span>Total Harga</span>
                        <span className="summary-price">
                            Rp {formatPrice(getSelectedTotal())}
                        </span>
                    </div>
                    
                    <div className="summary-row">
                        <span>Total Item</span>
                        <span className="summary-count">
                            {getSelectedCount()} item
                        </span>
                    </div>
                    
                    <button 
                        className="checkout-btn"
                        onClick={handleCheckoutClick}
                        disabled={processing || selectedItems.length === 0}
                    >
                        {processing ? '⏳ Memproses...' : '✅ Checkout'}
                    </button>
                </div>
            </div>

            {/* MODAL KONFIRMASI CHECKOUT */}
            {showCheckoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>🛒 Konfirmasi Checkout</h3>
                        
                        <div className="confirm-detail">
                            <p className="confirm-text">Anda akan membeli:</p>
                            <p className="confirm-title">{getSelectedCount()} item</p>
                            <p className="confirm-price">Rp {formatPrice(getSelectedTotal())}</p>
                            
                            <div className="checkout-items">
                                {cartItems
                                    .filter(item => selectedItems.includes(item.id))
                                    .map(item => (
                                        <div key={item.id} className="checkout-item">
                                            <span>{item.title} x{item.quantity}</span>
                                            <span>Rp {formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        <div className="confirm-actions">
                            <button 
                                className="confirm-btn"
                                onClick={handleConfirmCheckout}
                                disabled={processing}
                            >
                                {processing ? '⏳ Memproses...' : '✅ Ya, Checkout'}
                            </button>
                            <button 
                                className="cancel-btn"
                                onClick={() => setShowCheckoutModal(false)}
                                disabled={processing}
                            >
                                ❌ Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;