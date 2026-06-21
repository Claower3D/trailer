import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        Trailer<span>Pro</span>
      </Link>
      <nav className="nav-links">
        <Link to="/" className="nav-link">{t('nav_home')}</Link>
        <Link to="/catalog" className="nav-link">{t('nav_catalog')}</Link>
        <Link to="/about" className="nav-link">{t('nav_about')}</Link>
      </nav>
      <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <div className="lang-switcher" style={{display: 'flex', gap: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold'}}>
          <span style={{cursor: 'pointer', transition: 'color 0.3s'}} onMouseOver={(e) => e.target.style.color='var(--primary)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'} onClick={() => changeLanguage('ru')}>RU</span>
          <span style={{cursor: 'pointer', transition: 'color 0.3s'}} onMouseOver={(e) => e.target.style.color='var(--primary)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'} onClick={() => changeLanguage('en')}>EN</span>
          <span style={{cursor: 'pointer', transition: 'color 0.3s'}} onMouseOver={(e) => e.target.style.color='var(--primary)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'} onClick={() => changeLanguage('de')}>DE</span>
        </div>
        <button className="contact-btn">{t('btn_call')}</button>
      </div>
    </header>
  );
}

function Home() {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="badge">{t('badge_premium')}</span>
        <h1>{t('hero_title')}</h1>
        <p>{t('hero_desc')}</p>
        <div className="hero-buttons">
          <Link to="/catalog" className="cta-btn">{t('btn_catalog')}</Link>
          <button className="cta-btn-outline">{t('btn_video')}</button>
        </div>
      </div>
    </section>
  );
}

function Catalog() {
  const { t } = useTranslation();
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
    <section className="section" style={{minHeight: '100vh', paddingTop: '120px'}}>
      <div className="section-bg-glow"></div>
      <div className="section-header">
        <h3 className="section-subtitle">{t('catalog_subtitle')}</h3>
        <h2 className="section-title">{t('catalog_title')}</h2>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: '#94a3b8' }}>{t('loading')}</div>
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
                  <button className="buy-btn">{t('btn_buy')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function About() {
  const { t } = useTranslation();
  return (
    <section className="section" style={{minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="section-bg-glow"></div>
      <div style={{textAlign: 'center', maxWidth: '800px'}}>
        <h2 className="section-title">{t('nav_about')}</h2>
        <p style={{fontSize: '1.2rem', color: '#94a3b8'}}>{t('hero_desc')}</p>
      </div>
    </section>
  );
}

function App() {
  const { t } = useTranslation();
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main style={{flexGrow: 1}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-logo">Trailer<span>Pro</span></div>
          <p>© 2026 TrailerPro Industries. {t('footer_rights')}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
