import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editAddress, setEditAddress] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      navigate("/");
      return;
    }

    // Initial fetch
    fetchUserOrders(user._id);

    // Auto-refresh orders every 2 seconds
    const interval = setInterval(
      () => fetchUserOrders(user._id),
      2000
    );

    // Listen for custom orders update event
    const handleOrdersUpdate = () => {
      console.log("Orders updated from admin");
      fetchUserOrders(user._id);
    };

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdate
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdate
      );
    };
  }, [navigate]);

  const fetchUserOrders = (userId) => {
    try {
      const allOrders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      const userOrders = allOrders.filter(
        (order) => {
          if (order.user?._id === userId) {
            return true;
          }
          if (order.userId === userId) {
            return true;
          }
          return false;
        }
      );

      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const canCancelOrder = (status) => {
    // Can only cancel if order is Pending or Processing
    return (
      status === "Pending" || status === "Processing"
    );
  };

  const canEditOrder = (status) => {
    // Can only edit address if order is Pending
    return status === "Pending";
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditAddress(order.address);
  };

  const handleAddressChange = (e) => {
    setEditAddress({
      ...editAddress,
      [e.target.name]: e.target.value,
    });
  };

  const updateOrderAddress = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // Update in MongoDB
      await axios.put(
        `http://localhost:5000/api/users/address/${user._id}`,
        editAddress
      );

      // Update in localStorage
      const allOrders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      const updatedOrders = allOrders.map((order) => {
        if (order._id === editingId) {
          return { ...order, address: editAddress };
        }
        return order;
      });

      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      alert("✅ Delivery address updated successfully");
      setEditingId(null);
      fetchUserOrders(user._id);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("❌ Failed to update address");
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // Try to cancel in MongoDB first
      try {
        await axios.delete(
          `http://localhost:5000/api/orders/${orderId}`
        );
      } catch (error) {
        console.log(
          "MongoDB delete failed, updating in localStorage"
        );
      }

      // Update in localStorage
      const allOrders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      const updatedOrders = allOrders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status: "Cancelled" };
        }
        return order;
      });

      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      alert("✅ Order cancelled successfully");
      fetchUserOrders(user._id);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("❌ Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Processing":
        return "#60a5fa";
      case "Shipped":
        return "#3b82f6";
      case "Out for Delivery":
        return "#8b5cf6";
      case "Delivered":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Processing":
        return "⚙️";
      case "Shipped":
        return "📦";
      case "Out for Delivery":
        return "🚚";
      case "Delivered":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "Pending":
        return 20;
      case "Processing":
        return 40;
      case "Shipped":
        return 60;
      case "Out for Delivery":
        return 80;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const statusSteps = [
    { name: "Pending", icon: "⏳" },
    { name: "Processing", icon: "⚙️" },
    { name: "Shipped", icon: "📦" },
    { name: "Out for Delivery", icon: "🚚" },
    { name: "Delivered", icon: "✅" },
  ];

  const isStatusCompleted = (
    currentStatus,
    stepName
  ) => {
    if (currentStatus === "Cancelled") return false;

    const statusOrder = [
      "Pending",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex =
      statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepName);
    return stepIndex <= currentIndex;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>📦 My Orders</h1>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-btn ${
              filter === "Pending" ? "active" : ""
            }`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${
              filter === "Processing" ? "active" : ""
            }`}
            onClick={() => setFilter("Processing")}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${
              filter === "Shipped" ? "active" : ""
            }`}
            onClick={() => setFilter("Shipped")}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${
              filter === "Out for Delivery"
                ? "active"
                : ""
            }`}
            onClick={() => setFilter("Out for Delivery")}
          >
            Out for Delivery
          </button>
          <button
            className={`filter-btn ${
              filter === "Delivered" ? "active" : ""
            }`}
            onClick={() => setFilter("Delivered")}
          >
            Delivered
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>
              {orders.length === 0
                ? "No orders yet"
                : "No orders found in this filter"}
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, index) => (
              <div className="order-card" key={index}>
                {/* Order Header */}
                <div className="order-header">
                  <div>
                    <span className="order-id">
                      Order #{orders.length - index}
                    </span>
                    <span className="order-date">
                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <span
                    className="order-status"
                    style={{
                      color: getStatusColor(
                        order.status || "Pending"
                      ),
                    }}
                  >
                    {getStatusIcon(
                      order.status || "Pending"
                    )}
                    {" "}
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* STATUS PROGRESS TRACKER */}
                <div className="status-tracker">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${getProgressPercentage(
                          order.status || "Pending"
                        )}%`,
                        backgroundColor: getStatusColor(
                          order.status || "Pending"
                        ),
                      }}
                    ></div>
                  </div>

                  <div className="status-steps">
                    {statusSteps.map((step, idx) => (
                      <div
                        className={`status-step ${
                          isStatusCompleted(
                            order.status || "Pending",
                            step.name
                          )
                            ? "completed"
                            : ""
                        } ${
                          (order.status || "Pending") ===
                          step.name
                            ? "active"
                            : ""
                        }`}
                        key={idx}
                      >
                        <div
                          className="step-icon"
                          style={{
                            backgroundColor:
                              isStatusCompleted(
                                order.status || "Pending",
                                step.name
                              )
                                ? getStatusColor(step.name)
                                : "rgba(255,255,255,0.1)",
                          }}
                        >
                          {step.icon}
                        </div>
                        <p className="step-label">
                          {step.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  <h4 style={{ marginBottom: "15px" }}>
                    📦 Items:
                  </h4>
                  {order.products &&
                  order.products.length > 0 ? (
                    order.products.map((product, idx) => (
                      <div
                        className="order-product"
                        key={idx}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="product-info">
                          <p className="product-name">
                            {product.name}
                          </p>
                          <p className="product-category">
                            {product.category}
                          </p>
                          <p className="product-qty">
                            Qty:{" "}
                            {product.quantity || 1}
                          </p>
                        </div>
                        <p className="product-price">
                          ₹ {product.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No products</p>
                  )}
                </div>

                {/* Delivery Address - Edit or View */}
                {order.address && (
                  <div className="order-address">
                    {editingId === order._id ? (
                      <div className="edit-address-form">
                        <h4>✏️ Edit Delivery Address</h4>

                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={editAddress.fullName}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={
                            editAddress.phoneNumber
                          }
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="text"
                          name="street"
                          placeholder="Street Address"
                          value={editAddress.street}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={editAddress.city}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={editAddress.state}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="text"
                          name="postalCode"
                          placeholder="Postal Code"
                          value={editAddress.postalCode}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={editAddress.country}
                          onChange={handleAddressChange}
                          className="address-input"
                        />

                        <div className="address-actions">
                          <button
                            className="save-btn"
                            onClick={updateOrderAddress}
                          >
                            Save Address
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              setEditingId(null)
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="address-title">
                          📍 Delivery Address
                        </p>
                        <p className="address-display">
                          <strong>
                            {order.address.fullName}
                          </strong>
                          <br />
                          {order.address.street}
                          <br />
                          {order.address.city},{" "}
                          {order.address.state} -
                          {order.address.postalCode}
                          <br />
                          {order.address.country}
                          <br />
                          <strong>Phone:</strong>{" "}
                          {order.address.phoneNumber}
                        </p>

                        {canEditOrder(
                          order.status || "Pending"
                        ) && (
                          <button
                            className="edit-address-btn"
                            onClick={() =>
                              startEdit(order)
                            }
                          >
                            ✏️ Edit Address
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Order Summary */}
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total Amount:</strong>
                    <span className="total-price">
                      ₹ {order.total}
                    </span>
                  </div>

                  {/* Status Messages */}
                  {(order.status || "Pending") ===
                    "Delivered" && (
                    <div className="delivery-message">
                      ✅ Order delivered successfully!
                    </div>
                  )}

                  {(order.status || "Pending") ===
                    "Out for Delivery" && (
                    <div className="delivery-message">
                      🚚 Your order is on the way!
                    </div>
                  )}

                  {(order.status || "Pending") ===
                    "Processing" && (
                    <div className="delivery-message">
                      ⚙️ Your order is being prepared!
                    </div>
                  )}

                  {(order.status || "Pending") ===
                    "Shipped" && (
                    <div className="delivery-message">
                      📦 Your order has been shipped!
                    </div>
                  )}

                  {(order.status || "Pending") ===
                    "Cancelled" && (
                    <div className="delivery-message cancel-message">
                      ❌ Order cancelled
                    </div>
                  )}

                  {/* Cancel Button */}
                  {canCancelOrder(
                    order.status || "Pending"
                  ) && (
                    <button
                      className="cancel-order-btn"
                      onClick={() =>
                        cancelOrder(order._id)
                      }
                    >
                      ❌ Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
