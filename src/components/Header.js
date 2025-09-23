import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.leftGroup}>
        <Link to="/home" className={styles.logoWrap} aria-label="Home">
          <span className={styles.logoRing} />
          <img src="/images/logo.png" alt="Ayurved Gemini" className={styles.logoImg} />
        </Link>
        <span className={styles.brand}>AyurVarta</span>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <Link to="/home" className={styles.navLink}>Home</Link>
        <Link to="/about" className={styles.navLink}>About</Link>
        <Link to="/quiz" className={styles.navLink}>Dosha</Link>
        <Link to="/diet-plan" className={styles.navLink}>Diet</Link>
        <Link to="/services" className={styles.navLink}>Services</Link>
        <Link to="/blog" className={styles.navLink}>Blog</Link>
  <Link to="/faq" className={styles.navLink}>FAQ</Link>
      </nav>
      <div className={styles.rightGroup}>
        <Link to="/auth" className={styles.loginBtn}>Login</Link>
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
