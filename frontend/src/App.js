import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProductView from "./pages/ProductView";
import Users from "./pages/Users";
import Address from "./pages/Address";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import Compare from "./pages/Compare";
import SellerDashboard from "./pages/SellerDashboard";

import Notifications from "./components/Notifications";
import ChatSupport from "./components/ChatSupport";

function App() {
  return (
    <>
      <Notifications />
      <ChatSupport />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/address" element={<Address />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Routes>
    </>
  );
}

export default App;