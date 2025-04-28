import React, { useState } from "react";
import "../styles/AdminDashboard.css"; // You'll need to create this CSS file

const AdminDashboard = () => {
  // Get auth data from localStorage
  const getUsername = () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      return authData?.user?.username || "Admin";
    } catch (e) {
      return "Admin";
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  return (
    <div className="admin-news-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {getUsername()}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav>
            <ul>
              <li>
                <a href="/admin" className="active">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/news">News Management</a>
              </li>
              <li>
                <a href="/admin/BrawlStars">Brawls Stars Management</a>
              </li>
              <li>
                <a href="/admin/ClashOfClans">Clash Of Clans Management</a>
              </li>
              <li>
                <a href="/admin/ClashRoyale">Clash Royale Management</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="admin-content">
          <div className="welcome-container">
            <div className="welcome-card">
              <h2>Welcome to the Admin Panel</h2>
              <p>Select a section from the sidebar to manage your content.</p>

              <div className="stats-overview">
                <div className="stat-card">
                  <h3>Brawl Stars</h3>
                  <div className="stat-icon">🏆</div>
                </div>

                <div className="stat-card">
                  <h3>Clash Royale</h3>
                  <div className="stat-icon">👑</div>
                </div>

                <div className="stat-card">
                  <h3>Clash of Clans</h3>
                  <div className="stat-icon">⚔️</div>
                </div>
              </div>

              <div className="admin-actions">
                <button className="action-button">
                  <span>Manage News</span>
                  <span className="arrow-icon">→</span>
                </button>

                <button className="action-button">
                  <span>Update Games</span>
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
