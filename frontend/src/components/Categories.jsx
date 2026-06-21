import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👔" },
    { name: "Home", icon: "🏠" },
    { name: "Books", icon: "📚" },
    { name: "Sports", icon: "⚽" },
    { name: "Beauty", icon: "💄" },
    { name: "Toys", icon: "🧸" },
    { name: "More", icon: "📂" },
  ];

  return (
    <div className="categories-container">
      <h3>Shop by Category</h3>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={`/products?category=${cat.name}`}
            className="category-card"
          >
            <div className="category-icon">
              {cat.icon}
            </div>
            <p>{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;