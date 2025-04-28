import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header_Brawl.css";

const Header_Brawl = ({ cart = [], setShowCart, showCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };



  return (
    <header className="brawl-header">
      <div className="brawl-header-container">
        <div className="brawl-logo">
          <img
            src="/img/app-icon-brawlstars.png"
            alt="Brawl Stars"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="brawl-auth-controls">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <span className="username">{currentUser?.Name || "Пользователь"}</span>
              </div>
              <div className="brawl-cart-icon" onClick={handleCartClick}>
                <span className="brawl-cart-emoji">🛒</span>
                <span className="brawl-cart-count">{cart.length}</span>
              </div>
              <button
                className="brawl-btn profile-btn"
                onClick={handleProfileClick}
              >
                Профиль
              </button>
              <button
                className="brawl-btn logout-btn"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              className="brawl-btn login-btn"
              onClick={handleLogin}
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header_Brawl;