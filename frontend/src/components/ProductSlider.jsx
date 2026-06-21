import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featured] = useState([
    {
      id: 1,
      title: "Best Sellers",
      image: "https://via.placeholder.com/800x300?text=Best+Sellers",
    },
    {
      id: 2,
      title: "Limited Offers",
      image: "https://via.placeholder.com/800x300?text=Limited+Offers",
    },
    {
      id: 3,
      title: "New Arrivals",
      image: "https://via.placeholder.com/800x300?text=New+Arrivals",
    },
    {
      id: 4,
      title: "Trending Now",
      image: "https://via.placeholder.com/800x300?text=Trending+Now",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featured.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [featured.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featured.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featured.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-slider">
      <div className="slider-container">
        {featured.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${
              index === currentSlide ? "active" : ""
            }`}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="slide-overlay">
              <h2>{slide.title}</h2>
              <Link to="/products" className="shop-btn">
                Shop Now →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-btn prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="slider-btn next" onClick={nextSlide}>
        ❯
      </button>

      <div className="slider-dots">
        {featured.map((_, index) => (
          <button
            key={index}
            className={`dot ${
              index === currentSlide ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default ProductSlider;