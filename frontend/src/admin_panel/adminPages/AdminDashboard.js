import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css"; // You'll need to create this CSS file
import axios from "axios";


const AdminDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding/editing news
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    subtitle: "",
    date: new Date().toISOString().split('T')[0], // Add current date as default
    game: "", // Default game
    images: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Fetch news
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios('http://localhost:4000/api/news');
      setNews(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Create new news
  const handleCreateNews = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('game', formData.game);

    // Append each selected file
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
    }

    try {
      const response = await axios.post('http://localhost:4000/api/news', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        },
      });

      if (response.status === 201) {
        fetchNews(); // Refresh the news list
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Error creating news");
    }
  };

  // Update existing news
  const handleUpdateNews = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('game', formData.game);

    // Append each selected file for new images
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
    }

    // Handle image deletion
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(img => {
        formDataToSend.append('imagesToDelete', img);
      });
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/news/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        },
      });

      if (response.status === 200) {
        fetchNews(); // Refresh the news list
        resetForm();
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message || "Error updating news");
    }
  };

  // Delete news
  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:4000/api/news/${id}`);

      if (response.status === 200) {
        setNews(news.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(err.message || "Error deleting news");
    }
  };

  // Handle selecting an image to delete (for editing existing news)
  const handleToggleImageDelete = (imagePath) => {
    if (imagesToDelete.includes(imagePath)) {
      setImagesToDelete(imagesToDelete.filter(img => img !== imagePath));
    } else {
      setImagesToDelete([...imagesToDelete, imagePath]);
    }
  };

  // Edit news - prepare form for editing
  const handleEditNews = (newsItem) => {
    setFormData({
      id: newsItem.id,
      title: newsItem.title,
      subtitle: newsItem.subtitle,
      date: newsItem.date,
      game: newsItem.game,
      images: newsItem.image || [] // Use the existing image array from backend
    });
    setIsEditing(true);
    setSelectedFiles([]);
    setImagesToDelete([]);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      subtitle: "",
      date: new Date().toISOString().split('T')[0],
      game: "",
      images: []
    });
    setSelectedFiles([]);
    setImagesToDelete([]);
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  // Get auth data from localStorage
  const getUsername = () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
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
        <h1>News Management</h1>
        <div className="admin-user-info">
          <span>Welcome, {getUsername()}</span>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav>
            <ul>
              <li>
                <a href="/admin" className="active">Dashboard</a>
              </li>
              <li>
                <a href="/admin/news" >News Management</a>
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
          {error && <div className="error-message">{error}</div>}

          <div className="news-form-container">
            <h2>{isEditing ? 'Edit News' : 'Add New News'}</h2>
            <form onSubmit={isEditing ? handleUpdateNews : handleCreateNews}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subtitle">Subtitle</label>
                <textarea
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="game">Game</label>
                <select
                  id="game"
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                >
                  <option value="Brawl Stars">Brawl Stars</option>
                  <option value="Clash Royale">Clash Royale</option>
                  <option value="Clash Of Clans">Clash of Clans</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="images">Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                />
                <small>You can select multiple images</small>
              </div>

              {/* Display current images when editing */}
              {isEditing && formData.images.length > 0 && (
                <div className="current-images">
                  <p>Current Images:</p>
                  <div className="image-preview-container">
                    {formData.images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img
                          src={`http://localhost:4000${img}`}
                          alt={`News image ${index + 1}`}
                          style={{
                            width: '100px',
                            opacity: imagesToDelete.includes(img) ? 0.3 : 1
                          }}
                        />
                        <button
                          type="button"
                          className={imagesToDelete.includes(img) ? "btn-restore" : "btn-remove"}
                          onClick={() => handleToggleImageDelete(img)}
                        >
                          {imagesToDelete.includes(img) ? "Restore" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Update' : 'Create'}
                </button>
                {isEditing && (
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="news-list">
            <h2>News Items</h2>
            {loading ? (
              <p>Loading...</p>
            ) : news.length === 0 ? (
              <p>No news items found.</p>
            ) : (
              <table className="news-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Game</th>
                    <th>Date</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.game}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>
                        {item.image && item.image.length > 0 ? (
                          <span>{item.image.length} image(s)</span>
                        ) : (
                          <span>No images</span>
                        )}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditNews(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteNews(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;