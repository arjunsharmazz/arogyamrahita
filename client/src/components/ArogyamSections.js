import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/ArogyamSections.module.css';
import vegetablesImg from '../images/ourproductrange.jpg';
import clustersImg from '../images/WhoWeAre.jpeg';

const ArogyamSections = () => {
  const navigate = useNavigate();

  const handleCardClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>
        <div 
          className={styles.card}
          onClick={() => handleCardClick('Vegetables')}
        >
          <img src={vegetablesImg} alt="Arogyam Vegetables" className={styles.cardImage} />
          <h3 className={styles.cardTitle}>Arogyam Vegetables</h3>
        </div>
        <div 
          className={styles.card}
          onClick={() => handleCardClick('Clusters')}
        >
          <img src={clustersImg} alt="Arogyam Clusters" className={styles.cardImage} />
          <h3 className={styles.cardTitle}>Arogyam Clusters</h3>
        </div>
      </div>
    </div>
  );
};

export default ArogyamSections;