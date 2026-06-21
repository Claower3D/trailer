import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/trailers' : '/api/trailers';
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTrailers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trailers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          Trailer<span>Pro</span>
        </div>
        <nav className="nav-links">
          <a href="#home" className="nav-link">Главная</a>
          <a href="#catalog" className="nav-link">Модели</a>
          <a href="#about" className="nav-link">О нас</a>
        </nav>
        <button className="contact-btn">Заказать звонок</button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="badge">Премиум Качество 2026</span>
            <h1>Надежные прицепы для экстремальных задач</h1>
            <p>Созданы для долговечности. Спроектированы для удобства. Откройте для себя наш новый модельный ряд профессиональных прицепов для любых видов грузоперевозок.</p>
            <div className="hero-buttons">
              <button className="cta-btn" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
                Смотреть каталог
              </button>
              <button className="cta-btn-outline">
                Видеообзор
              </button>
            </div>
          </div>
        </section>

        <section id="catalog" className="section">
          <div className="section-bg-glow"></div>
          <div className="section-header">
            <h3 className="section-subtitle">Модельный ряд</h3>
            <h2 className="section-title">Выберите свой прицеп</h2>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: '#94a3b8' }}>Синхронизация с базой данных...</div>
          ) : (
            <div className="trailers-grid">
              {trailers.map(trailer => (
                <div key={trailer.id} className="trailer-card">
                  <div className="image-wrapper">
                    <img src={trailer.imageUrl} alt={trailer.title} className="trailer-image" />
                    <div className="price-tag">${trailer.price.toLocaleString()}</div>
                  </div>
                  <div className="trailer-content">
                    <h3 className="trailer-title">{trailer.title}</h3>
                    <p className="trailer-desc">{trailer.description}</p>
                    <ul className="features-list">
                      {trailer.features.map((feature, idx) => (
                        <li key={idx}>
                          <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="trailer-footer">
                      <button className="buy-btn">Оформить заявку</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo">Trailer<span>Pro</span></div>
        <p>© 2026 TrailerPro Industries. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;
