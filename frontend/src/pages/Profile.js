import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        const response = await axios.get(`http://localhost:4000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
          }
        });

        const userData = response.data;
        setUser(userData.user);
        setCart(userData.cart || []);

        // Initialize form data with user details
        setFormData({
          firstName: userData.user.firstName,
          lastName: userData.user.lastName,
          email: userData.user.email
        });

        setError(null);
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const userId = getUserId();
      const response = await axios.put(`http://localhost:4000/api/users/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });

      if (response.status === 200) {
        setUser({
          ...user,
          ...formData
        });
        setIsEditing(false);

        // Update local storage with new user info
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (authData && authData.user) {
          authData.user = {
            ...authData.user,
            ...formData
          };
          localStorage.setItem('auth', JSON.stringify(authData));
        }
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (itemId) => {
    try {
      const userId = getUserId();
      await axios.delete(`http://localhost:4000/api/users/${userId}/cart/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });

      // Update local cart state
      setCart(cart.filter(item => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item from cart. Please try again.");
      console.error("Error removing item from cart:", err);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.GameItemDetail?.price || 0), 0);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="container">
          <h1>Loading profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-content">
          <div className="profile-section user-details">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="user-info">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">User ID:</span>
                  <span className="value">{user?.id}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section cart-items">
            <h2>My Cart</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <a href="/" className="shop-link">Browse Store</a>
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
                              {item.GameItemDetail.gems > 0 && (
                                <span className="item-gems">
                                  {item.GameItemDetail.gems} gems
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p className="item-description">{item.description}</p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="item-price">
                          ${item.GameItemDetail?.price || 0}
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Items ({cart.length}):</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="checkout-btn"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem 0;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .profile-header h1 {
          margin: 0;
          color: #343a40;
          font-size: 2rem;
        }
        
        .logout-btn {
          background-color: #f8f9fa;
          color: #dc3545;
          border: 1px solid #dc3545;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .logout-btn:hover {
          background-color: #dc3545;
          color: white;
        }
        
        .profile-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .profile-content {
            grid-template-columns: 1fr;
          }
        }
        
        .profile-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2 {
          margin: 0;
          color: #343a40;
          font-size: 1.5rem;
        }
        
        .edit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .edit-btn:hover {
          background-color: #0069d9;
        }
        
        .user-info .info-item {
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .user-info .label {
          font-weight: 600;
          color: #6c757d;
          width: 100px;
          display: inline-block;
        }
        
        .user-info .value {
          color: #343a40;
        }
        
        .edit-profile-form .form-group {
          margin-bottom: 1.5rem;
        }
        
        .edit-profile-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }
        
        .edit-profile-form input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .save-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .save-btn:hover {
          background-color: #218838;
        }
        
        .cancel-btn {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .cancel-btn:hover {
          background-color: #5a6268;
        }
        
        .cart-items h2 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          color: #343a40;
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
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .shop-link:hover {
          background-color: #0069d9;
        }
        
        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .cart-item {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .cart-item-image {
          width: 120px;
          height: 120px;
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
        
        .item-gems {
          color: #4caf50;
          font-weight: 500;
        }
        
        .item-description {
          color: #6c757d;
          font-size: 0.95rem;
          margin: 0;
        }
        
        .cart-item-actions {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          min-width: 120px;
        }
        
        .item-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: #343a40;
        }
        
        .remove-btn {
          background-color: transparent;
          color: #dc3545;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        
        .remove-btn:hover {
          color: #bd2130;
          text-decoration: underline;
        }
        
        .cart-summary {
          background-color: #f8f9fa;
          padding: 1.5rem;
          border-radius: 6px;
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
        
        .checkout-btn {
          display: block;
          width: 100%;
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 500;
          margin-top: 1.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .checkout-btn:hover {
          background-color: #218838;
        }
        
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
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

export default Profile;