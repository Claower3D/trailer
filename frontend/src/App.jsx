import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
          <span style={{cursor: 'pointer', transition: 'color 0.3s'}} onMouseOver={(e) => e.target.style.color='var(--primary)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'} onClick={() => changeLanguage('kz')}>KZ</span>
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [trailersCount, setTrailersCount] = useState(0);

  useEffect(() => {
    const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api/trailers' : '/api/trailers';
    fetch(API_URL).then(res => res.json()).then(data => setTrailersCount(data.length)).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-title">
          <h1>Панель управления</h1>
          <p>Управление промышленной платформой TrailerPro.</p>
        </div>
        <button className="apply-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Применить изменения
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section-title">
          <h4>Главная панель</h4>
          <h2>Выберите раздел для управления</h2>
          <p>Нажмите на плитку чтобы открыть нужный раздел администрирования.</p>
        </div>

        <div className="dashboard-grid">
          {/* Card 1 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/leads')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">0</div>
                <div className="dashboard-card-stat-label">Заявок</div>
              </div>
            </div>
            <div className="dashboard-card-category">Клиентская база</div>
            <div className="dashboard-card-title">Заявки и Лиды</div>
            <div className="dashboard-card-desc">Обрабатывайте новые обращения клиентов, меняйте статусы и управляйте заказами.</div>
            <div className="dashboard-card-action" style={{color: '#10b981'}}>Управление &rarr;</div>
          </div>

          {/* Card 2 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/catalog')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">{trailersCount}</div>
                <div className="dashboard-card-stat-label">Услуг</div>
              </div>
            </div>
            <div className="dashboard-card-category">Список услуг</div>
            <div className="dashboard-card-title">Каталог (Услуги)</div>
            <div className="dashboard-card-desc">Управляйте описанием прицепов, изображениями, видео и переводами.</div>
            <div className="dashboard-card-action" style={{color: '#3b82f6'}}>Управление &rarr;</div>
          </div>

          {/* Card 3 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/builder')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">7</div>
                <div className="dashboard-card-stat-label">Страниц</div>
              </div>
            </div>
            <div className="dashboard-card-category">Конструктор страниц</div>
            <div className="dashboard-card-title">Visual Builder</div>
            <div className="dashboard-card-desc">Перетаскивайте блоки, добавляйте медиа и настраивайте каждую страницу сайта.</div>
            <div className="dashboard-card-action" style={{color: '#8b5cf6'}}>Открыть Builder &rarr;</div>
          </div>

          {/* Card 4 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/content')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#eab308', background: 'rgba(234, 179, 8, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">3</div>
                <div className="dashboard-card-stat-label">Языка</div>
              </div>
            </div>
            <div className="dashboard-card-category">Тексты и переводы</div>
            <div className="dashboard-card-title">Контент</div>
            <div className="dashboard-card-desc">Редактируйте все тексты сайта на русском, казахском и английском языках.</div>
            <div className="dashboard-card-action" style={{color: '#eab308'}}>Управление &rarr;</div>
          </div>

          {/* Card 5 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/bot')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">-</div>
                <div className="dashboard-card-stat-label">Сценариев</div>
              </div>
            </div>
            <div className="dashboard-card-category">Автоматизация</div>
            <div className="dashboard-card-title">Бот Иришка</div>
            <div className="dashboard-card-desc">Редактируйте сценарии ответов, ключевые слова и стандартные реплики ассистента.</div>
            <div className="dashboard-card-action" style={{color: '#3b82f6'}}>Управление &rarr;</div>
          </div>

          {/* Card 6 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/seo')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#64748b', background: 'rgba(100, 116, 139, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num" style={{fontSize: '1.2rem'}}>SEO</div>
              </div>
            </div>
            <div className="dashboard-card-category">Контент и SEO</div>
            <div className="dashboard-card-title">Настройка Статей</div>
            <div className="dashboard-card-desc">Управление индивидуальными SEO-текстами для страниц.</div>
            <div className="dashboard-card-action" style={{color: '#f8fafc'}}>Перейти в Каталог &rarr;</div>
          </div>
          
          {/* Card 7 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/catalog')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#eab308', background: 'rgba(234, 179, 8, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">-</div>
                <div className="dashboard-card-stat-label">Категорий</div>
              </div>
            </div>
            <div className="dashboard-card-category">Настройка карточек</div>
            <div className="dashboard-card-title">Каталог услуг (Главная)</div>
            <div className="dashboard-card-desc">Редактируйте фото и карточки каталога на главной странице.</div>
            <div className="dashboard-card-action" style={{color: '#eab308'}}>Настроить фото &rarr;</div>
          </div>
          
          {/* Card 8 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/gallery')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">-</div>
                <div className="dashboard-card-stat-label">Фото</div>
              </div>
            </div>
            <div className="dashboard-card-category">Галерея</div>
            <div className="dashboard-card-title">Наши работы</div>
            <div className="dashboard-card-desc">Редактируйте фото блока "Наши работы" на всех страницах.</div>
            <div className="dashboard-card-action" style={{color: '#ec4899'}}>Настроить фото &rarr;</div>
          </div>
          
          {/* Card 9 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/staff')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">1</div>
                <div className="dashboard-card-stat-label">Мастеров</div>
              </div>
            </div>
            <div className="dashboard-card-category">Сотрудники</div>
            <div className="dashboard-card-title">Наши мастера</div>
            <div className="dashboard-card-desc">Управляйте списком мастеров: фото, имя, опыт работы.</div>
            <div className="dashboard-card-action" style={{color: '#ef4444'}}>Редактировать мастеров &rarr;</div>
          </div>
          
          {/* Card 10 */}
          <div className="dashboard-card" onClick={() => navigate('/admin/security')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: '#f8fafc', background: 'rgba(255, 255, 255, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div className="dashboard-card-stat">
                <div className="dashboard-card-stat-num">-</div>
              </div>
            </div>
            <div className="dashboard-card-category">Безопасность</div>
            <div className="dashboard-card-title" style={{marginBottom: '0'}}>Разрешённые IP и настройки</div>
          </div>

          {/* Back to site */}
          <div className="dashboard-card" onClick={() => navigate('/')}>
            <div className="dashboard-card-top">
              <div className="dashboard-card-icon" style={{color: 'var(--text-main)', background: 'rgba(255, 255, 255, 0.1)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </div>
            </div>
            <div className="dashboard-card-category">Сайт</div>
            <div className="dashboard-card-title">Вернуться на сайт</div>
            <div className="dashboard-card-desc">Перейти на главную страницу сайта для просмотра изменений.</div>
            <div className="dashboard-card-action" style={{color: 'var(--text-main)'}}>Перейти &rarr;</div>
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
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
