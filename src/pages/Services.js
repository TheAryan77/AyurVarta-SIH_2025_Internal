import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import { mockServices } from '../data/mockServices';

const Services = () => {
  return (
    <div className={styles.services}>
      <section className={styles.hero}>
        <h1>Personalized Ayurvedic Guidance</h1>
        <Link to="/contact" className={styles.ctaButton}>Book a Consultation</Link>
      </section>

      <section className={styles.serviceList}>
        {mockServices.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            {/* Icon placeholder */}
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <Link to={`/services/${index}`} className={styles.learnMore}>Learn More</Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Services;
