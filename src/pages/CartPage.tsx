import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";

export function CartPage() {
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Vazifada so'ralgan hisoblovchi selektor:
  const total = useCartStore((state) => state.getTotalPrice());

  // Himoyalangan checkout mantig'i:
  const handleCheckout = () => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      // Login qilmagan foydalanuvchi — login sahifasiga yo'naltiriladi,
      // LEKIN savat tozalanmaydi (cartStore alohida va persist qilingan)
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }

    // Login qilgan bo'lsa — buyurtma "yaratiladi"
    useCartStore.getState().clearCart();
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <div className="cart-container">
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h2>Buyurtmangiz muvaffaqiyatli qabul qilindi!</h2>
          <p>Xaridingiz uchun rahmat. Savatingiz tozalandi.</p>
          <button
            type="button"
            className="continue-btn"
            onClick={() => {
              setOrderSuccess(false);
              navigate("/");
            }}
          >
            Mahsulotlar katalogiga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart-card">
          <div className="empty-icon">🛒</div>
          <h2>Savatingiz bo'sh</h2>
          <p>Hozircha savatga hech qanday mahsulot qo'shmadingiz.</p>
          <Link to="/" className="continue-btn">
            Xarid qilishni boshlash
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="page-header">
        <h1>Savat</h1>
        <p>Tanlangan mahsulotlar va buyurtma berish</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.productId} className="cart-item-row">
              <div className="cart-item-info">
                <h4>{item.title}</h4>
                <span className="cart-item-unit-price">${item.price} / dona</span>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => decreaseQuantity(item.productId)}
                    title="Kamaytirish"
                  >
                    -
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => increaseQuantity(item.productId)}
                    title="Oshirish"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  ${item.price * item.quantity}
                </div>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeItem(item.productId)}
                  title="Savatdan o'chirish"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          <div className="cart-actions-bottom">
            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Savatni tozalash
            </button>
          </div>
        </div>

        <aside className="cart-summary-card">
          <h3>Buyurtma tafsilotlari</h3>

          <div className="summary-row">
            <span>Mahsulotlar soni:</span>
            <span>
              {items.reduce((sum, item) => sum + item.quantity, 0)} ta
            </span>
          </div>

          <div className="summary-row summary-total">
            <span>Jami narx:</span>
            <span>${total}</span>
          </div>

          <button
            type="button"
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Buyurtma berish (Checkout)
          </button>

          <p className="checkout-hint">
            * Buyurtma berish uchun tizimga kirgan bo'lishingiz kerak.
          </p>
        </aside>
      </div>
    </div>
  );
}
