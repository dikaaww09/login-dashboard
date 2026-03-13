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
                    <img src="data:image/png;base64,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" alt="Empty cart" />
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