import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token) {
            navigate("/login");
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }

        ambilProduk();
    }, [navigate]);

    const ambilProduk = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/products");
            console.log("Data produk:", response.data);
            
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Gagal ambil produk:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div className="loading">Loading produk...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard Produk</h1>
                <div className="user-info">
                    <span>Selamat datang, {user?.username || "Admin"}!</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>
            
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard 
                            key={product.id}
                            title={product.title}                          // <-- UBAH
                            description={product.description || "Tidak ada deskripsi"} // <-- UBAH
                            price={product.price?.toLocaleString() || "0"} // <-- UBAH
                            image={product.cover_image || "https://via.placeholder.com/200x150?text=Buku"} // <-- UBAH
                            author={product.author}                        // OPSIONAL
                            stock={product.stock}                          // OPSIONAL
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