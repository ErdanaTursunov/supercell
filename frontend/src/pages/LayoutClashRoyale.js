import React, { useContext, useEffect, useState } from "react";
import "../styles/LayoutClashRoyale.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LayoutClashRoyale() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const [productQuantities, setProductQuantities] = useState({}); // For products in shop
  const [cartItemQuantities, setCartItemQuantities] = useState({}); // For items in cart
  const { isAuthenticated, logout } = useContext(AuthContext);

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

  const loadCartItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/items`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );

      setCart(response.data);

      // Initialize cart item quantities
      const quantities = {};
      response.data.forEach((item) => {
        quantities[item.id] = item.quantity;
      });
      setCartItemQuantities(quantities);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    }
  };

  useEffect(() => {
    const loadGameItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/game/items`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
            },
          },
        );
        const filteredProducts = response.data.filter(
          (product) => product.game === "Clash Royale",
        );

        setProducts(filteredProducts);
        // Initialize product quantities to 1
        const quantities = {};
        filteredProducts.forEach((product) => {
          quantities[product.id] = 1;
        });
        setProductQuantities(quantities);
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      }
    };

    loadGameItems();
    loadCartItems();
  }, []);

  const addToCart = async ({ id, quantity }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/items`,
        {
          gameItemId: id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );

      await loadCartItems();
      alert("Успешно добавлен в корзину");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
    }
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart/items/${cartItemId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );

      // Refresh cart to make sure everything is in sync
      await loadCartItems();
      alert("Количество товара успешно обновлено");
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error);
      alert("Произошла ошибка при обновлении количества товара");
    }
  };

  // Handle quantity change for products in the shop
  const handleProductQuantityChange = (productId, value) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Handle quantity change for items in the cart
  const handleCartItemQuantityChange = (cartItemId, value) => {
    setCartItemQuantities((prev) => ({
      ...prev,
      [cartItemId]: value,
    }));
  };

  // Increase cart item quantity in local state only (no API call)
  const increaseCartItemQuantity = (cartItemId) => {
    setCartItemQuantities((prev) => ({
      ...prev,
      [cartItemId]: (prev[cartItemId] || 1) + 1,
    }));
  };

  // Decrease cart item quantity in local state only (no API call)
  const decreaseCartItemQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      setCartItemQuantities((prev) => ({
        ...prev,
        [cartItemId]: prev[cartItemId] - 1,
      }));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/items/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth"))?.token}`,
          },
        },
      );
      alert("Успешно удален из корзины");
      setCart(cart.filter((item) => item.id !== productId));
    } catch (error) {
      alert("Произошла ошибка в удалении товара из корзины");
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.GameItemDetail.type === selectedCategory,
        );

  const calculateTotal = () => {
    return cart
      .reduce(
        (total, item) =>
          total +
          item.GameItem.GameItemDetail.price *
            (cartItemQuantities[item.id] || item.quantity),
        0,
      )
      .toFixed(2);
  };

  const getRarityClass = (rarity) => {
    switch (rarity) {
      case "Legendary":
        return "cr-legendary-item";
      case "Epic":
        return "cr-epic-item";
      case "Premium":
        return "cr-premium-item";
      case "Ultra":
        return "cr-ultra-item";
      default:
        return "";
    }
  };

  return (
    <div className="cr-bg-blue-100 cr-min-h-screen cr-font-sans">
      {/* Шапка */}
      <header className="cr-header">
        <div className="cr-header-container">
          <div className="cr-logo">
            <img
              src="/img/app-icon-clashroyale.png"
              alt="Clash Royale Logo"
              className="cr-logo-img"
            />
            <h1 className="cr-logo-text">CLASH ROYALE МАГАЗИН</h1>
          </div>

          {isAuthenticated ? (
            <div className="clash-app-cs-header-container">
              <div
                className="cr-cart-icon"
                onClick={() => setShowCart(!showCart)}
              >
                <span className="cr-cart-emoji">🛒</span>
                <span className="cr-cart-count">{cart.length}</span>
              </div>
              <button
                className="brawl-btn profile-btn"
                onClick={handleProfileClick}
              >
                Профиль
              </button>
              <button className="brawl-btn logout-btn" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <button className="brawl-btn login-btn" onClick={handleLogin}>
              Войти
            </button>
          )}
        </div>
      </header>

      {/* Основной контент */}
      <main className="cr-main">
        {showCart ? (
          <div className="cr-cart-container">
            <h2>
              <span className="cr-section-icon">🛒</span> Ваша корзина
            </h2>
            {cart.length === 0 ? (
              <div className="cr-empty-cart">
                <div className="cr-empty-cart-icon">🛍️</div>
                <p>Ваша корзина пуста. Добавьте классные товары!</p>
                <div className="cr-cart-king">
                  <img
                    src="/api/placeholder/150/150"
                    alt="Грустный Король"
                    className="cr-sad-king"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="cr-cart-items">
                  {cart.map((item) => (
                    <div
                      key={`cart-${item.id}`}
                      className={`cr-cart-item ${getRarityClass(item.GameItem.GameItemDetail.rarity)}`}
                    >
                      <img
                        src={
                          item.GameItem
                            ? `${process.env.REACT_APP_API_URL}${item.GameItem.imageUrl}`
                            : item.image
                        }
                        alt={item.GameItem ? item.GameItem.name : item.name}
                        width="50"
                        height="50"
                      />

                      <div className="cr-cart-item-details">
                        <h3>{item.GameItem.name}</h3>
                        <div className="cr-item-rarity">
                          {item.GameItem.GameItemDetail.rarity}
                        </div>
                        <p>
                          $
                          {item.GameItem
                            ? item.GameItem.GameItemDetail.price
                            : item.price}
                          |{" "}
                          {item.GameItem
                            ? item.GameItem.GameItemDetail.gems
                            : item.gems}{" "}
                          гемов
                        </p>
                        <div className="cr-quantity-control">
                          <button
                            className="cr-quantity-btn"
                            onClick={() =>
                              decreaseCartItemQuantity(
                                item.id,
                                cartItemQuantities[item.id] || item.quantity,
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={cartItemQuantities[item.id] || item.quantity}
                            onChange={(e) =>
                              handleCartItemQuantityChange(
                                item.id,
                                Number(e.target.value),
                              )
                            }
                            className="cr-cart-quantity-input"
                          />
                          <button
                            className="cr-quantity-btn"
                            onClick={() => increaseCartItemQuantity(item.id)}
                          >
                            +
                          </button>
                          <button
                            className="cr-update-quantity-btn"
                            onClick={() =>
                              updateCartItemQuantity(
                                item.id,
                                cartItemQuantities[item.id],
                              )
                            }
                          >
                            Обновить
                          </button>
                        </div>
                      </div>
                      <button
                        className="cr-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cr-cart-summary">
                  <div className="cr-summary-details">
                    <p>Товаров: {cart.length}</p>
                    <p className="cr-total">
                      Итого:{" "}
                      <span className="cr-price-highlight">
                        ${calculateTotal()}
                      </span>
                    </p>
                  </div>
                  <button
                    className="cr-checkout-btn"
                    onClick={() => navigate("/checkout")}
                  >
                    <span className="brawl-btn-icon">💰</span> Перейти к оплате
                  </button>
                </div>
              </>
            )}
            <button
              className="cr-continue-shopping"
              onClick={() => setShowCart(false)}
            >
              <span className="cr-btn-icon">🔙</span> Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            {/* Навигация по категориям */}
            <div className="cr-category-nav">
              <button
                className={`cr-category-button ${selectedCategory === "all" ? "cr-category-button-active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                Все
              </button>
              <button
                className={`cr-category-button ${selectedCategory === "pass" ? "cr-category-button-active" : ""}`}
                onClick={() => setSelectedCategory("pass")}
              >
                Пропуски
              </button>
              <button
                className={`cr-category-button ${selectedCategory === "skin" ? "cr-category-button-active" : ""}`}
                onClick={() => setSelectedCategory("skin")}
              >
                Скины
              </button>
              <button
                className={`cr-category-button ${selectedCategory === "emote" ? "cr-category-button-active" : ""}`}
                onClick={() => setSelectedCategory("emote")}
              >
                Эмоции
              </button>
              <button
                className={`cr-category-button ${selectedCategory === "chest" ? "cr-category-button-active" : ""}`}
                onClick={() => setSelectedCategory("chest")}
              >
                Сундуки
              </button>
            </div>

            {/* Товары */}
            <div className="cr-items-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`cr-item-card ${getRarityClass(product.GameItemDetail.rarity)}`}
                >
                  <div className="cr-item-header">
                    <h3 className="cr-item-name">{product.name}</h3>
                    <div className="cr-rarity-banner">
                      {product.GameItemDetail.rarity}
                    </div>
                  </div>
                  <div className="cr-item-content">
                    <div className="cr-item-image-container">
                      <img
                        src={`${process.env.REACT_APP_API_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="cr-item-image"
                      />
                      {product.GameItemDetail.type === "pass" && (
                        <div className="cr-special-badge">СПЕЦИАЛЬНО</div>
                      )}
                    </div>
                    <p className="cr-item-description">{product.description}</p>
                    <div className="cr-product-price">
                      <span className="cr-price">
                        ${product.GameItemDetail.price}
                      </span>
                      <span className="cr-gems">
                        <span className="cr-gem-icon">💎</span>{" "}
                        {product.GameItemDetail.gems}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={productQuantities[product.id] || 1}
                        onChange={(e) =>
                          handleProductQuantityChange(
                            product.id,
                            Number(e.target.value),
                          )
                        }
                        className="cr-quantity-input"
                      />
                    </div>
                    <button
                      className="cr-buy-button"
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          quantity: productQuantities[product.id] || 1,
                        })
                      }
                    >
                      <span className="cr-btn-icon">🛒</span> В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default LayoutClashRoyale;
