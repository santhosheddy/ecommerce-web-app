import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/all"
      );
      setOrders(res.data);
      
      // Sync with localStorage
      syncOrdersWithLocalStorage(res.data);
    } catch (error) {
      console.log(error);
      // Fallback to localStorage
      const localOrders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];
      setOrders(localOrders);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const syncOrdersWithLocalStorage = (dbOrders) => {
    try {
      const localOrders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      // Update each local order with DB data
      const updatedOrders = localOrders.map((localOrder) => {
        // Find matching order in DB
        let matchedDbOrder = null;

        // Try to match by _id first
        matchedDbOrder = dbOrders.find(
          (order) => order._id === localOrder._id
        );

        // If not found, try to match by userId and total
        if (!matchedDbOrder) {
          matchedDbOrder = dbOrders.find(
            (order) =>
              order.userId === localOrder.user?._id &&
              order.total === localOrder.total
          );
        }

        if (matchedDbOrder) {
          return {
            ...localOrder,
            _id: matchedDbOrder._id,
            status: matchedDbOrder.status,
            products: matchedDbOrder.products || localOrder.products,
            address: matchedDbOrder.address || localOrder.address,
            total: matchedDbOrder.total,
            date: matchedDbOrder.createdAt || localOrder.date,
          };
        }

        return localOrder;
      });

      console.log("Updated orders:", updatedOrders);
      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      // Trigger storage event for other tabs
      window.dispatchEvent(
        new Event("ordersUpdated")
      );
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditStatus(order.status);
  };

  const updateOrderStatus = async () => {
    try {
      console.log(
        "Updating order:",
        editingId,
        "Status:",
        editStatus
      );

      // Update in MongoDB
      const response = await axios.put(
        `http://localhost:5000/api/orders/${editingId}`,
        { status: editStatus }
      );

      console.log("Update response:", response.data);

      // Get all orders again to sync
      const res = await axios.get(
        "http://localhost:5000/api/orders/all"
      );

      setOrders(res.data);

      // Sync with localStorage
      syncOrdersWithLocalStorage(res.data);

      alert("✅ Order status updated successfully");
      setEditingId(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert(
        "❌ Failed to update order: " +
          error.response?.data?.message
      );
    }
  };

  const cancelOrder = async (id) => {
    if (window.confirm("Cancel this order?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/orders/${id}`
        );

        // Update localStorage
        const localOrders = JSON.parse(
          localStorage.getItem("orders")
        ) || [];

        const updatedOrders = localOrders.map((order) => {
          if (order._id === id) {
            return { ...order, status: "Cancelled" };
          }
          return order;
        });

        localStorage.setItem(
          "orders",
          JSON.stringify(updatedOrders)
        );

        // Trigger storage event
        window.dispatchEvent(
          new Event("ordersUpdated")
        );

        alert("✅ Order cancelled");
        fetchOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("❌ Failed to cancel order");
      }
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

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>📦 Manage Orders</h1>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All ({orders.length})
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
              filter === "Out for Delivery" ? "active" : ""
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

        <div className="orders-management">
          {filteredOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            filteredOrders.map((order, index) => (
              <div
                className="order-management-card"
                key={order._id || index}
              >
                <div className="order-header-admin">
                  <div>
                    <h3>
                      Order #{filteredOrders.length - index}
                    </h3>
                    <p className="customer-name">
                      👤 {order.user?.name}
                    </p>
                    <p className="customer-email">
                      {order.user?.email}
                    </p>
                  </div>

                  <div
                    className="status-badge"
                    style={{
                      color: getStatusColor(order.status),
                    }}
                  >
                    {getStatusIcon(order.status)}{" "}
                    {order.status}
                  </div>
                </div>

                <div className="order-details-admin">
                  <h4>Products:</h4>
                  {order.products?.map((product, idx) => (
                    <div
                      className="product-item-admin"
                      key={idx}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                      <div>
                        <p>{product.name}</p>
                        <p>
                          Qty: {product.quantity || 1} × ₹
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}

                  <h4 style={{ marginTop: "15px" }}>
                    Delivery Address:
                  </h4>
                  <p className="address-text">
                    {order.address?.fullName}, <br />
                    {order.address?.street}, <br />
                    {order.address?.city},{" "}
                    {order.address?.state} -
                    {order.address?.postalCode}
                  </p>

                  <h4 style={{ marginTop: "15px" }}>
                    Total: ₹ {order.total}
                  </h4>
                </div>

                <div className="order-actions-admin">
                  {editingId === order._id ? (
                    <div className="status-update">
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value)
                        }
                        className="filter-select"
                      >
                        <option value="Pending">
                          Pending
                        </option>
                        <option value="Processing">
                          Processing
                        </option>
                        <option value="Shipped">
                          Shipped
                        </option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">
                          Delivered
                        </option>
                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                      <button
                        className="save-btn"
                        onClick={updateOrderStatus}
                      >
                        Save
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
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(order)}
                      >
                        ✏️ Update Status
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          cancelOrder(order._id)
                        }
                      >
                        ❌ Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AdminOrders;