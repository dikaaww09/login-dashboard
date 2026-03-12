import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ id, title, description, price, image, author, stock, category }) {
    const navigate = useNavigate();
    
    // Format harga biar ada titik (50.000)
    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleClick = () => {
        navigate(`/product/${id}`); // <-- PINDAH KE HALAMAN DETAIL
    };

    return (
        <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className="product-image">
                <img 
                    src={image || "https://via.placeholder.com/200x150?text=Buku"} 
                    alt={title} 
                />
            </div>
            <div className="product-info">
                <h3>{title}</h3>
                {author && <p className="author">Penulis: {author}</p>}
                {category && <p className="category">Kategori: {category}</p>}
                <p className="description">{description || "Tidak ada deskripsi"}</p>
                <p className="price">Rp {formatPrice(price)}</p>
                {stock !== undefined && (
                    <p className="stock">Stok: {stock}</p>
                )}
                <button className="buy-btn">Beli Sekarang</button>
            </div>
        </div>
    );
}

export default ProductCard;