import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function SellerDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
    topProduct: {},
    recentOrders: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const products = await axios.get(
        "http://localhost:5000/api/products"
      );
      const orders = JSON.parse(
        localStorage.getItem("orders")
      ) || [];

      // Calculate stats
      const totalRevenue = orders.reduce(
        (acc, o) => acc + (o.total || 0),
        0
      );

      const topProduct =
        products.data.length > 0 ? products.data[0] : {};

      setStats({
        totalSales: orders.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        topProduct: topProduct,
        recentOrders: orders.slice(-5),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>📊 Seller Dashboard</h1>

        {/* Stats Cards */}
        <div className="seller-stats">
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <h3>Total Sales</h3>
            <p className="stat-value">
              {stats.totalSales}
            </p>
            <p className="stat-subtitle">orders</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Total Revenue</h3>
            <p className="stat-value">
              ₹ {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="stat-subtitle">earned</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <h3>Top Product</h3>
            <p className="stat-value">
              {stats.topProduct.name || "N/A"}
            </p>
            <p className="stat-subtitle">
              ₹ {stats.topProduct.price}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <h3>Pending Orders</h3>
            <p className="stat-value">
              {stats.recentOrders.filter(
                (o) => o.status === "Pending"
              ).length}
            </p>
            <p className="stat-subtitle">to process</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders-section">
          <h2>📋 Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td>
                        #{stats.recentOrders.length - idx}
                      </td>
                      <td>{order.user?.name}</td>
                      <td>₹ {order.total}</td>
                      <td>
                        <span
                          className={`status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {new Date(
                          order.date
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sales Chart (Simple Bar Chart) */}
        <div className="sales-chart-section">
          <h2>📊 Sales Overview</h2>
          <div className="simple-chart">
            <div className="chart-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${
                    (stats.totalRevenue / 100000) * 100
                  }%`,
                }}
              ></div>
              <p>Revenue</p>
            </div>
            <div className="chart-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${
                    (stats.totalSales / 50) * 100
                  }%`,
                }}
              ></div>
              <p>Orders</p>
            </div>
            <div className="chart-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${
                    stats.topProduct.stock
                      ? (stats.topProduct.stock / 100) * 100
                      : 0
                  }%`,
                }}
              ></div>
              <p>Stock</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              ➕ Add Product
            </button>
            <button className="action-btn">
              📦 Manage Orders
            </button>
            <button className="action-btn">
              📊 View Analytics
            </button>
            <button className="action-btn">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;