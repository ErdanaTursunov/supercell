import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src="/img/store_logo.png"
            alt="Supercell Logo"
          />
        </div>
        
        <div className="footer-links">
          <a href="https://supercell.com" target="_blank" rel="noopener noreferrer">
            О компании
          </a>
          <a href="https://supercell.com/terms/" target="_blank" rel="noopener noreferrer">
            Условия использования
          </a>
          <a href="https://supercell.com/privacy/" target="_blank" rel="noopener noreferrer">
            Политика конфиденциальности
          </a>
        </div>

        <div className="footer-socials">
          <a href="https://twitter.com/supercell" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.facebook.com/supercell" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/supercell" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
