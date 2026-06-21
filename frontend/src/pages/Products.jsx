import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Products() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: "",
  });
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );
      setProducts(res.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(res.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      stock: product.stock,
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editId}`,
        editData
      );
      alert("Product Updated");
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );
      alert("Product Deleted");
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      alert("Already Added To Cart");
      return;
    }

    const updatedCart = [
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added To Cart");
  };

  const addToWishlist = (product) => {
    const exists = wishlist.find(
      (item) => item._id === product._id
    );

    if (exists) {
      const updated = wishlist.filter(
        (item) => item._id !== product._id
      );
      setWishlist(updated);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );
      alert("Removed from wishlist");
    } else {
      const updated = [...wishlist, product];
      setWishlist(updated);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );
      alert("Added to wishlist!");
    }
  };

  const filteredProducts = products
    .filter((product) =>
      filterCategory
        ? product.category === filterCategory
        : true
    )
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <Navbar />

      {user?.role === "admin" && (
        <Link to="/add-product" className="floating-btn">
          +
        </Link>
      )}

      <div className="container">
        <h1>Products</h1>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value)
              }
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        <div className="results-info">
          Found {filteredProducts.length} products
        </div>

        <div className="products">
          {filteredProducts.map((product) => (
            <div className="card" key={product._id}>
              {editId === product._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={editData.price}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={editData.category}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={editData.image}
                    onChange={handleChange}
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={editData.description}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={editData.stock}
                    onChange={handleChange}
                  />
                  <button onClick={updateProduct}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    style={{ background: "#ef4444" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/product/${product._id}`}
                    className="product-link"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="card-content">
                      <h2>{product.name}</h2>
                      <h3>₹ {product.price}</h3>
                      <p>
                        <strong>Category:</strong>{" "}
                        {product.category}
                      </p>
                      <p>{product.description}</p>
                      <p>
                        <strong>Stock:</strong>{" "}
                        {product.stock}
                      </p>
                    </div>
                  </Link>

                  {user?.role !== "admin" && (
                    <>
                      <div className="product-buttons">
                        <button
                          className="cart-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          🛒 Add To Cart
                        </button>

                        <button
                          className={`wishlist-btn ${
                            wishlist.some(
                              (item) =>
                                item._id ===
                                product._id
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToWishlist(product);
                          }}
                        >
                          {wishlist.some(
                            (item) =>
                              item._id === product._id
                          )
                            ? "❤️"
                            : "🤍"}
                        </button>

                        <Link
                          to="/address"
                          className="buy-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.setItem(
                              "buyNowProduct",
                              JSON.stringify(product)
                            );
                            window.location.href =
                              "/address";
                          }}
                        >
                          Buy Now
                        </Link>
                      </div>
                    </>
                  )}

                  {user?.role === "admin" && (
                    <div className="admin-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(product._id)
                        }
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;