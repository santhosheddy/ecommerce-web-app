import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users"
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = () => {
    const allOrders = JSON.parse(
      localStorage.getItem("orders")
    ) || [];
    setOrders(allOrders);

    const totalSales = allOrders.length;
    const totalRevenue = allOrders.reduce(
      (acc, order) => acc + (order.total || 0),
      0
    );
    const pendingOrders = allOrders.filter(
      (o) => o.status === "Pending"
    ).length;
    const deliveredOrders = allOrders.filter(
      (o) => o.status === "Delivered"
    ).length;

    setSalesData({
      totalSales,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>📊 Admin Dashboard</h1>

        {/* STATS CARDS */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <h3>Products</h3>
            <p className="stat-number">
              {products.length}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <h3>Total Orders</h3>
            <p className="stat-number">
              {salesData.totalSales}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Total Revenue</h3>
            <p className="stat-number">
              ₹ {salesData.totalRevenue}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <h3>Pending Orders</h3>
            <p className="stat-number">
              {salesData.pendingOrders}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h3>Delivered Orders</h3>
            <p className="stat-number">
              {salesData.deliveredOrders}
            </p>
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <h2 style={{ marginTop: "50px" }}>Products</h2>
        <div className="products">
          {products.map((product) => (
            <div className="card" key={product._id}>
              <img
                src={product.image}
                alt={product.name}
              />
              <div className="card-content">
                <h2>{product.name}</h2>
                <h3>₹ {product.price}</h3>
                <p>Stock: {product.stock}</p>
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(product._id)
                  }
                >
                  Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* USERS SECTION */}
        <h2 style={{ marginTop: "50px" }}>Users</h2>
        <div className="products">
          {users.map((u) => (
            <div className="card" key={u._id}>
              <div className="card-content">
                <h2>👤 {u.name}</h2>
                <p>{u.email}</p>
                <p>
                  Role:{" "}
                  <span
                    style={{
                      color:
                        u.role === "admin"
                          ? "#f59e0b"
                          : "#60a5fa",
                    }}
                  >
                    {u.role}
                  </span>
                </p>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(u._id)}
                >
                  Delete User
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDERS SECTION */}
        <h2 style={{ marginTop: "50px" }}>Recent Orders</h2>
        <div className="orders-table">
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <table>
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
                {orders.slice(-5).map((order, idx) => (
                  <tr key={idx}>
                    <td>#{orders.length - idx}</td>
                    <td>{order.user?.name}</td>
                    <td>₹ {order.total}</td>
                    <td>
                      <span
                        style={{
                          color:
                            order.status === "Delivered"
                              ? "#22c55e"
                              : order.status ===
                                  "Pending"
                              ? "#f59e0b"
                              : "#60a5fa",
                        }}
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
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;