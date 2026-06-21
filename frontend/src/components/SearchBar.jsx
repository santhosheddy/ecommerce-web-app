import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearch(value);

    if (value.length > 0) {
      const products = JSON.parse(
        localStorage.getItem("allProducts")
      ) || [];

      const filtered = products
        .filter((p) =>
          p.name
            .toLowerCase()
            .includes(value.toLowerCase())
        )
        .slice(0, 5);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setSearch("");
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="suggestion-item"
              onClick={() =>
                handleSuggestionClick(product)
              }
            >
              <img src={product.image} alt={product.name} />
              <div className="suggestion-info">
                <p className="suggestion-name">
                  {product.name}
                </p>
                <p className="suggestion-price">
                  ₹ {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;