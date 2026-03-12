import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";

function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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

    if (loading) return <div className="loading">Loading detail produk...</div>;

    if (!product) return <div className="loading">Produk tidak ditemukan</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📖 Detail Produk</h1>
                <div className="user-info">
                    <span>Selamat datang, {user?.username || "Admin"}!</span>
                    <button onClick={handleBack} className="back-btn">
                        ← Kembali ke Dashboard
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
                            <span className="detail-value stock">{product.stock} tersisa</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Deskripsi:</span>
                            <p className="detail-description">{product.description || "Tidak ada deskripsi"}</p>
                        </div>
                        
                        <div className="product-actions">
                            <button className="buy-btn-large">🛒 Beli Sekarang</button>
                            <button className="cart-btn-large">➕ Tambah ke Keranjang</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;