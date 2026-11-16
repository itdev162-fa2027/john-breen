import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const displayPrice = product.isOnSale ? product.salePrice : product.price;

  return (
    <div className="product-card">
      {/* Route link wrapper */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="product-image">
          <img src={product.imageUrl || "https://placeholder.com"} alt={product.name} />
          {product.isOnSale && <span className="sale-badge">SALE</span>}
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">${displayPrice.toFixed(2)}</p>
          <span className="stock">In Stock ({product.currentStock})</span>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
