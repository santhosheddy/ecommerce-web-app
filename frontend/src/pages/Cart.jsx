import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = useCallback(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart")
    ) || [];
    setCart(cartData);
    calculateTotal(cartData);
  }, []);

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );
    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
    calculateTotal(updatedCart);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
    calculateTotal(updatedCart);
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Store cart items as products to order
    localStorage.setItem(
      "cartProducts",
      JSON.stringify(cart)
    );

    navigate("/address");
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>🛒 Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item._id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>₹ {item.price}</p>
                    <p>Category: {item.category}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item._id,
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <p>
                      ₹{" "}
                      {item.price *
                        item.quantity}
                    </p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <p>
                Total Items: {cart.length}
              </p>
              <h3>Total: ₹ {total}</h3>

              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                ✓ Buy Now
              </button>

              <Link
                to="/products"
                className="continue-shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;