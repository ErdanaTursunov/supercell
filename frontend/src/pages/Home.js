import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Header_Store from '../components/Header_Store';
import GameStores from '../components/GameStores';
import GameCarousel from '../components/GameCarousel';
import BrawlStarsCartoonUpdates from '../components/BrawlStarsCartoonUpdates';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimerRef = useRef(null);
  const navigate = useNavigate();

  const images = [
    {
      id: 1,
      src: "../img/BrawlStars.png",
      alt: "Image 1",
      buttonText: "Brawl Stars",
      route: "/brawl-stars",
    },
    {
      id: 2,
      src: "../img/ClashOfClans.png",
      alt: "Image 2",
      buttonText: "Clash of Clans",
      route: "/clash-of-clans",
    },
    {
      id: 3,
      src: "../img/ClashRoyale.png",
      alt: "Image 3",
      buttonText: "Clash Royal",
      route: "/clash-royale",
    }
  ];

  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollTimerRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling, images.length]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setIsAutoScrolling(false);

    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  const handleImageClick = (route) => {
    navigate(route);
  };

  return (
    <div className="carousel-container">
      <Header_Store />
      <div className="carousel-wrapper">
        <div className="carousel-main">
          <div className="carousel-image-container">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`carousel-image-slide ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleImageClick(image.route)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="carousel-image"
                />
                {index === activeIndex && (
                  <div className="carousel-image-caption">
                    <button className="carousel-button">
                      {image.buttonText}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="carousel-thumbnails">
            {images.map((image, index) => (
              <div
                key={`thumb-${image.id}`}
                className={`carousel-thumbnail ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="carousel-thumbnail-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <GameStores />
      <GameCarousel />
      <BrawlStarsCartoonUpdates />
    </div>
  );
};

export default Home;
