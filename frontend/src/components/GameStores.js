import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/GameStores.css";

export default function GameStores() {
  const navigate = useNavigate();

  const [stores] = useState([
    {
      id: 1,
      name: 'Brawl Stars',
      text: 'Магазин Brawl Stars',
      link: '/brawl-stars-store',
      image: './img/store-card-bs.png',
      route: "/brawl-stars",
    },
    {
      id: 2,
      name: 'Clash of Clans',
      text: 'Магазин Clash of Clans',
      link: '/clash-of-clans-store',
      image: './img/store-card-coc.png',
      route: "/clash-of-clans",
    },
    {
      id: 3,
      name: 'Clash Royale',
      text: 'Магазин Clash Royale',
      link: '/clash-royale-store',
      image: './img/store-card-cr.png',
      route: "/clash-royale",
    }
  ]);

  const handleStoreClick = (route) => {
    navigate(route);
  };

  return (
    <div className="game-stores-container">
      {stores.map((store) => (
        <div
          key={store.id}
          className="game-store-card"
          onClick={() => handleStoreClick(store.route)}
        >
          <div className="card-image-container">
            <img 
              src={store.image} 
              alt={`${store.name}`} 
              className="card-image" 
            />
          </div>
          
          <div className="card-footer">
            <div className="store-link">
              <span className="arrow">→</span>
              <span className="store-name">{store.text}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
