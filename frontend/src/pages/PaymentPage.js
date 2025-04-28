import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const navigate = useNavigate();

  // Get user ID from local storage
  const getUserId = () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      return authData?.user?.id || 1; // Default to 1 if not found
    } catch (e) {
      return 1;
    }
  };

  // Get auth token
  const getAuthToken = () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      return authData?.token;
    } catch (e) {
      return null;
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        const token = getAuthToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;
        setUser(userData.user);
        setCart(userData.cart || []);
        setCartItems(userData.cartItems || []);
        
        setError(null);
      } catch (err) {
        setError("Failed to load cart data. Please try again later.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.GameItemDetail?.price || 0), 0);
  };

  // Handle payment process
  const handleProcessPayment = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setProcessingPayment(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication error. Please log in again.");
        setProcessingPayment(false);
        return;
      }

      // Удаляем все товары параллельно
      const deleteRequests = cartItems.map(item =>
        axios.delete(`http://localhost:4000/api/cart/items/${item.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(deleteRequests);

      setPaymentSuccess(true);
      setCart([]);

      setTimeout(() => {
        navigate("/profile");
      }, 3000);

    } catch (err) {
      setError("Payment processing failed. Please try again.");
      console.error("Error processing payment:", err);
    } finally {
      setProcessingPayment(false);
    }
  };


  if (loading) {
    return (
      <div className="payment-page loading">
        <div className="container">
          <h1>Loading payment details...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Checkout</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {paymentSuccess ? (
          <div className="success-message">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. Your order has been processed successfully.</p>
            <p className="redirect-message">You will be redirected to your profile page in a few seconds...</p>
          </div>
        ) : (
          <div className="payment-content">
            <div className="payment-section order-summary">
              <h2>Order Summary</h2>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty.</p>
                  <button onClick={() => navigate("/")} className="shop-link">Browse Store</button>
                </div>
              ) : (
                <>
                  <div className="cart-list">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          <img
                            src={`http://localhost:4000${item.imageUrl}`}
                            alt={item.name}
                          />
                        </div>
                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p className="game-badge">{item.game}</p>
                          <div className="item-meta">
                            {item.GameItemDetail && (
                              <>
                                <span className="item-type">{item.GameItemDetail.type}</span>
                                {item.GameItemDetail.rarity && (
                                  <span className={`item-rarity ${item.GameItemDetail.rarity.toLowerCase()}`}>
                                    {item.GameItemDetail.rarity}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <p className="item-description">{item.description}</p>
                        </div>
                        <div className="cart-item-price">
                          ${item.GameItemDetail?.price || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="payment-section payment-details">
              <h2>Payment Details</h2>
              <div className="payment-form">
                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <div className="payment-method-options">
                    <div className="payment-method-option selected">
                      <input type="radio" id="credit-card" name="payment-method" checked readOnly />
                      <label htmlFor="credit-card">Credit Card</label>
                    </div>
                  </div>
                </div>

                <div className="demo-notice">
                  <p>This is a demo checkout page. No actual payment will be processed.</p>
                  <p>Clicking "Complete Purchase" will simulate a successful payment.</p>
                </div>

                <div className="order-total">
                  <div className="summary-row">
                    <span>Items ({cart.length}):</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProcessPayment}
                  className="complete-purchase-btn"
                  disabled={processingPayment || cart.length === 0}
                >
                  {processingPayment ? "Processing..." : "Complete Purchase"}
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="back-btn"
                >
                  Return to Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .payment-page {
          padding: 2rem 0;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .payment-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .payment-header h1 {
          margin: 0;
          color: #343a40;
          font-size: 2rem;
        }

        .payment-content {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .payment-content {
            grid-template-columns: 1fr;
          }
        }
        
        .payment-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .payment-section h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          color: #343a40;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .cart-item {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .cart-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .cart-item-image {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }
        
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .cart-item-details {
          flex: 1;
        }
        
        .cart-item-details h3 {
          margin: 0 0 0.5rem;
          font-size: 1.2rem;
          color: #343a40;
        }
        
        .game-badge {
          display: inline-block;
          background-color: #e9ecef;
          color: #495057;
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }
        
        .item-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .item-type {
          font-weight: 500;
          color: #495057;
        }
        
        .item-rarity {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .item-rarity.legendary {
          background-color: #ffd700;
          color: #212529;
        }
        
        .item-rarity.epic {
          background-color: #9c27b0;
          color: white;
        }
        
        .item-rarity.premium {
          background-color: #1976d2;
          color: white;
        }
        
        .item-rarity.ultra {
          background-color: #ff4081;
          color: white;
        }
        
        .item-description {
          color: #6c757d;
          font-size: 0.95rem;
          margin: 0;
        }
        
        .cart-item-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: #343a40;
          min-width: 80px;
          text-align: right;
        }
        
        .empty-cart {
          text-align: center;
          padding: 2rem 0;
        }
        
        .empty-cart p {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }
        
        .shop-link {
          display: inline-block;
          background-color: #007bff;
          color: white;
          border: none;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .shop-link:hover {
          background-color: #0069d9;
        }
        
        .payment-method h3 {
          margin-top: 0;
          font-size: 1.2rem;
          color: #343a40;
          margin-bottom: 1rem;
        }
        
        .payment-method-options {
          margin-bottom: 2rem;
        }
        
        .payment-method-option {
          padding: 1rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .payment-method-option.selected {
          border-color: #007bff;
          background-color: #f0f7ff;
        }
        
        .demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .demo-notice p {
          margin: 0.5rem 0;
          color: #856404;
        }
        
        .order-total {
          margin-bottom: 2rem;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          color: #495057;
        }
        
        .summary-row.total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #dee2e6;
          font-weight: 600;
          font-size: 1.25rem;
          color: #343a40;
        }
        
        .complete-purchase-btn {
          display: block;
          width: 100%;
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .complete-purchase-btn:hover:not(:disabled) {
          background-color: #218838;
        }
        
        .complete-purchase-btn:disabled {
          background-color: #95c5a4;
          cursor: not-allowed;
        }
        
        .back-btn {
          display: block;
          width: 100%;
          background-color: transparent;
          color: #6c757d;
          border: 1px solid #6c757d;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .back-btn:hover {
          background-color: #6c757d;
          color: white;
        }
        
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
        }
        
        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 2rem;
          margin: 2rem 0;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
          text-align: center;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          color: #28a745;
        }
        
        .success-icon svg {
          width: 100%;
          height: 100%;
        }
        
        .success-message h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .success-message p {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .redirect-message {
          font-size: 0.9rem;
          color: #666;
          margin-top: 2rem;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }
      `}</style>
    </div>
  );
}

export default PaymentPage;