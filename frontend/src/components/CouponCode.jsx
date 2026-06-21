import { useState } from "react";
import "./CouponCode.css";

function CouponCode({ onApply }) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const VALID_COUPONS = {
    SAVE10: 10,
    SAVE20: 20,
    SAVE50: 50,
    WELCOME: 15,
  };

  const applyCoupon = () => {
    if (VALID_COUPONS[code.toUpperCase()]) {
      const discountValue = VALID_COUPONS[code.toUpperCase()];
      setDiscount(discountValue);
      onApply?.(discountValue);
      alert(`✅ Coupon applied! ${discountValue}% off`);
    } else {
      alert("❌ Invalid coupon code");
    }
  };

  return (
    <div className="coupon-section">
      <h3>Have a coupon code?</h3>
      <div className="coupon-input">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={applyCoupon}>Apply</button>
      </div>
      {discount > 0 && (
        <p className="discount-info">
          ✅ {discount}% discount applied!
        </p>
      )}
    </div>
  );
}

export default CouponCode;