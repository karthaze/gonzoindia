import React, { useState, useEffect, useRef } from 'react';
import styles from './GJLandingPage.module.css';
import utils from '../../common/utils';
import CONSTANTS from '../../constants/constants';
import GJGonzoFooter from '../../components/gj-gonzo-footer/GJGonzoFooter';

// Modular sections - easy to add or remove

const GJLandingPage = () => {
  const backgroundImages = CONSTANTS.backgroundImages;
  const sections = CONSTANTS.landingPageSections;

  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRefs = useRef(sections);
  useEffect(() => {
    sectionRefs.current = Array(sections.length)
      .fill()
      .map((_, i) => sectionRefs.current[i] || React.createRef());
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
      
      const sectionHeight = window.innerHeight;
      const currentSection = Math.floor((scrollTop + (sectionHeight / 2)) / sectionHeight);
      if (currentSection !== activeSection && currentSection >= 0 && currentSection < sections.length) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);


  const scrollToNextSection = () => {
    if (isTransitioning) return;
    
    const nextSection = (activeSection + 1) % sections.length;
    
    setIsTransitioning(true);
    
 
    if (sectionRefs.current[nextSection]) {
      sectionRefs.current[nextSection].current.scrollIntoView({
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => {
      setActiveSection(nextSection);
      setIsTransitioning(false);
    }, 200);
  };

  // Parallax effect for background
  const getParallaxStyle = (index) => {
    const offset = (index - activeSection) * 15;
    
    return {
      backgroundImage: `url(${backgroundImages[index]})`,
      backgroundPositionY: `${offset}%`
    };
  };

  return (
    <div className={styles.wrapper}>
      {sections.map((section, index) => (
        <div
          key={index}
          ref={sectionRefs.current[index]}
          className={`${styles.section} ${activeSection === index ? styles.activeSection : ''}`}
          style={getParallaxStyle(index)}
          id={`section-${index}`}
        >
          <div className={styles.overlay}></div>
          <div className={`${styles.contentCard} ${styles[`position${index}`]}`}>
            <div className={styles.contentInner}>
              <div className={styles.sectionNumber}>{index + 1}/{sections.length}</div>
              <h1 className={styles.heading}>{section.heading}</h1>
              <p className={styles.subtext}>{section.subtext}</p>
              {index === sections.length - 1 ? (
                <button className={styles.gonzoButton} onClick={utils.handleLogin}>
                  <span>GO GONZO</span>
                  <div className={styles.buttonGlitch}></div>
                </button>
              ) : (
                <button className={styles.nextButton} onClick={scrollToNextSection}>
                  <span>NEXT</span>
                  <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Add the footer component */}
      <GJGonzoFooter />
    </div>
  );
};

export default GJLandingPage;