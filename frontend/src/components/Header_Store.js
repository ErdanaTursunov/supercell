import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем AuthContext
import "../styles/Header_Store.css";

const Header_Store = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); // Используем контекст
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="custom-header">
      <div className="header-left">
        <img
          src="/img/store_logo.png"
          alt="Store Logo"
          className="logo-store"
          onClick={() => window.location.href = '/'}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="header-right">
        {!isAuthenticated ? (
          <button className="login-button" onClick={handleLogin}>
            Войти
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="https://cdn.id.supercell.com/assets/web/portraits/0,el_primo,234DC8,1CB7FF.png"
              alt="User Avatar"
              className="user-avatar"
              onClick={handleProfileClick}
            />
            <button className="login-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header_Store;
