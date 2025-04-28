import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Импортируем Link для создания ссылок
import '../styles/BrawlStarsUpdates.css';

export default function BrawlStarsCartoonUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/news`);
      if (response.data) {
        setUpdates(response.data);
      }
    };

    loadNews();
  }, []);

  return (
    <div className="brawl-stars-container-news">
      <div className="brawl-stars-wrapper-news">
        <h2 className="brawl-stars-title-news">Новости</h2>

        <div className="brawl-stars-cards-container-news">
          {updates.map(update => {
            // Определяем ссылку в зависимости от категории
            let linkPath = '';
            if (update.game === 'Brawl Stars') {
              linkPath = '/brawl-stars';
            } else if (update.game === 'Clash Of Clans') {
              linkPath = '/clash-of-clans';
            } else if (update.game === 'Clash Royale') {
              linkPath = '/clash-royale';
            }

            return (
              <div key={update.id} className={`brawl-stars-card-news ${update.colorClass}`}>
                <div className="card-content-news">
                  <div className="card-date-news">{update.date}</div>

                  <div className="card-image-container-news">
                    <img src={`${process.env.REACT_APP_API_URL}${update.image}`} alt={update.title} className="card-image-news" />
                  </div>

                  <div className="card-info-news">
                    <h3 className="card-title-news">{update.title}</h3>
                    <p className="card-subtitle-news">{update.subtitle}</p>
                    <span className="card-character-news">{update.game}</span>

                    {/* Используем Link для создания ссылки */}
                    <Link to={linkPath} className="play-button-news">
                      ПОДРОБНЕЕ
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="all-news-button-container-news">
          <button
            className="all-news-button-news"
            onClick={() => window.location.href = '/allnews'}
          >
            ВСЕ ОБНОВЛЕНИЯ
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
