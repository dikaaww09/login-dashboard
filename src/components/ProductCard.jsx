import "./ProductCard.css";

function ProductCard({ title, description, price, image, author, stock }) {
    // Format harga biar ada titik (50.000)
    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img 
                    src={image || "https://via.placeholder.com/200x150?text=Buku"} 
                    alt={title} 
                />
            </div>
            <div className="product-info">
                <h3>{title}</h3>
                {author && <p className="author">Penulis: {author}</p>}
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