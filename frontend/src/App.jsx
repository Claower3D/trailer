import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

const ThemeContext = createContext();

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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
          <span style={{cursor: 'pointer', transition: 'color 0.3s'}} onMouseOver={(e) => e.target.style.color='var(--primary)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'} onClick={() => changeLanguage('kz')}>KZ</span>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? (
            /* Sun icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <button className="contact-btn">{t('btn_call')}</button>
      </div>
    </header>
  );
}

function Home() {
  return (
    <>
      <FullWidthBanner />
      <HeroBanner />
      <CategoryCards />
      <TrailerCatalog />
      <CategoryIcons />
    </>
  );
}

// ─── FULL WIDTH BANNER ────────────────────────────────────────────────────
function FullWidthBanner() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `url('/cargo_trailer.png') center/cover no-repeat`,
        filter: 'brightness(0.4)',
        zIndex: 0,
      }} />

      {/* Orange gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(249,115,22,0.18) 50%, rgba(0,0,0,0.6) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '4rem 2rem',
        width: '100%',
      }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #f97316, #f59e0b)',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: '800',
            padding: '0.4rem 1.2rem',
            borderRadius: '100px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            🏆 Лидер рынка Казахстана
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1.05',
            letterSpacing: '-2px',
            marginBottom: '1.5rem',
          }}>
            Прицепы для<br />
            <span style={{ color: '#f97316' }}>настоящих</span> задач
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.7',
            marginBottom: '2.5rem',
            maxWidth: '500px',
          }}>
            Широкий выбор прицепов для любого автомобиля. Гарантия 1 год, доставка по всему Казахстану. Рассрочка 0% через Kaspi.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={{
              padding: '1.1rem 2.8rem',
              background: 'linear-gradient(135deg, #f97316, #f59e0b)',
              color: '#fff',
              fontWeight: '900',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 10px 30px rgba(249,115,22,0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 16px 40px rgba(249,115,22,0.65)'; }}
            onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 30px rgba(249,115,22,0.5)'; }}
            >
              Смотреть каталог
            </button>
            <a href="tel:+77000000000" style={{
              padding: '1.1rem 2.2rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1rem',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#f97316'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.95 5.95l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +7 700 000 00 00
            </a>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
          }}>
            {[
              { num: '500+', label: 'Прицепов в наличии' },
              { num: '10 лет', label: 'На рынке' },
              { num: '0%', label: 'Рассрочка' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f97316', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.3rem', fontWeight: '600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        animation: 'bounceY 2s ease-in-out infinite',
      }}>
        <span>Прокрутить</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

// ─── HERO BANNER ──────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <section style={{ paddingTop: '90px', background: 'var(--bg-color)' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 1rem' }}>
        <div style={{
          display: 'inline-block',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: '800',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '0.8rem',
          padding: '0.4rem 1.2rem',
          border: '1px solid rgba(249,115,22,0.3)',
          borderRadius: '100px',
          background: 'rgba(249,115,22,0.08)',
        }}>
          Почему выбирают нас
        </div>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: '900',
          color: 'var(--text-main)',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          Наши преимущества и условия
        </h2>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 2rem 3rem', display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* LEFT: Info blocks */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="info-block">
            <div className="info-block-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <h4 className="info-block-title">СКИДКА ПРИ ЗАКАЗЕ</h4>
              <p className="info-block-text">Вы можете заказать прицеп со следующего поступления, если его нет в наличии или если просто хотите сэкономить.</p>
            </div>
          </div>
          <div className="info-block">
            <div className="info-block-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div>
              <h4 className="info-block-title">КРЕДИТ И РАССРОЧКА</h4>
              <p className="info-block-text">Самые выгодные кредиты от Kaspi банк, Альфа банк и Евразийского банка. Купите сегодня — платите потом.</p>
            </div>
          </div>
          <div className="info-block">
            <div className="info-block-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h4 className="info-block-title">ГАРАНТИЯ 1 ГОД</h4>
              <p className="info-block-text">На все прицепы распространяется официальная гарантия производителя сроком 12 месяцев.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Big hero image */}
        <div className="hero-banner-img" style={{ flex: '1 1 600px', position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '400px' }}>
          <img src="/utility_trailer.png" alt="Прицепы и комплектующие" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(0,0,0,0.7) 100%)' }}/>
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', color: '#fff', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '1px', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1.2rem', borderRadius: '8px', backdropFilter: 'blur(8px)' }}>
            +7 700 000 00 00
          </div>
          <div className="hero-banner-label">
            ПРИЦЕПЫ И КОМПЛЕКТУЮЩИЕ
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── CATEGORY SLIDER ─────────────────────────────────────────────────────
function CategoryCards() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      label: 'АВТОПРИЦЕПЫ',
      name: 'ОДНООСНЫЕ',
      desc: 'Лёгкие и манёвренные прицепы для перевозки любых грузов. Идеальны для легковых автомобилей.',
      img: '/utility_trailer.png',
      badge: 'Хит продаж',
      price: '450 000 ₸'
    },
    {
      id: 2,
      label: 'АВТОПРИЦЕПЫ',
      name: 'ДВУХОСНЫЕ',
      desc: 'Надёжные двухосные прицепы с усиленной рамой для перевозки тяжёлых и габаритных грузов.',
      img: '/cargo_trailer.png',
      badge: 'Рассрочка 0%',
      price: '850 000 ₸'
    },
    {
      id: 3,
      label: 'ПРИЦЕПЫ',
      name: 'ДЛЯ ЛОДОК',
      desc: 'Специализированные лодочные прицепы с оцинкованной рамой для удобного спуска на воду.',
      img: '/boat_trailer.png',
      badge: 'Новинка',
      price: '680 000 ₸'
    },
  ];

  const goTo = (idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => next(), 4500);
    return () => clearInterval(timer);
  }, [current]);

  const slide = slides[current];

  return (
    <section style={{ padding: '2rem 2rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div className="slider-wrap">

        {/* Slide */}
        <div className="slider-slide" key={current} style={{ animationName: 'sliderIn' }}>
          {/* Left info */}
          <div className="slider-info">
            <div className="slider-badge">{slide.badge}</div>
            <div className="slider-label">{slide.label}</div>
            <h2 className="slider-title">{slide.name}</h2>
            <p className="slider-desc">{slide.desc}</p>
            <div className="slider-price">{slide.price}</div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button className="cat-card-btn">ПОДРОБНЕЕ</button>
              <button className="slider-order-btn">ЗАКАЗАТЬ</button>
            </div>
          </div>

          {/* Right image */}
          <div className="slider-img-wrap">
            <img src={slide.img} alt={slide.name} className="slider-img" />
          </div>
        </div>

        {/* Controls */}
        <button className="slider-arrow slider-arrow-prev" onClick={prev}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button className="slider-arrow slider-arrow-next" onClick={next}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`slider-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="slider-progress">
          <div className="slider-progress-bar" key={current} />
        </div>

      </div>
    </section>
  );
}

// ─── TABBED CATALOG ──────────────────────────────────────────────────────
function TrailerCatalog() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['ВСЕ МОДЕЛИ', 'ОДНООСНЫЕ', 'ДВУХОСНЫЕ', 'ДЛЯ ЛОДОК'];

  useEffect(() => {
    const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/trailers' : '/api/trailers';
    fetch(API_URL)
      .then(res => res.json())
      .then(data => { setTrailers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '4rem 2rem 6rem', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--text-main)', textAlign: 'center' }}>
        Автоприцепы и запчасти
      </h2>

      {/* Tabs */}
      <div className="catalog-tabs">
        {tabs.map((tab, i) => (
          <button key={i} className={`catalog-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>Загрузка...</div>
      ) : (
        <div className="product-grid">
          {trailers.map(trailer => (
            <div key={trailer.id} className="product-card">
              <div className="product-card-img-wrap">
                <img src={trailer.imageUrl} alt={trailer.title} className="product-card-img" />
                <div className="product-sale-badge">В НАЛИЧИИ</div>
              </div>
              <div className="product-card-body">
                <div className="product-card-cat">ПРИЦЕП</div>
                <h3 className="product-card-title">{trailer.title}</h3>
                <div className="product-card-stars">
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f97316' }}>★</span>)}
                </div>
                <div className="product-card-footer">
                  <div className="product-card-price">{trailer.price.toLocaleString()} ₸</div>
                  <button className="product-card-add-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── CATEGORY ICONS ───────────────────────────────────────────────────────
function CategoryIcons() {
  const [active, setActive] = useState(null);

  const cats = [
    {
      id: 0,
      label: 'ДЛЯ ГРУЗОВ',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="52" height="28" rx="3" stroke="currentColor" strokeWidth="3"/>
          <rect x="56" y="16" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
          <circle cx="18" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="62" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <line x1="4" y1="36" x2="76" y2="36" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
    },
    {
      id: 1,
      label: 'ДЛЯ ЛОДОК',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 28 Q20 10 40 12 Q60 14 72 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="40" y1="12" x2="40" y2="4" stroke="currentColor" strokeWidth="3"/>
          <path d="M8 28 L4 36 L76 36 L72 28" stroke="currentColor" strokeWidth="3"/>
          <circle cx="18" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="62" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
    },
    {
      id: 2,
      label: 'ДЛЯ КВАДРОЦИКЛОВ',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="14" width="44" height="22" rx="3" stroke="currentColor" strokeWidth="3"/>
          <path d="M48 20 L72 20 L72 36 L48 36" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
          <circle cx="55" cy="22" r="4" stroke="currentColor" strokeWidth="2.5"/>
          <circle cx="16" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="60" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <line x1="4" y1="36" x2="76" y2="36" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
    },
    {
      id: 3,
      label: 'ДЛЯ СНЕГОХОДОВ',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="14" width="50" height="22" rx="3" stroke="currentColor" strokeWidth="3"/>
          <path d="M54 18 L76 24 L76 36 L54 36" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
          <circle cx="16" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="60" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <line x1="4" y1="36" x2="76" y2="36" stroke="currentColor" strokeWidth="3"/>
          <line x1="20" y1="14" x2="20" y2="8" stroke="currentColor" strokeWidth="2.5"/>
          <line x1="36" y1="14" x2="36" y2="8" stroke="currentColor" strokeWidth="2.5"/>
        </svg>
      ),
    },
    {
      id: 4,
      label: 'КОММЕРЧЕСКИЕ',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="58" height="30" rx="3" stroke="currentColor" strokeWidth="3"/>
          <rect x="60" y="12" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="3"/>
          <circle cx="16" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="50" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <circle cx="70" cy="44" r="7" stroke="currentColor" strokeWidth="3"/>
          <line x1="2" y1="36" x2="78" y2="36" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
    },
    {
      id: 5,
      label: 'ЗАПЧАСТИ',
      icon: (
        <svg viewBox="0 0 80 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="27" r="18" stroke="currentColor" strokeWidth="3"/>
          <circle cx="40" cy="27" r="8" stroke="currentColor" strokeWidth="3"/>
          <line x1="40" y1="4" x2="40" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="40" y1="40" x2="40" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="17" y1="27" x2="27" y2="27" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="53" y1="27" x2="63" y2="27" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section style={{ background: 'var(--surface-color)', padding: '5rem 2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-block', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.8rem', padding: '0.4rem 1.2rem', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '100px', background: 'rgba(249,115,22,0.08)' }}>
            Категории товаров
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Найдите прицеп под вашу задачу
          </h2>
        </div>

        {/* Icons row */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {cats.map(cat => (
            <button
              key={cat.id}
              className={`cat-icon-btn ${active === cat.id ? 'active' : ''}`}
              onClick={() => setActive(active === cat.id ? null : cat.id)}
            >
              <div className="cat-icon-svg">{cat.icon}</div>
              <span className="cat-icon-label">{cat.label}</span>
            </button>
          ))}
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
                <div className="price-tag">{trailer.price.toLocaleString()} ₸</div>
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [trailersCount, setTrailersCount] = useState(0);

  useEffect(() => {
    const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/trailers' : '/api/trailers';
    fetch(API_URL).then(res => res.json()).then(data => setTrailersCount(data.length)).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-title">
          <h1 style={{fontSize: '2rem', fontWeight: '900', letterSpacing: '1px'}}>ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
          <p style={{color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.5rem'}}>Управление промышленной платформой TrailerPro.</p>
        </div>
        <button className="apply-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          ПРИМЕНИТЬ ИЗМЕНЕНИЯ
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section-title">
          <h4 style={{color: '#00e57c', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '0.5rem'}}>ГЛАВНАЯ ПАНЕЛЬ</h4>
          <h2 style={{fontSize: '2.2rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '-0.5px'}}>ВЫБЕРИТЕ РАЗДЕЛ ДЛЯ УПРАВЛЕНИЯ</h2>
          <p style={{color: '#71717a', fontSize: '0.9rem'}}>Нажмите на плитку чтобы открыть нужный раздел администрирования.</p>
        </div>

        <div className="dashboard-grid">
          {/* Card 1 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/leads')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#00e57c', background: 'rgba(0, 229, 124, 0.1)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">0</div>
                <div className="dashboard-card-stat-label">ЗАЯВОК</div>
              </div>
            </div>
            <div className="dashboard-card-category">КЛИЕНТСКАЯ БАЗА</div>
            <div className="dashboard-card-title">Заявки и Лиды</div>
            <div className="dashboard-card-desc">Обрабатывайте новые обращения клиентов, меняйте статусы и связывайтесь с покупателями.</div>
            <div className="dashboard-card-action" style={{color: '#00e57c'}}>Управление &rarr;</div>
          </div>

          {/* Card 2 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/catalog')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">{trailersCount}</div>
                <div className="dashboard-card-stat-label">ПРИЦЕПОВ</div>
              </div>
            </div>
            <div className="dashboard-card-category">КАТАЛОГ ПРОДУКЦИИ</div>
            <div className="dashboard-card-title">Модели прицепов</div>
            <div className="dashboard-card-desc">Добавляйте новые модели, редактируйте цены, характеристики и фото прицепов.</div>
            <div className="dashboard-card-action" style={{color: '#3b82f6'}}>Управление каталогом &rarr;</div>
          </div>

          {/* Back to site */}
          <div className="dashboard-card" onClick={() => navigate('/')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#a1a1aa', background: 'rgba(161, 161, 170, 0.1)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </div>
              <div className="dashboard-card-stat"></div>
            </div>
            <div className="dashboard-card-category">НАВИГАЦИЯ</div>
            <div className="dashboard-card-title">Вернуться на сайт</div>
            <div className="dashboard-card-desc">Перейти на главную страницу сайта для просмотра изменений в каталоге.</div>
            <div className="dashboard-card-action" style={{color: '#ffffff'}}>Перейти &rarr;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCatalog() {
  const navigate = useNavigate();
  const [trailers, setTrailers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', imageUrl: '', features: '' });

  const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/trailers' : '/api/trailers';

  const fetchTrailers = () => {
    fetch(API_URL).then(res => res.json()).then(data => setTrailers(data));
  };

  useEffect(() => {
    fetchTrailers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.split(',').map(f => f.trim())
    };
    const method = editingId ? 'PUT' : 'POST';
    if (editingId) payload.id = editingId;

    fetch(API_URL, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      setEditingId(null);
      setShowForm(false);
      setFormData({ title: '', description: '', price: '', imageUrl: '', features: '' });
      fetchTrailers();
    });
  };

  const handleDelete = (id) => {
    if(window.confirm('Удалить этот прицеп?')) {
      fetch(`${API_URL}?id=${id}`, { method: 'DELETE' }).then(() => fetchTrailers());
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      title: t.title,
      description: t.description,
      price: t.price,
      imageUrl: t.imageUrl,
      features: t.features.join(', ')
    });
    setShowForm(true);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Trailer<span>Pro</span> <small>Admin</small>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Каталог
          </div>
          <div className="admin-nav-item" onClick={() => navigate('/admin')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Панель управления
          </div>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <h2 style={{fontWeight: 800, fontSize: '1.5rem'}}>Управление каталогом</h2>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>A</div>
          </div>
        </header>
        <div className="admin-content">
          
          <div className="admin-stat-cards">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <div className="admin-stat-info">
                <h3>Всего прицепов</h3>
                <p>{trailers.length}</p>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.5rem'}}>Список моделей</h3>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="cta-btn" style={{padding: '0.8rem 1.5rem', fontSize: '0.9rem'}}>+ Добавить прицеп</button>
            )}
          </div>

          {showForm ? (
            <div style={{background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem'}}>
              <h3 style={{marginBottom: '1.5rem'}}>{editingId ? 'Редактировать прицеп' : 'Новый прицеп'}</h3>
              <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                <div style={{gridColumn: '1 / -1'}}><input className="admin-input" name="title" value={formData.title} onChange={handleChange} placeholder="Название модели" required /></div>
                <div style={{gridColumn: '1 / -1'}}><textarea className="admin-input" name="description" value={formData.description} onChange={handleChange} placeholder="Полное описание" required style={{minHeight: '120px'}} /></div>
                <div><input className="admin-input" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Цена в $" required /></div>
                <div><input className="admin-input" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL изображения" required /></div>
                <div style={{gridColumn: '1 / -1'}}><input className="admin-input" name="features" value={formData.features} onChange={handleChange} placeholder="Характеристики (через запятую)" required /></div>
                <div style={{gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                  <button type="submit" className="cta-btn">{editingId ? 'Сохранить' : 'Добавить'}</button>
                  <button type="button" onClick={() => {setShowForm(false); setEditingId(null); setFormData({ title: '', description: '', price: '', imageUrl: '', features: '' })}} className="cta-btn-outline">Отмена</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Фото</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th style={{textAlign: 'right'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {trailers.map(t => (
                    <tr key={t.id}>
                      <td style={{width: '80px'}}><img src={t.imageUrl} alt={t.title} style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /></td>
                      <td style={{fontWeight: 'bold'}}>{t.title}</td>
                      <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>${t.price}</td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => handleEdit(t)} className="admin-action-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="admin-action-btn delete" style={{marginLeft: '0.5rem'}}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Admin() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/catalog" element={<AdminCatalog />} />
    </Routes>
  );
}

function MainLayout() {
  const { t } = useTranslation();
  return (
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
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
