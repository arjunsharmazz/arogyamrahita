import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/ArogyamSections.module.css';
import vegetablesImg from '../images/ourproductrange.jpg';
import clustersImg from '../images/WhoWeAre.jpeg';
import { ChevronRight } from 'lucide-react';

const ArogyamSections = () => {
  const navigate = useNavigate();
  const [, setHoveredCard] = useState(null);

  const handleCardClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const CardItem = ({ index, image, alt, badge, title, description, category }) => {
    return (
      <div className={`${styles.cardRow} ${index === 1 ? styles.cardRowReverse : ''}`}>
        {/* Circle */}
        <div
          className={styles.circleContainer}
          onMouseEnter={() => setHoveredCard(category)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick(category)}
        >
          <div className={styles.circle}>
            <img src={image} alt={alt} className={styles.circleImage} />
            <div className={styles.overlay}>
              <span className={styles.badgeTag}>{badge}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={styles.detailsContainer}>
          <h3 className={styles.detailTitle}>{title}</h3>
          <p className={styles.detailDescription}>{description}</p>
          <button 
            className={styles.detailButton}
            onClick={() => handleCardClick(category)}
          >
            Explore Now
            <ChevronRight size={20} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.rowsContainer}>
          <CardItem
            index={0}
            image={vegetablesImg}
            alt="Arogyam Vegetables"
            badge="Fresh & Organic"
            title="Arogyam Vegetables"
            description="Premium selection of fresh organic vegetables sourced directly from trusted farmers"
            category="vegetables"
          />

          <CardItem
            index={1}
            image={clustersImg}
            alt="Arogyam Clusters"
            badge="Community Driven"
            title="Arogyam Clusters"
            description="Join our farmer communities and support local agriculture while getting the best produce"
            category="clusters"
          />
        </div>
      </div>
    </div>
  );
};

export default ArogyamSections;