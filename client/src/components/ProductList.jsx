import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductSearch from "./Search/ProductSearch";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = (query = "") => {
    setLoading(true);
    // Removed /api from the endpoint paths to align with [Route("[controller]")]
    const url = query 
      ? `http://localhost:5174/products?search=${encodeURIComponent(query)}`
      : `http://localhost:5174/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error searching products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <ProductSearch onSearch={loadProducts} />

      {loading ? (
        <p>Loading catalog items...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {products.length === 0 ? (
            <p>No products found matching your search term.</p>
          ) : (
            products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;
