import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/products" className="nav-logo">
          🛍️ ShopEasy
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
        >
          ☰
        </button>

        <ul
          className={`nav-menu ${
            isMenuOpen ? "active" : ""
          }`}
        >
          <li className="nav-item">
            <Link to="/products" className="nav-link">
              Products
            </Link>
          </li>

          {/* ADMIN MENU */}
          {user?.role === "admin" && (
            <>
              <li className="nav-item">
                <Link
                  to="/add-product"
                  className="nav-link"
                >
                  ➕ Add Product
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/users"
                  className="nav-link"
                >
                  👥 Users
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/orders"
                  className="nav-link"
                >
                  📦 Orders
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link"
                >
                  📊 Dashboard
                </Link>
              </li>
            </>
          )}

          {/* USER MENU */}
          {user?.role !== "admin" && (
            <>
              <li className="nav-item">
                <Link to="/cart" className="nav-link">
                  🛒 Cart
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/wishlist"
                  className="nav-link"
                >
                  ❤️ Wishlist
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/compare"
                  className="nav-link"
                >
                  🔄 Compare
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/orders" className="nav-link">
                  📦 Orders
                </Link>
              </li>
            </>
          )}

          {/* SELLER MENU */}
          {user?.role === "seller" && (
            <li className="nav-item">
              <Link
                to="/seller-dashboard"
                className="nav-link"
              >
                📊 Dashboard
              </Link>
            </li>
          )}

          {/* PROFILE & LOGOUT */}
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              👤 Profile
            </Link>
          </li>

          <li className="nav-item">
            <button
              className="logout-btn"
              onClick={logout}
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;