import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/api";
import "./ProductDetail.css";

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Failed to load product. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const displayPrice = product.isOnSale ? product.salePrice : product.price;
  const hasDiscount = product.isOnSale && product.salePrice < product.price;

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate("/")} className="back-button">
        {"\u2190"} Back to Products
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={
              product.imageUrl ||
              "https://placeholder.com"
            }
            alt={product.name}
          />
          {hasDiscount && <span className="sale-badge-large">SALE</span>}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>

          <div className="product-detail-pricing">
            {hasDiscount && (
              <span className="original-price-large">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="current-price-large">
              ${displayPrice.toFixed(2)}
            </span>
          </div>

          <div className="product-detail-stock">
            {product.currentStock > 0 ? (
              <span className="in-stock-large">
                {"\u2713"} In Stock ({product.currentStock} available)
              </span>
            ) : (
              <span className="out-of-stock-large">{"\u2717"} Out of Stock</span>
            )}
          </div>

          {/* Simple quantity counter tool block */}
          {product.currentStock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
              <label style={{ fontWeight: "600", fontSize: "15px" }}>Quantity:</label>
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{ padding: "5px 12px", cursor: "pointer", border: "1px solid #ccc", background: "#f8f9fa" }}
              >
                -
              </button>
              <span style={{ minWidth: "25px", textAlign: "center", fontWeight: "bold" }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => Math.min(product.currentStock, prev + 1))}
                style={{ padding: "5px 12px", cursor: "pointer", border: "1px solid #ccc", background: "#f8f9fa" }}
              >
                +
              </button>
              
              <button 
                onClick={() => onAddToCart(product, quantity)}
                style={{ marginLeft: "15px", background: "#007bff", color: "white", border: "none", padding: "7px 18px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
              >
                Add to Cart
              </button>
            </div>
          )}

          <div className="product-detail-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>

          <div className="product-detail-meta">
            <p>
              <strong>Product ID:</strong> {product.id}
            </p>
            <p>
              <strong>Added:</strong>{" "}
              {new Date(product.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(product.lastUpdatedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
