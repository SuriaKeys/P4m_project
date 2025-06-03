import React, { useState, useEffect } from 'react';
import './styles.css';
import logoSplash from './assets/images/logo_splash.PNG';
import logoAbout from './assets/images/logo_about.png';
import CryptoJS from 'crypto-js';
import { RiInformationLine, RiHomeLine, RiUserLine, RiBriefcaseLine, RiSendPlaneLine } from 'react-icons/ri';

const apiKey = process.env.REACT_APP_CURRENTS_API_KEY;


// test forms
const donations = [
    { id: 1, title: "Допомога 3-й ОШБ", description: "Збір на дрони для 3-ї ОШБ", amountRaised: 12000, goal: 50000, link: "#" },
    { id: 2, title: "Автомобіль для 47-ї бригади", description: "Збір на пікап для 47 ОМБР", amountRaised: 30000, goal: 70000, link: "#" }
];

const quotes = [
    "ЗАДОНАТЬ НА МЕНЕ!",
    "Разом ми сильніші!",
    "Не будь байдужим!",
    "Твоя допомога важлива!",
    "Твоя копійка спасе життя!",
    "Один - в полі не воїн!",
    "Підтримай козаків!",
    "Народ та ЗСУ - одне ціле!",
    "Нам Бог помагає!",
    "Поле боя одне та для всіх!",
    "Хто з мечем прийде, той і від меча злягне!"
];

const SplashScreen = ({ onHide }) => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        const timer = setTimeout(onHide, 3500);
        return () => clearTimeout(timer);
    }, [onHide]);

    return (
        <div className="splash-screen">
            <div className="splash-content">
            <img src={logoSplash} alt="Logo" className="logo" />
                <div className="quote">{quote}</div>
            </div>
        </div>
    );
};

const BottomNavigation = ({ activeSection, setActiveSection }) => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
        }
    };

    return (
        <nav className="bottom-nav-tiktok">
            <div 
                className={`nav-icon ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => scrollToSection('home')}
            >
                <RiHomeLine />
                <span>Збори</span>
            </div>
            <div 
                className={`nav-icon ${activeSection === 'about' ? 'active' : ''}`}
                onClick={() => scrollToSection('about')}
            >
                <RiUserLine />
                <span>Про нас</span>
            </div>
            <div 
                className={`nav-icon ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => scrollToSection('projects')}
            >
                <RiBriefcaseLine />
                <span>Новини</span>
            </div>
            <div 
                className={`nav-icon ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => scrollToSection('contact')}
            >
                <RiSendPlaneLine />
                <span>Підтримка</span>
            </div>
        </nav>
    );
};


const About = () => (
    <section className="section" id="about">
        <h1>Про нас</h1>
        <div className="about-logo">
            <img src={logoAbout} alt="Logo" className="about-logo-img" />
        </div>
        <p className="bold-text">PayForMe - це платформа для збирання коштів для військових бригад та їхніх потреб.</p>
        <p className="bold-text">Наша платформа надає можливість кожному долучитися до збору коштів та допомогти тим, хто найбільше потребує допомоги. Ми впевнені, що разом ми можемо зробити значущий внесок у перемогу💙💛</p>
    </section>
);


const Donations = () => {

  const handleDonateClick = (donation) => {
    const publicKey = "sandbox_i4691273190";
    const amount = 100; 
    const currency = "UAH";
    const description = encodeURIComponent(donation.title);

    const url = `https://www.liqpay.ua/api/checkout?public_key=${publicKey}&amount=${amount}&currency=${currency}&description=${description}&sandbox=1`;

    window.open(url, "_blank");
  };

  return (
    <section className="section" id="home">
      <h1>Актуальні збори</h1>
      {donations.map(donation => (
        <div className="donation-card" key={donation.id}>
          <h2>{donation.title}</h2>
          <p>{donation.description}</p>
          <p>{donation.amountRaised} / {donation.goal}</p>
          <button
            className="donation-link"
            onClick={() => handleDonateClick(donation)}
          >
            Долучитися
          </button>
        </div>
      ))}
    </section>
  );
};



const Contact = () => (
    <section className="section" id="contact">
        <h1>Підтримка</h1>
       
    </section>
);

const Projects = () => {
    const [news, setNews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [modalContent, setModalContent] = useState(""); 

    useEffect(() => {
       const fetchNews = async () => {
    if (!apiKey) {
        console.error("API ключ не встановлено");
        return;
    }
    try {
      const response = await fetch(`https://api.currentsapi.services/v1/latest-news?language=uk&keywords=Україна&apiKey=${apiKey}`);

        if (!response.ok) throw new Error(`HTTP помилка: ${response.status}`);
        const data = await response.json();
        setNews(data.news || []);
    } catch (error) {
        console.error("Помилка отримання новин:", error);
    }
};

        fetchNews();
    }, []);

    const handleInfoClick = () => {
        setModalContent("Якщо у вас не відображаються новини або виникають якісь інші проблеми, це може бути через проблему із сервером (505) або к-ть запитів закінчилися."); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(""); 
    };

    return (
        <section className="section" id="projects">
            <h1>Новини - Live <RiInformationLine onClick={handleInfoClick} className="info-icon" /></h1>
            <div id="news-container">
                {news.length > 0 ? news.map((article, index) => (
                    <div key={index} className="news-item">
                        {article.image && <img src={article.image} alt="" className="news-image" />}
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Читати більше</a>
                    </div>
                )) : <p>Новини не знайдені.</p>}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeModal}>×</span>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'projects', 'contact'];
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="app-container">
            {showSplash ? <SplashScreen onHide={() => setShowSplash(false)} /> : (
                <>
                    <main className="container">
                        <Donations />
                        <About />
                        <Projects />
                        <Contact />
                    </main>
                    <BottomNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
                </>
            )}
        </div>
    );
};

export default App;