import React, { useState, useEffect } from "react";
import "../styles/LayoutBrawlStars.css";
import PassContainers from "../components/PassContainers";
import Header_Brawl from "../components/Header_Brawl";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";

function LayoutBrawlStars() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [shopType, setShopType] = useState("skin");
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [error, setError] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [cartItemQuantities, setCartItemQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Using the correct API endpoint from your backend
        const response = await axios.get('http://localhost:4000/api/game/items');

        // Filter products by game type "Brawl Stars" as specified
        const filteredProducts = response.data.filter(item => item.game === "Brawl Stars");

        // Further filter by shop type (mapping your UI categories to backend types)
        const typeMapping = {
          'skin': 'skin',
          'gems': 'gems',
          'coins': 'coins',
          'chest': 'chest'
        };

        const currentType = typeMapping[shopType] || shopType;

        // Filter based on the GameItemDetail.type property
        let shopProducts = filteredProducts.filter(item =>
          item.GameItemDetail && item.GameItemDetail.type === currentType
        );

        const quantities = {};
        filteredProducts.forEach(product => {
          quantities[product.id] = 1;
        });
        setProductQuantities(quantities);
        setProducts(shopProducts);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    loadCartItems();
  }, [shopType]);

  // Загрузка товаров корзины
  const loadCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/cart/items', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });

      setCart(response.data);

      // Initialize cart item quantities
      const quantities = {};
      response.data.forEach(item => {
        quantities[item.id] = item.quantity;
      });
      setCartItemQuantities(quantities);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    }
  };

  // Добавление товара в корзину
  const addToCart = async ({ id, quantity }) => {
    try {
      await axios.post('http://localhost:4000/api/cart/items', {
        gameItemId: id,
        quantity: quantity
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });

      await loadCartItems();
      setNotificationMessage("Успешно добавлен в корзину");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      setNotificationMessage("Ошибка при добавлении товара в корзину");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Обновление количества товара в корзине
  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/cart/items/${cartItemId}`, {
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });

      // Refresh cart to make sure everything is in sync
      await loadCartItems();
      setNotificationMessage("Количество товара успешно обновлено");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Ошибка при обновлении количества товара:', error);
      setNotificationMessage("Произошла ошибка при обновлении количества товара");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Удаление товара из корзины
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/items/${productId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });
      setNotificationMessage("Успешно удален из корзины");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setCart(cart.filter(item => item.id !== productId));
    } catch (error) {
      setNotificationMessage("Произошла ошибка в удалении товара из корзины");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Изменение количества товара в магазине
  const handleProductQuantityChange = (productId, value) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Изменение количества товара в корзине
  const handleCartItemQuantityChange = (cartItemId, value) => {
    setCartItemQuantities(prev => ({
      ...prev,
      [cartItemId]: value
    }));
  };

  // Увеличение количества товара в корзине
  const increaseCartItemQuantity = (cartItemId) => {
    setCartItemQuantities(prev => ({
      ...prev,
      [cartItemId]: (prev[cartItemId] || 1) + 1
    }));
  };

  // Уменьшение количества товара в корзине
  const decreaseCartItemQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      setCartItemQuantities(prev => ({
        ...prev,
        [cartItemId]: prev[cartItemId] - 1
      }));
    }
  };

  // Рассчет общей суммы корзины
  const calculateTotal = () => {
    return cart.reduce((total, item) =>
      total + (item.GameItem.GameItemDetail.price * (cartItemQuantities[item.id] || item.quantity)), 0).toFixed(2);
  };

  const changeShopType = (type) => {
    setShopType(type);
  };

  return (
    <div className="Store">
      {/* Передаем необходимые пропсы в Header */}
      <Header_Brawl
        cart={cart}
        setShowCart={setShowCart}
        showCart={showCart}
      />

      {/* Проверка, показывать ли корзину */}
      {showCart ? (
        <div className="brawl-cart-container">
          <h2><span className="brawl-section-icon">🛒</span> Ваша корзина</h2>
          {cart.length === 0 ? (
            <div className="brawl-empty-cart">
              <div className="brawl-empty-cart-icon">🛍️</div>
              <p>Ваша корзина пуста. Добавьте классные товары!</p>
              <div className="brawl-cart-character">
                <img src="/img/brawl-sad-character.png" alt="Грустный персонаж" className="brawl-sad-character"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/150/150";
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="brawl-cart-items">
                {cart.map(item => (
                  <div key={`cart-${item.id}`} className="brawl-cart-item">
                    <img
                      src={`http://localhost:4000${item.GameItem.imageUrl}`}
                      alt={item.GameItem.name}
                      width="50"
                      height="50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./img/default-item.png";
                      }}
                    />

                    <div className="brawl-cart-item-details">
                      <h3>{item.GameItem.name}</h3>
                      <p>{item.GameItem.GameItemDetail.price}тг</p>
                      <div className="brawl-quantity-control">
                        <button
                          className="brawl-quantity-btn"
                          onClick={() => decreaseCartItemQuantity(item.id, cartItemQuantities[item.id] || item.quantity)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={cartItemQuantities[item.id] || item.quantity}
                          onChange={(e) => handleCartItemQuantityChange(item.id, Number(e.target.value))}
                          className="brawl-cart-quantity-input"
                        />
                        <button
                          className="brawl-quantity-btn"
                          onClick={() => increaseCartItemQuantity(item.id)}
                        >
                          +
                        </button>
                        <button
                          className="brawl-update-quantity-btn"
                          onClick={() => updateCartItemQuantity(item.id, cartItemQuantities[item.id])}
                        >
                          Обновить
                        </button>
                      </div>
                    </div>
                    <button className="brawl-remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                ))}
              </div>
              <div className="brawl-cart-summary">
                <div className="brawl-summary-details">
                  <p>Товаров: {cart.length}</p>
                  <p className="brawl-total">Итого: <span className="brawl-price-highlight">{calculateTotal()}тг</span></p>
                </div>
                <button className="brawl-checkout-btn" onClick={() => navigate("/checkout")}>
                  <span className="brawl-btn-icon" >💰</span> Перейти к оплате
                </button>
              </div>
            </>
          )}
          <button className="brawl-continue-shopping" onClick={() => setShowCart(false)}>
            <span className="brawl-btn-icon">🔙</span> Продолжить покупки
          </button>
        </div>
      ) : (
        <>
          {/* Первый экран - герой-секция */}
          <div className="Store-start-bg">
            <div className="Store-start-bg-content">
              <div className="Store-start-bg-titles">
                <img className="Store-start-bg-title" src="/img/store-title.png" alt="Store Title" />
                <p className="brawl-campaign-description">
                  Купите пропуск ЗДЕСЬ и сразу же получите 30% прогресса!
                </p>
                <button className="brawl-campaign-button">
                  <div className="button-content">
                    <img src="./img/gems-icon.png" alt="Gems" className="gems-icon" />
                    <span>169</span>
                  </div>
                </button>
              </div>
              <div className="icon-pluses">
                <div className="pass-option">
                  <img className="icon-brawl-pass" src="/img/brawl_pass.png" alt="Brawl Pass" />
                  <span className="pass-label">Бравл Пасс</span>
                </div>
                <div className="pass-option">
                  <img className="icon-brawl-pass-plus" src="/img/icon_brawl_pass_plus.png" alt="Brawl Pass Plus" />
                  <span className="pass-label">Бравл Пасс Плюс</span>
                </div>
                <div className="pass-option">
                  <img className="icon-pro-pass" src="/img/icon_pro_pass_icon.png" alt="Pro Pass" />
                  <span className="pass-label">Про Пасс</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Секция пропусков */}
          <PassContainers />

          <div className="section-divider"></div>

          {/* Секция магазина */}
          <div className="Store-bg">
            <div className="Store-parent-container">
              {/* Переключатель секций магазина */}
              <div className="shop-sections">
                <div
                  className={`shop-section-item ${shopType === 'skin' ? 'active' : ''}`}
                  onClick={() => changeShopType('skin')}
                >
                  <img alt="Skins section" width="40" height="auto" src="/img/bs_pp_perk1.png" />
                  <span>СКИНЫ</span>
                </div>
                <div
                  className={`shop-section-item ${shopType === 'gems' ? 'active' : ''}`}
                  onClick={() => changeShopType('gems')}
                >
                  <img alt="Gems section" width="40" height="auto" src="/img/gems_icon.png" />
                  <span>САМОЦВЕТЫ</span>
                </div>
                <div
                  className={`shop-section-item ${shopType === 'coins' ? 'active' : ''}`}
                  onClick={() => changeShopType('coins')}
                >
                  <img alt="Coins section" width="40" height="auto" src="/img/gold_coin.png" />
                  <span>МОНЕТЫ</span>
                </div>
                <div
                  className={`shop-section-item ${shopType === 'chest' ? 'active' : ''}`}
                  onClick={() => changeShopType('chest')}
                >
                  <img alt="Boxes section" width="40" height="auto" src="/img/box-icon.png" />
                  <span>ЯЩИКИ</span>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Загрузка товаров...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button onClick={() => changeShopType(shopType)}>Попробовать снова</button>
                </div>
              ) : (
                <>
                  <div className="Store-parent-container-icon">
                    <img
                      alt={shopType === 'skin' ? "Skins section" :
                        shopType === 'gems' ? "Gems section" :
                          shopType === 'coins' ? "Coins section" : "Boxes section"}
                      loading="lazy"
                      width="50"
                      height="45"
                      src={shopType === 'skin' ? "/img/bs_pp_perk1.png" :
                        shopType === 'gems' ? "/img/gems_icon.png" :
                          shopType === 'coins' ? "/img/gold_coin.png" : "/img/box-icon.png"}
                    />
                    <p className="Skin_text">
                      {shopType === 'skin' ? "СКИНЫ" :
                        shopType === 'gems' ? "САМОЦВЕТЫ" :
                          shopType === 'coins' ? "МОНЕТЫ" : "ЯЩИКИ"}
                    </p>
                    <p className="Skin_text-1">
                      {shopType === 'skin' ? "Подчеркните свою индивидуальность и сражайтесь стильно!" :
                        shopType === 'gems' ? "Покупайте самоцветы для приобретения премиальных товаров!" :
                          shopType === 'coins' ? "Копите монеты для улучшения ваших бойцов!" :
                            "Открывайте ящики и получайте эксклюзивные предметы!"}
                    </p>
                  </div>

                  <div className="Store-parent">
                    {products.length === 0 ? (
                      <div className="no-products">
                        <p>Товары в данной категории не найдены</p>
                      </div>
                    ) : (
                      /* Товары */
                      products.map((product, index) => (
                        <div
                          key={product.id}
                          className={`Store-product-item Store-div${index + 2}`}
                          style={{ "--item-index": index }}
                        >
                          <div className="product-image-container">
                            <img
                              className="product-image"
                              src={`http://localhost:4000${product.imageUrl}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "./img/default-item.png";
                              }}
                            />
                          </div>
                          <div className="Store-overflow">
                            <div className="Store-texts">
                              <p className="Store-first-p">{product.name}</p>
                              <p className="Store-second-p">{product.description}</p>
                            </div>
                          </div>
                          <div className="product-bottom">
                            <p className="Store-money">{product.GameItemDetail?.price}тг</p>
                            <input
                              type="number"
                              min="1"
                              value={productQuantities[product.id] || 1}
                              onChange={(e) => handleProductQuantityChange(product.id, Number(e.target.value))}
                              className="cr-quantity-input"
                            />
                            <button
                              className="cr-buy-button"
                              onClick={() => addToCart({ id: product.id, quantity: productQuantities[product.id] || 1 })}
                            >
                              <span className="cr-btn-icon">🛒</span> В корзину
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Уведомление */}
      {showNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
}

export default LayoutBrawlStars;