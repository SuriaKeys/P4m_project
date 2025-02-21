import React, { useState, useEffect } from 'react';
import './styles.css';
import logoSplash from './assets/images/logo_splash.PNG';
import logoAbout from './assets/images/logo_about.png';


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

const Navigation = () => (
    <nav className="nav">
        <ul className="nav__list">
            <li><a href="#home" className="nav__link active-link"><i className="ri-home-smile-2-line"></i></a></li>
            <li><a href="#about" className="nav__link"><i className="ri-user-line"></i></a></li>
            <li><a href="#projects" className="nav__link"><i className="ri-briefcase-line"></i></a></li>
            <li><a href="#contact" className="nav__link"><i className="ri-send-plane-line"></i></a></li>
        </ul>
    </nav>
);

const About = () => (
    <section className="section" id="about">
        <h1>Про нас</h1>
        <div className="about-logo">
        <img src={logoAbout} alt="Logo" className="about-logo-img" />
        </div>
        <p>PayForMe - це платформа для збирання коштів для військових бригад та їхніх потреб.</p>
        <p>Наша платформа надає можливість кожному долучитися до збору коштів та допомогти тим, хто найбільше потребує допомоги. Ми впевнені, що разом ми можемо зробити значущий внесок у перемогу💙💛</p>
    </section>
);

const Donations = () => (
    <section className="section" id="home">
        <h1>Актуальні збори</h1>
        {donations.map(donation => (
            <div className="donation-card" key={donation.id}>
                <h2>{donation.title}</h2>
                <p>{donation.description}</p>
                <p>Зібрано: {donation.amountRaised} / {donation.goal} грн</p>
                <a href={donation.link} className="donation-link">Долучитися</a>
            </div>
        ))}
    </section>
);

const Contact = () => (
    <section className="section" id="contact">
        <h1>Підтримка</h1>
    </section>
);

const Projects = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            if (!apiKey) {
                console.error("API ключ не встановлено");
                return;
            }
            try {
                const response = await fetch(`https://api.currentsapi.services/v1/search?keywords=Ukraine&apiKey=${apiKey}`);
                if (!response.ok) throw new Error(`HTTP помилка: ${response.status}`);
                const data = await response.json();
                setNews(data.news || []);
            } catch (error) {
                console.error("Помилка отримання новин:", error);
            }
        };
        fetchNews();
    }, []);

    return (
        <section className="section" id="projects">
            <h1>Новини - Live</h1>
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
        </section>
    );
};

const App = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <div>
            {showSplash ? <SplashScreen onHide={() => setShowSplash(false)} /> : (
                <>
                    <Navigation />
                    <main className="container">
                        <Donations />
                        <About />
                        <Projects />
                        <Contact />
                    </main>
                </>
            )}
        </div>
    );
};

export default App;
