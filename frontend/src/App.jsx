import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <header className="header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          TrailerPro
        </div>
        <nav className="nav-links">
          <a href="#home" className="nav-link">Главная</a>
          <a href="#catalog" className="nav-link">Каталог</a>
          <a href="#about" className="nav-link">О нас</a>
        </nav>
        <button className="contact-btn">Связаться с нами</button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <h1>Надежные прицепы для любых задач</h1>
            <p>Высокое качество, прочность и безопасность. Выберите идеальный прицеп для вашего автомобиля уже сегодня.</p>
            <button className="cta-btn" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
              Смотреть каталог
            </button>
          </div>
        </section>

        <section id="catalog" className="section">
          <h2 className="section-title">Каталог Прицепов</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка данных...</div>
          ) : (
            <div className="trailers-grid">
              {trailers.map(trailer => (
                <div key={trailer.id} className="trailer-card">
                  <img src={trailer.imageUrl} alt={trailer.title} className="trailer-image" />
                  <div className="trailer-content">
                    <h3 className="trailer-title">{trailer.title}</h3>
                    <p className="trailer-desc">{trailer.description}</p>
                    <ul className="features-list">
                      {trailer.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                    <div className="trailer-footer">
                      <span className="trailer-price">${trailer.price.toLocaleString()}</span>
                      <button className="buy-btn">Купить</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 TrailerPro. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;
