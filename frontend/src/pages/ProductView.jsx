import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const fetchReviews = useCallback(() => {
    const saved = JSON.parse(
      localStorage.getItem(`reviews_${id}`)
    ) || [];
    setReviews(saved);
  }, [id]);

  const checkWishlist = useCallback(() => {
    const saved = JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];
    setWishlist(saved);
    const inWishlist = saved.some(
      (item) => item._id === id
    );
    setIsInWishlist(inWishlist);
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      });

    fetchReviews();
    checkWishlist();
  }, [id, fetchReviews, checkWishlist]);

  const addToCart = () => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find(
      (item) => item._id === product._id
    );

    if (exists) {
      alert("Already in cart!");
      return;
    }

    cart.push({
      ...product,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added To Cart");
  };

  const addToWishlist = () => {
    if (isInWishlist) {
      const updated = wishlist.filter(
        (item) => item._id !== product._id
      );
      setWishlist(updated);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );
      setIsInWishlist(false);
      alert("Removed from wishlist");
    } else {
      const updated = [...wishlist, product];
      setWishlist(updated);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );
      setIsInWishlist(true);
      alert("Added to wishlist!");
    }
  };

  const addReview = () => {
    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const newReview = {
      userId: user._id,
      userName: user.name,
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };

    const allReviews = [
      ...reviews,
      newReview,
    ];
    setReviews(allReviews);
    localStorage.setItem(
      `reviews_${id}`,
      JSON.stringify(allReviews)
    );

    setReviewText("");
    setRating(5);
    alert("Review added successfully!");
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, rev) => acc + rev.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  if (!product) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="product-view">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="rating-section">
            <span className="stars">
              {"⭐".repeat(Math.round(avgRating))}
            </span>
            <span className="rating-text">
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>

          <h2>₹ {product.price}</h2>

          <p className="category">
            <strong>Category:</strong> {product.category}
          </p>

          <p className="description">
            {product.description}
          </p>

          <p className="stock">
            <strong>Stock:</strong>
            <span
              style={{
                color:
                  product.stock > 0
                    ? "#22c55e"
                    : "#ef4444",
                marginLeft: "10px",
              }}
            >
              {product.stock > 0
                ? `${product.stock} Available`
                : "Out of Stock"}
            </span>
          </p>

          <div className="action-buttons">
            <button
              className="cart-btn"
              onClick={addToCart}
              disabled={product.stock <= 0}
            >
              🛒 Add To Cart
            </button>

            <button
              className={`wishlist-btn ${
                isInWishlist ? "active" : ""
              }`}
              onClick={addToWishlist}
            >
              {isInWishlist ? "❤️" : "🤍"} Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="container">
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {/* ADD REVIEW FORM */}
          <div className="add-review-form">
            <h3>Leave a Review</h3>

            <div className="rating-input">
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) =>
                  setRating(parseInt(e.target.value))
                }
              >
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">
                  ⭐⭐⭐⭐ Good
                </option>
                <option value="3">
                  ⭐⭐⭐ Average
                </option>
                <option value="2">
                  ⭐⭐ Poor
                </option>
                <option value="1">⭐ Terrible</option>
              </select>
            </div>

            <textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) =>
                setReviewText(e.target.value)
              }
              rows="5"
              className="review-textarea"
            />

            <button
              className="submit-review-btn"
              onClick={addReview}
            >
              Submit Review
            </button>
          </div>

          {/* DISPLAY REVIEWS */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, index) => (
                <div className="review-card" key={index}>
                  <div className="review-header">
                    <strong>{review.userName}</strong>
                    <span className="review-date">
                      {review.date}
                    </span>
                  </div>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="review-text">
                    {review.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductView;