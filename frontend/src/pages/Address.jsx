import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Address() {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
    fetchProducts();
  }, []);

  const fetchAddress = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );

      if (res.data.address) {
        setAddress(res.data.address);
      }
    } catch (error) {
      console.log("Error fetching address:", error);
    }
  };

  const fetchProducts = () => {
    let productsList = [];

    const buyNowProduct = JSON.parse(
      localStorage.getItem("buyNowProduct")
    );

    const cartProducts = JSON.parse(
      localStorage.getItem("cartProducts")
    );

    if (buyNowProduct) {
      productsList = [buyNowProduct];
    } else if (cartProducts) {
      productsList = cartProducts;
    }

    setProducts(productsList);

    const sum = productsList.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setTotal(sum);
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    // Validation
    if (
      !address.fullName ||
      !address.phoneNumber ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      alert("Please fill all address fields");
      return;
    }

    if (products.length === 0) {
      alert("No products to order");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        alert("User not found. Please login again.");
        navigate("/");
        return;
      }

      // Step 1: Save address to MongoDB
      console.log("Saving address to MongoDB...");
      const addressRes = await axios.put(
        `http://localhost:5000/api/users/address/${user._id}`,
        address
      );
      console.log("Address saved:", addressRes.data);

      // Step 2: Create order in MongoDB
      console.log("Creating order in MongoDB...");
      const orderData = {
        userId: user._id,
        products: products,
        address: address,
        total: total,
        status: "Pending",
      };

      const orderRes = await axios.post(
        "http://localhost:5000/api/orders/place",
        orderData
      );
      console.log("Order created:", orderRes.data);

      // Step 3: Save to localStorage for backup
      const orders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      orders.push({
        _id: orderRes.data.order?._id,
        products,
        address,
        user,
        total,
        date: new Date(),
        status: "Pending",
      });

      localStorage.setItem(
        "orders",
        JSON.stringify(orders)
      );

      // Step 4: Clear temporary data
      localStorage.removeItem("buyNowProduct");
      localStorage.removeItem("cartProducts");
      localStorage.removeItem("cart");

      setLoading(false);
      alert("Order Placed Successfully! ✅");
      navigate("/orders");

    } catch (error) {
      console.error("Error placing order:", error);
      
      if (error.response) {
        alert(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else if (error.request) {
        alert(
          "Network error. Please check your internet connection."
        );
      } else {
        alert("Error: " + error.message);
      }
      
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="checkout-wrapper">
          {/* Address Form - Left Side */}
          <div className="address-section">
            <h1>Delivery Address</h1>

            <div className="address-form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={address.phoneNumber}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Order Summary - Right Side - ENLARGED */}
          <div className="order-summary-large">
            <h2>📦 Order Summary</h2>

            <div className="order-items-list">
              {products.length === 0 ? (
                <p className="no-items">No items in order</p>
              ) : (
                <>
                  {products.map((product) => (
                    <div
                      className="order-item-card"
                      key={product._id}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="order-item-img"
                      />
                      <div className="order-item-info">
                        <h4>{product.name}</h4>
                        <p className="category">
                          {product.category}
                        </p>
                        <p className="price">
                          ₹ {product.price}
                        </p>
                        <p className="qty">
                          Qty: {product.quantity || 1}
                        </p>
                      </div>
                      <div className="order-item-total">
                        <p>
                          ₹{" "}
                          {product.price *
                            (product.quantity || 1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Subtotal:</span>
                <span>₹ {total}</span>
              </div>
              <div className="breakdown-row">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>
              <div className="breakdown-row">
                <span>Tax:</span>
                <span>₹ 0</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Total:</span>
                <span>₹ {total}</span>
              </div>
            </div>

            <button
              className="place-order-btn"
              onClick={saveAddress}
              disabled={loading}
            >
              {loading ? "⏳ Placing Order..." : "✓ Place Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Address;