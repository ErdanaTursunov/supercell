import React, { useContext, useEffect, useState } from 'react';
import "../styles/LayoutClashOfClans.css";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LayoutClashOfClans() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
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

  useEffect(() => {
    const loadGameItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/game/items', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
          }
        });

        const filteredProducts = response.data.filter(item => item.game === "Clash Of Clans");
        setProducts(filteredProducts);

        // Initialize product quantities to 1
        const quantities = {};
        response.data.forEach(product => {
          quantities[product.id] = 1;
        });
        setProductQuantities(quantities);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      }
    };

    loadGameItems();
    loadCartItems();
  }, []);

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
      alert("Успешно добавлен в корзину");
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
    }
  };

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
      alert("Количество товара успешно обновлено");
    } catch (error) {
      console.error('Ошибка при обновлении количества товара:', error);
      alert("Произошла ошибка при обновлении количества товара");
    }
  };

  // Handle quantity change for products in the shop
  const handleProductQuantityChange = (productId, value) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Handle quantity change for items in the cart
  const handleCartItemQuantityChange = (cartItemId, value) => {
    setCartItemQuantities(prev => ({
      ...prev,
      [cartItemId]: value
    }));
  };

  // Increase cart item quantity in local state only (no API call)
  const increaseCartItemQuantity = (cartItemId) => {
    setCartItemQuantities(prev => ({
      ...prev,
      [cartItemId]: (prev[cartItemId] || 1) + 1
    }));
  };

  // Decrease cart item quantity in local state only (no API call)
  const decreaseCartItemQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      setCartItemQuantities(prev => ({
        ...prev,
        [cartItemId]: prev[cartItemId] - 1
      }));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/items/${productId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`
        }
      });
      alert("Успешно удален из корзины");
      setCart(cart.filter(item => item.id !== productId));
    } catch (error) {
      alert("Произошла ошибка в удалении товара из корзины");
    }
  };

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(product => product.GameItemDetail.type === activeTab);

  const calculateTotal = () => {
    return cart.reduce((total, item) =>
      total + (item.GameItem.GameItemDetail.price * (cartItemQuantities[item.id] || item.quantity)), 0).toFixed(2);
  };

  const getRarityClass = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'legendary-item';
      case 'Epic': return 'epic-item';
      case 'Premium': return 'premium-item';
      case 'Ultra': return 'ultra-item';
      default: return '';
    }
  };

  return (
    <div className="clash-app-cs">
      <header className="app-header-cs">
        <div className="logo-cs" onClick={() => window.location.href = '/'}>
          <img src="/img/app-icon-clashofclans.png" alt="Clash Royale Logo" className="cr-logo-img" />
          <h1>Clash Market</h1>
        </div>
        <nav className="main-nav-cs">
          <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>
            <span className="button-icon">🏠</span> Все
          </button>
          <button onClick={() => setActiveTab('skin')} className={activeTab === 'skin' ? 'active' : ''}>
            <span className="button-icon">👑</span> Скины
          </button>
          <button onClick={() => setActiveTab('pass')} className={activeTab === 'pass' ? 'active' : ''}>
            <span className="button-icon">🏆</span> Пропуски
          </button>
        </nav>


        <div className="brawl-auth-controls">
          {isAuthenticated ? (
            <div className='clash-app-cs-header-container'>
              <div className="cart-icon-cs" onClick={() => setShowCart(!showCart)}>
                <span className="cart-emoji">🛒</span>
                <span className="cart-count-cs">{cart.length}</span>
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
            </div>
          ) : (
            <button
              className="brawl-btn login-btn"
              onClick={handleLogin}
            >
              Войти
            </button>
          )}
        </div>
      </header>

      <div className="hero-banner">
        <div className="hero-content">
          <h2>Легендарные скины</h2>
          <p>Настройте своих героев с помощью эксклюзивных обликов!</p>
          <button className="hero-button">В МАГАЗИН</button>
        </div>
      </div>

      <main className="content-cs">
        {showCart ? (
          <div className="cart-container-cs">
            <h2><span className="section-icon">🛒</span> Ваша корзина</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛍️</div>
                <p>Ваша корзина пуста. Добавьте классные товары!</p>
                <div className="cart-barbarian">
                  <img src="/api/placeholder/150/150" alt="Грустный Варвар" className="sad-barbarian" />
                </div>
              </div>
            ) : (
              <>
                <div className="cart-items-cs">
                  {cart.map(item => (
                    <div key={`cart-${item.id}`} className={`cart-item-cs ${getRarityClass(item.GameItem.GameItemDetail.rarity)}`}>
                      <img
                        src={item.GameItem ? `${process.env.REACT_APP_API_URL}${item.GameItem.imageUrl}` : item.image}
                        alt={item.GameItem ? item.GameItem.name : item.name}
                        width="50"
                        height="50"
                      />

                      <div className="cart-item-details-cs">
                        <h3>{item.GameItem.name}</h3>
                        <div className="item-rarity">{item.GameItem.GameItemDetail.rarity}</div>
                        <p>
                          ${item.GameItem ? item.GameItem.GameItemDetail.price : item.price}
                          | {item.GameItem ? item.GameItem.GameItemDetail.gems : item.gems} гемов
                        </p>
                        <div className="quantity-control">
                          <button
                            className="quantity-input"
                            onClick={() => decreaseCartItemQuantity(item.id, cartItemQuantities[item.id] || item.quantity)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={cartItemQuantities[item.id] || item.quantity}
                            onChange={(e) => handleCartItemQuantityChange(item.id, Number(e.target.value))}
                            className="quantity-input"
                          />
                          <button
                            className="quantity-input"
                            onClick={() => increaseCartItemQuantity(item.id)}
                          >
                            +
                          </button>
                          <button
                            className="update-quantity-btn"
                            onClick={() => updateCartItemQuantity(item.id, cartItemQuantities[item.id])}
                          >
                            Обновить
                          </button>
                        </div>
                      </div>
                      <button className="remove-btn-cs" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary-cs">
                  <div className="summary-details">
                    <p>Товаров: {cart.length}</p>
                    <p className="total-cs">Итого: <span className="price-highlight">${calculateTotal()}</span></p>
                  </div>
                  <button className="checkout-btn-cs" onClick={() => navigate("/checkout")}>
                    <span className="brawl-btn-icon" >💰</span> Перейти к оплате
                  </button>
                </div>
              </>
            )}
            <button className="continue-shopping-cs" onClick={() => setShowCart(false)}>
              <span className="btn-icon">🔙</span> Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h2><span className="section-icon">{activeTab === 'all' ? '🏆' : activeTab === 'skin' ? '👑' : '🎁'}</span>
                {activeTab === 'all' ? 'Избранные товары' : activeTab === 'skin' ? 'Скины героев' : 'Золотые пропуски'}</h2>
            </div>

            <div className="products-grid-cs">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className={`product-card-cs ${getRarityClass(product.GameItemDetail.rarity)}`}
                >
                  <div className="rarity-banner">{product.GameItemDetail.rarity}</div>
                  <div className="product-image-cs">
                    <img src={`${process.env.REACT_APP_API_URL}${product.imageUrl}`} alt={product.name} />
                    {product.GameItemDetail.type === 'pass' && <div className="special-badge">СПЕЦИАЛЬНО</div>}
                  </div>
                  <div className="product-info-cs">
                    <h3>{product.name}</h3>
                    <p className="product-description-cs">{product.description}</p>
                    <div className="product-price-cs">
                      <span className="price-cs">${product.GameItemDetail.price}</span>
                      <span className="gems-cs"><span className="gem-icon">💎</span> {product.GameItemDetail.gems}</span>
                      <input
                        type="number"
                        min="1"
                        value={productQuantities[product.id] || 1}
                        onChange={(e) => handleProductQuantityChange(product.id, Number(e.target.value))}
                        className="quantity-input"
                      />
                    </div>
                    <button
                      className="add-to-cart-cs"
                      onClick={() => addToCart({ id: product.id, quantity: productQuantities[product.id] || 1 })}
                    >
                      <span className="btn-icon">🛒</span> В корзину
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

export default LayoutClashOfClans;