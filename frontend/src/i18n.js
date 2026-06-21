import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      "nav_home": "Главная",
      "nav_catalog": "Модели",
      "nav_about": "О нас",
      "btn_call": "Заказать звонок",
      "badge_premium": "Премиум Качество 2026",
      "hero_title": "Надежные прицепы для экстремальных задач",
      "hero_desc": "Созданы для долговечности. Спроектированы для удобства. Откройте для себя наш новый модельный ряд профессиональных прицепов для любых видов грузоперевозок.",
      "btn_catalog": "Смотреть каталог",
      "btn_video": "Видеообзор",
      "catalog_subtitle": "Модельный ряд",
      "catalog_title": "Выберите свой прицеп",
      "btn_buy": "Оформить заявку",
      "loading": "Синхронизация с базой данных...",
      "footer_rights": "Все права защищены."
    }
  },
  en: {
    translation: {
      "nav_home": "Home",
      "nav_catalog": "Models",
      "nav_about": "About",
      "btn_call": "Request Call",
      "badge_premium": "Premium Quality 2026",
      "hero_title": "Reliable Trailers for Extreme Tasks",
      "hero_desc": "Built for durability. Designed for convenience. Discover our new lineup of professional trailers for all types of cargo transport.",
      "btn_catalog": "View Catalog",
      "btn_video": "Video Review",
      "catalog_subtitle": "Our Lineup",
      "catalog_title": "Choose Your Trailer",
      "btn_buy": "Order Now",
      "loading": "Synchronizing with database...",
      "footer_rights": "All rights reserved."
    }
  },
  de: {
    translation: {
      "nav_home": "Startseite",
      "nav_catalog": "Modelle",
      "nav_about": "Über uns",
      "btn_call": "Rückruf anfordern",
      "badge_premium": "Premium-Qualität 2026",
      "hero_title": "Zuverlässige Anhänger für extreme Aufgaben",
      "hero_desc": "Gebaut für Langlebigkeit. Entworfen für Komfort. Entdecken Sie unser neues Angebot an professionellen Anhängern für alle Arten von Frachttransporten.",
      "btn_catalog": "Katalog ansehen",
      "btn_video": "Video-Bewertung",
      "catalog_subtitle": "Unser Sortiment",
      "catalog_title": "Wählen Sie Ihren Anhänger",
      "btn_buy": "Jetzt bestellen",
      "loading": "Mit Datenbank synchronisieren...",
      "footer_rights": "Alle Rechte vorbehalten."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
