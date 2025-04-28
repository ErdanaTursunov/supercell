import React, { useState, useEffect } from "react";
import axios from "axios";

const ClashOfClans = () => {
  const [gameItems, setGameItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding/editing game items
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    gems: 0,
    type: "skin", // Default type (only skin or pass)
    rarity: "Premium", // Default rarity
    game: "Clash Of Clans", // Always "Clash Of Clans"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch game items
  useEffect(() => {
    fetchGameItems();
  }, []);

  const fetchGameItems = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `${process.env.REACT_APP_API_URL}/api/game/items`,
      );
      setGameItems(
        response.data.filter((item) => item.game === "Clash Of Clans"),
      );
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
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Create new game item
  const handleCreateGameItem = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("game", "Clash Of Clans"); // Always set to Clash Of Clans

    // Create and append details as JSON string with rarity included
    const details = JSON.stringify({
      price: parseInt(formData.price),
      type: formData.type,
      rarity: formData.rarity,
      gems: parseInt(formData.gems),
    });
    formDataToSend.append("details", details);

    // Append image file if selected
    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/game/items`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );

      if (response.status === 201) {
        fetchGameItems(); // Refresh the items list
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Error creating game item");
    }
  };

  // Update existing game item
  const handleUpdateGameItem = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("game", "Clash Of Clans"); // Always set to Clash Of Clans

    // Create and append details as JSON string with rarity included
    const details = JSON.stringify({
      price: parseInt(formData.price),
      type: formData.type,
      rarity: formData.rarity,
      gems: parseInt(formData.gems),
    });
    formDataToSend.append("details", details);

    // Append image file if selected
    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/game/items/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );

      if (response.status === 200) {
        fetchGameItems(); // Refresh the items list
        resetForm();
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message || "Error updating game item");
    }
  };

  // Delete game item
  const handleDeleteGameItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game item?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/game/items/${id}`,
      );

      if (response.status === 200) {
        setGameItems(gameItems.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(err.message || "Error deleting game item");
    }
  };

  // Edit game item - prepare form for editing
  const handleEditGameItem = (item) => {
    // Extract price, type and rarity from details if available
    let price = 0;
    let gems = 0;
    let type = "skin";
    let rarity = "Premium";

    if (item.GameItemDetail) {
      const details = item.GameItemDetail;
      price = details.price || 0;
      gems = details.gems || 0;
      type = details.type || "skin";
      rarity = details.rarity || "Premium";
    }

    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: price,
      gems: gems,
      type: type,
      rarity: rarity,
      game: "Clash Of Clans",
      imageUrl: item.imageUrl,
    });
    setIsEditing(true);
    setSelectedFile(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: 0,
      gems: 0,
      type: "skin",
      rarity: "Premium",
      game: "Clash Of Clans",
    });
    setSelectedFile(null);
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

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
        <h1>Clash Of Clans Item Management</h1>
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
                <a href="/admin">Dashboard</a>
              </li>
              <li>
                <a href="/admin/news">News Management</a>
              </li>
              <li>
                <a href="/admin/BrawlStars">Brawl Stars Management</a>
              </li>
              <li>
                <a href="/admin/ClashOfClans" className="active">
                  Clash Of Clans Management
                </a>
              </li>
              <li>
                <a href="/admin/ClashRoyale">Clash Royale Management</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="admin-content">
          {error && <div className="error-message">{error}</div>}

          <div className="game-item-form-container">
            <h2>{isEditing ? "Edit Game Item" : "Add New Game Item"}</h2>
            <form
              onSubmit={isEditing ? handleUpdateGameItem : handleCreateGameItem}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gems">Gems</label>
                <input
                  type="number"
                  id="gems"
                  name="gems"
                  value={formData.gems}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="skin">Skin</option>
                  <option value="pass">Pass</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rarity">Rarity</label>
                <select
                  id="rarity"
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleInputChange}
                >
                  <option value="Legendary">Legendary</option>
                  <option value="Epic">Epic</option>
                  <option value="Premium">Premium</option>
                  <option value="Ultra">Ultra</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                />
                <small>Select an image for the game item</small>
              </div>

              {/* Display current image when editing */}
              {isEditing && formData.imageUrl && (
                <div className="current-image">
                  <p>Current Image:</p>
                  <div className="image-preview">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${formData.imageUrl}`}
                      alt="Game item"
                      style={{ width: "100px" }}
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {isEditing ? "Update" : "Create"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="game-items-list">
            <h2>Game Items</h2>
            {loading ? (
              <p>Loading...</p>
            ) : gameItems.length === 0 ? (
              <p>No game items found.</p>
            ) : (
              <table className="game-items-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Rarity</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gameItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.GameItemDetail?.type || "N/A"}</td>
                      <td>{item.GameItemDetail?.rarity || "N/A"}</td>
                      <td>{item.GameItemDetail?.price || "N/A"}</td>
                      <td>
                        {item.imageUrl ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}${item.imageUrl}`}
                            alt={item.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditGameItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteGameItem(item.id)}
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

export default ClashOfClans;
