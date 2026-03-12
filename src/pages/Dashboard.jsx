import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        
        if (!userData) {
            navigate("/login");
            return;
        }
        
        setUser(JSON.parse(userData));
        ambilProduk();
    }, [navigate]);

    const ambilProduk = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .gt('stock', 0)
                .order('id', { ascending: false });

            if (error) throw error;
            
            console.log("Data produk:", data);
            setProducts(data || []);
        } catch (error) {
            console.error("Gagal ambil produk:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div className="loading">Loading produk...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard Toko Buku</h1>
                <div className="user-info">
                    <span>Selamat datang, {user?.username || "Admin"}!</span>
                    
                    {user?.role === 'admin' && (
                        <>
                            <button onClick={() => navigate("/products")} className="manage-btn">
                                Manajemen Produk
                            </button>
                            <button onClick={() => navigate("/users")} className="users-btn">
                                Manajemen Users
                            </button>
                        </>
                    )}
                    
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
            
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard 
                            key={product.id}
                            id={product.id}  // <-- TAMBAHKAN INI!
                            title={product.title}
                            description={product.description || "Tidak ada deskripsi"}
                            price={product.price?.toLocaleString() || "0"}
                            image={product.cover_image || "https://via.placeholder.com/200x150?text=Buku"}
                            author={product.author}
                            stock={product.stock}
                            category={product.categories?.name}
                        />
                    ))
                ) : (
                    <p>Tidak ada produk</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;