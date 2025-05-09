import React, { useState } from 'react';
import styles from './GJButton.module.css';

const GJButton = ({ text, onClick, className, variant = 'default', icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className || ''}`} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.buttonContent}>
        <span className={styles.buttonText}>{text}</span>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
      </div>
      <div className={`${styles.buttonGlitch} ${isHovered ? styles.glitchActive : ''}`}></div>
      <div className={styles.buttonOverlay}></div>
    </button>
  );
};

export default GJButton;