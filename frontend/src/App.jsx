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
  const { t } = useTranslation();
  return (
    <>
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
      <HomeCatalog />
    </>
  );
}

function HomeCatalog() {
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
    <section className="section" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="section-header" style={{textAlign: 'center', marginBottom: '4rem'}}>
        <h3 className="section-subtitle" style={{color: '#00e57c', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800'}}>{t('catalog_subtitle')}</h3>
        <h2 className="section-title" style={{fontSize: '3rem', fontWeight: '900', marginTop: '1rem'}}>Выбор Моделей</h2>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: '#94a3b8' }}>{t('loading')}</div>
      ) : (
        <div className="home-catalog-list" style={{display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          {trailers.map((trailer) => (
            <div key={trailer.id} className="home-trailer-row" style={{
              display: 'flex', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4rem',
              background: 'linear-gradient(145deg, #131316 0%, #0a0a0c 100%)',
              borderRadius: '32px',
              padding: '3.5rem',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,229,124,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'; }}
            >
              
              {/* Neon accent line */}
              <div style={{position: 'absolute', top: 0, left: '10%', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,124,0.5), transparent)'}}></div>

              <div className="home-trailer-info" style={{flex: '1 1 400px', zIndex: 2}}>
                <h3 style={{fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#ffffff', letterSpacing: '-1px', lineHeight: '1.1'}}>{trailer.title}</h3>
                <p style={{fontSize: '1.1rem', color: '#a1a1aa', lineHeight: '1.7', marginBottom: '2.5rem', fontWeight: '400'}}>{trailer.description}</p>
                
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '3rem'}}>
                  {trailer.features.map((feature, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                      padding: '0.6rem 1.2rem', borderRadius: '100px',
                      color: '#e4e4e7', fontSize: '0.9rem', fontWeight: '600', backdropFilter: 'blur(10px)'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e57c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', justifyContent: 'flex-start', marginTop: '2rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                  <div>
                    <div style={{color: '#71717a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem', fontWeight: '800'}}>Цена от</div>
                    <div style={{fontSize: '2.5rem', fontWeight: '900', color: '#00e57c', textShadow: '0 0 20px rgba(0,229,124,0.3)'}}>${trailer.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{color: '#71717a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem', fontWeight: '800'}}>Гарантия</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '800', color: '#ffffff'}}>1 Год</div>
                  </div>
                  <button style={{
                    marginLeft: 'auto',
                    padding: '1.2rem 3rem', 
                    fontSize: '1.1rem', 
                    background: 'linear-gradient(45deg, #00e57c, #00b360)', 
                    color: '#000', 
                    fontWeight: '900', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 10px 25px rgba(0,229,124,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 15px 35px rgba(0,229,124,0.6)'; }}
                  onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 25px rgba(0,229,124,0.4)'; }}
                  >
                    Заказать
                  </button>
                </div>
              </div>

              <div className="home-trailer-image" style={{flex: '1 1 400px', height: '450px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.8)'}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,229,124,0.2) 0%, transparent 50%, rgba(0,0,0,0.8) 100%)', zIndex: 1, pointerEvents: 'none'}}></div>
                <img src={trailer.imageUrl} alt={trailer.title} style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease'}} 
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>

            </div>
          ))}
        </div>
      )}
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
