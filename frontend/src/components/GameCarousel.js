import { useState, useEffect, useRef } from 'react';
import '../styles/GameCarousel.css';

export default function GameCarousel() {
  const sliderRef = useRef(null);

  const games = [
    {
      id: 1,
      icon: "/img/app-icon-brawlstars.png",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
      appStoreUrl: "https://apps.apple.com/us/app/clash-of-clans/id529479190"
    },
    {
      id: 2,
      icon: "/img/app-icon-clashofclans.png",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.supercell.brawlstars",
      appStoreUrl: "https://apps.apple.com/us/app/brawl-stars/id1229016807"
    },
    {
      id: 3,
      icon: "/img/app-icon-clashroyale.png",
      googlePlayUrl: "https://play.google.com/store/apps/details?id=com.supercell.clashroyale",
      appStoreUrl: "https://apps.apple.com/us/app/clash-royale/id1053012308"
    }
  ];

  return (
    <div className="slider-container">
      <div ref={sliderRef} className="game-slider">
        {/* Повторяем элементы для бесконечной прокрутки */}
        {[...games, ...games].map((game, index) => (
          <div key={index} className="game-item">
            <div className="game-icon-container">
              <img src={game.icon} alt="Game icon" className="game-icon" />
            </div>
            <div className="download-buttons">
              <a href={game.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src="./img/google-play.png"
                  alt="Google Play"
                  className="store-badge"
                />
              </a>
              <a href={game.appStoreUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src="./img/app-store.svg"
                  alt="App Store"
                  className="store-badge"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
