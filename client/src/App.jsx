import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import CartDrawer from "./components/Cart/CartDrawer";
import CartButton from "./components/Cart/CartButton";

function App() {
  // Load saved cart items from localStorage on first load
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  
  const [showCart, setShowCart] = useState(false);

  // Auto-save cart items whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Cart operations
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.isOnSale ? item.product.salePrice : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <Router>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", background: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Store</h1>
        
        <CartButton 
          itemCount={getCartItemCount()} 
          total={getCartTotal()} 
          onClick={() => setShowCart(true)} 
        />
      </header>

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
        </Routes>
      </main>

      <CartDrawer 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        cartItems={cartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
        onClear={clearCart} 
        total={getCartTotal()} 
      />
    </Router>
  );
}

export default App;
