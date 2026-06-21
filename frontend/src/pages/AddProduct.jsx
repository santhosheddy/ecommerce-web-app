import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddProduct() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: "",
  });

  if (!user || user.role !== "admin") {
    return <h1>Access Denied</h1>;
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/products",
        formData
      );

      alert("Product Added");

      setFormData({
        name: "",
        price: "",
        category: "",
        image: "",
        description: "",
        stock: "",
      });

    } catch (error) {

      console.log(error);

      alert("Failed To Add Product");

    }
  };

  return (
    <>

      <Navbar />

      <div className="container">

        <form
          className="form"
          onSubmit={handleSubmit}
        >

          <h2>Add Product</h2>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <button type="submit">
            Add Product
          </button>

        </form>

      </div>

    </>
  );
}

export default AddProduct;