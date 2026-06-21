import { useState } from "react";
import Navbar from "../components/Navbar";

function Checkout() {

  const cart = JSON.parse(
    localStorage.getItem("cart")
  ) || [];

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    pincode: "",
    address: "",
  });

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {

    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = () => {

    const orders = JSON.parse(
      localStorage.getItem("orders")
    ) || [];

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const newOrder = {
      user,
      cart,
      address,
      total,
      date: new Date(),
    };

    orders.push(newOrder);

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    localStorage.removeItem("cart");

    alert("Order Placed Successfully");
  };

  return (
    <>

      <Navbar />

      <div className="container">

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            placeOrder();
          }}
        >

          <h2>Checkout</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
          />

          <h3>
            Total: ₹ {total}
          </h3>

          <button type="submit">
            Buy Now
          </button>

        </form>

      </div>

    </>
  );
}

export default Checkout;