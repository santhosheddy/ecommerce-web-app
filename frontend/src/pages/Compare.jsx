import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Compare() {
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("compareList")
    ) || [];
    setCompare(saved);
  }, []);

  const removeFromCompare = (id) => {
    const updated = compare.filter(
      (item) => item._id !== id
    );
    setCompare(updated);
    localStorage.setItem(
      "compareList",
      JSON.stringify(updated)
    );
  };

  if (compare.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h1>Compare Products</h1>
          <p>No products to compare</p>
          <Link to="/products">Continue Shopping</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>🔄 Compare Products</h1>

        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {compare.map((product) => (
                  <th key={product._id}>{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                {compare.map((product) => (
                  <td key={product._id}>₹{product.price}</td>
                ))}
              </tr>
              <tr>
                <td>Category</td>
                {compare.map((product) => (
                  <td key={product._id}>{product.category}</td>
                ))}
              </tr>
              <tr>
                <td>Stock</td>
                {compare.map((product) => (
                  <td key={product._id}>
                    {product.stock > 0 ? "In Stock" : "Out"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Description</td>
                {compare.map((product) => (
                  <td key={product._id}>
                    {product.description}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Action</td>
                {compare.map((product) => (
                  <td key={product._id}>
                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeFromCompare(product._id)
                      }
                    >
                      Remove
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Compare;