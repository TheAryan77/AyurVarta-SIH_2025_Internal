import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Quiz from './pages/Quiz';
import DietPlan from './pages/DietPlan';
import Blog from './pages/Blog';
import Faq from './pages/Faq';
import Auth from './pages/Auth';
import './global.css';

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/blog" element={<Blog />} />
    <Route path="/faq" element={<Faq />} />
    <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
  <Footer />
  <Chatbot />
    </Router>
  );
}

export default App;
