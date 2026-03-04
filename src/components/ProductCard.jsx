import "./ProductCard.css";

function ProductCard({ title, description, price, image }) {
    return (
        <div className="product-card">
            <div className="product-image">
                <img src={image} alt={title} />
            </div>
            <div className="product-info">
                <h3>{title}</h3>
                <p className="description">{description}</p>
                <p className="price">Rp {price}</p>
                <button className="buy-btn">Beli Sekarang</button>
            </div>
        </div>
    );
}

export default ProductCard;