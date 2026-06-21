import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(
      (item) => item._id !== id
    );
    setWishlist(updated);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      alert("Already in cart!");
      return;
    }

    const updatedCart = [
      ...cart,
      { ...product, quantity: 1 },
    ];

    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
    alert("Added to cart!");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>❤️ My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <p>Your wishlist is empty</p>
            <Link to="/products" className="btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="wishlist-count">
              You have {wishlist.length} items in your
              wishlist
            </p>
            <div className="products">
              {wishlist.map((product) => (
                <div className="card" key={product._id}>
                  <Link
                    to={`/product/${product._id}`}
                    className="product-link"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <div className="card-content">
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <h2>{product.name}</h2>
                    </Link>

                    <h3>₹ {product.price}</h3>

                    <p className="category-tag">
                      {product.category}
                    </p>

                    <p className="stock-info">
                      Stock:{" "}
                      <span
                        style={{
                          color:
                            product.stock > 0
                              ? "#22c55e"
                              : "#ef4444",
                        }}
                      >
                        {product.stock > 0
                          ? "Available"
                          : "Out of Stock"}
                      </span>
                    </p>
                  </div>

                  <button
                    className="cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    🛒 Add To Cart
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeFromWishlist(product._id)
                    }
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Wishlist;