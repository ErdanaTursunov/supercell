import { useEffect, useState } from "react";
import "../styles/BrawlStarsAllNews.css";
import axios from "axios";
import { Link } from "react-router-dom"; // Импортируем Link для создания ссылок

export default function BrawlStarsAllNews() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6; // например, 6 новостей на страницу

  useEffect(() => {
    const loadNews = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/news`,
      );
      if (response.data) {
        setNews([...response.data]);
      }
    };

    loadNews();
  }, []);

  const categories = [
    { id: "all", name: "Все новости" },
    { id: "Brawl Stars", name: "Brawl Stars" },
    { id: "Clash Of Clans", name: "Clash Of Clans" },
    { id: "Clash Royale", name: "Clash Royale" },
  ];

  let filteredNews =
    activeCategory === "all"
      ? news
      : news.filter((item) => item.game === activeCategory);

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="bs-all-news-container">
      <div className="bs-all-news-header">
        <h1 className="bs-all-news-title">НОВОСТИ</h1>
        <p className="bs-all-news-subtitle">
          Будьте в курсе всех обновлений и событий игр
        </p>
      </div>

      <div className="bs-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`bs-category-button ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="bs-news-grid">
        {currentNews.map((item) => {
          // Определяем ссылку в зависимости от категории
          let linkPath = "";
          if (item.game === "Brawl Stars") {
            linkPath = "/brawl-stars";
          } else if (item.game === "Clash Of Clans") {
            linkPath = "/clash-of-clans";
          } else if (item.game === "Clash Royale") {
            linkPath = "/clash-royale";
          }

          return (
            <div key={item.id} className={`bs-news-card ${item.colorClass}`}>
              <div className="bs-news-image-container">
                <img
                  src={`${process.env.REACT_APP_API_URL}${item.image}`}
                  alt={item.title}
                  className="bs-news-image"
                />
                <div className="bs-news-date">{item.date}</div>
              </div>

              <div className="bs-news-content">
                <h3 className="bs-news-title">{item.title}</h3>
                <h4 className="bs-news-subtitle">{item.subtitle}</h4>
                <p className="bs-news-description">{item.description}</p>

                <div className="bs-news-footer">
                  <span className="bs-news-character">
                    <span className="character-label">Игра: </span>
                    {item.game}
                  </span>

                  {/* Используем Link для создания ссылки */}
                  <Link to={linkPath} className="bs-read-more">
                    ЧИТАТЬ
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {currentNews.length === 0 && (
        <div className="bs-no-news">
          <p>Новости в данной категории не найдены</p>
        </div>
      )}

      <div className="bs-pagination">
        <button
          className="bs-page-button prev"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>

        {[...Array(Math.ceil(filteredNews.length / newsPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              className={`bs-page-button ${currentPage === number + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(number + 1)}
            >
              {number + 1}
            </button>
          ),
        )}

        <button
          className="bs-page-button next"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredNews.length / newsPerPage)),
            )
          }
          disabled={
            currentPage === Math.ceil(filteredNews.length / newsPerPage)
          }
        >
          →
        </button>
      </div>
    </div>
  );
}
