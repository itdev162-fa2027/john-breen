import "./CartDrawer.css";

function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onClear, total }) {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const currentPrice = item.product.isOnSale ? item.product.salePrice : item.product.price;
              return (
                <div key={item.product.id} className="cart-item-row">
                  <div>
                    <h4>{item.product.name}</h4>
                    <p>${currentPrice.toFixed(2)} each</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    <button className="remove-btn" onClick={() => onRemove(item.product.id)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="clear-btn" onClick={onClear}>Clear Everything</button>
            <button className="checkout-btn">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
