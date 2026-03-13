import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import "./Dashboard.css";
import "./ProductDetail.css";

function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [user, setUser] = useState(null);
    
    const { addToCart } = useCart();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(userData));
        fetchProductDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    const fetchProductDetail = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error("Gagal ambil detail produk:", error);
            alert("Produk tidak ditemukan!");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleBuyClick = () => {
        if (!product || product.stock <= 0) {
            alert("Stok habis!");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmBuy = async () => {
        setShowConfirmModal(false);
        setProcessing(true);

        try {
            const newStock = product.stock - 1;
            const { error } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', product.id);

            if (error) throw error;

            setProduct({
                ...product,
                stock: newStock
            });

            alert(`✅ Berhasil membeli ${product.title}! Stok tersisa: ${newStock}`);
        } catch (error) {
            console.error("Gagal melakukan pembelian:", error);
            alert("Gagal memproses pembelian: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleAddToCart = () => {
        if (!product || product.stock <= 0) {
            alert("Stok habis!");
            return;
        }
        
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            cover_image: product.cover_image,
            stock: product.stock
        });
        
        alert(`✅ ${product.title} ditambahkan ke keranjang!`);
    };

    if (loading) return <div className="loading">Loading detail produk...</div>;
    if (!product) return <div className="loading">Produk tidak ditemukan</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📖 Detail Produk</h1>
                <div className="user-info">
                    <span>Selamat datang, {user?.username || "Admin"}!</span>
                    <button onClick={() => navigate("/cart")} className="cart-btn">
                        🛒 Keranjang
                    </button>
                    <button onClick={handleBack} className="back-btn">
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>

            <div className="product-detail-container">
                <div className="product-detail-card">
                    <div className="product-detail-image">
                        <img 
                            src={product.cover_image || "https://via.placeholder.com/400x300?text=Buku"} 
                            alt={product.title}
                        />
                    </div>
                    
                    <div className="product-detail-info">
                        <h2>{product.title}</h2>
                        
                        <div className="detail-row">
                            <span className="detail-label">Penulis:</span>
                            <span className="detail-value">{product.author}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Kategori:</span>
                            <span className="detail-value">{product.categories?.name || '-'}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">ISBN:</span>
                            <span className="detail-value">{product.isbn || '-'}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Harga:</span>
                            <span className="detail-value price">Rp {formatPrice(product.price)}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Stok:</span>
                            <span className="detail-value stock" style={{ 
                                color: product.stock <= 0 ? '#e74c3c' : '#2C5A73'
                            }}>
                                {product.stock <= 0 ? 'Stok Habis' : `${product.stock} tersisa`}
                            </span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Deskripsi:</span>
                            <p className="detail-description">{product.description || "Tidak ada deskripsi"}</p>
                        </div>
                        
                        <div className="product-actions">
                            <button 
                                className="buy-btn-large" 
                                onClick={handleBuyClick}
                                disabled={processing || product.stock <= 0}
                                style={{
                                    opacity: (processing || product.stock <= 0) ? 0.5 : 1,
                                    background: product.stock <= 0 ? '#95a5a6' : 'var(--accent)'
                                }}
                            >
                                {processing ? '⏳ Memproses...' : 
                                 product.stock <= 0 ? '❌ Stok Habis' : '🛒 Beli Sekarang'}
                            </button>
                            <button 
                                className="cart-btn-large" 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                style={{
                                    opacity: product.stock <= 0 ? 0.5 : 1
                                }}
                            >
                                {product.stock <= 0 ? '⛔ Stok Habis' : '➕ Tambah ke Keranjang'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>🛒 Konfirmasi Pembelian</h3>
                        <div className="confirm-detail">
                            <p className="confirm-text">Apakah Anda yakin ingin membeli:</p>
                            <p className="confirm-title">{product?.title}</p>
                            <p className="confirm-price">Rp {formatPrice(product?.price)}</p>
                            <p className="confirm-stock">
                                Stok tersedia: <span className="stock-highlight">{product?.stock}</span>
                            </p>
                        </div>
                        <div className="confirm-actions">
                            <button className="confirm-btn" onClick={handleConfirmBuy}>
                                ✅ Ya, Beli
                            </button>
                            <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                                ❌ Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;