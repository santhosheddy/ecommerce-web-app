function RatingStars({ rating, onRate }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate?.(star)}
          className={`star ${star <= rating ? "filled" : ""}`}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default RatingStars;