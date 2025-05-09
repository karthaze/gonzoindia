import React from 'react';
import styles from './GJGonzoFooter.module.css';
import CONSTANTS from '../../constants/constants';

const GJGonzoFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <div className={styles.links}>
            <a href={CONSTANTS.GIT} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <span>GitHub</span>
            </a>
            <a href={CONSTANTS.linkedInURL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <span>LinkedIn</span>
            </a>
            <a href={CONSTANTS.resumeURL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <span>Resume</span>
            </a>
            <a href={`mailto:${CONSTANTS.eMail}`} className={styles.link}>
              <span>{CONSTANTS.eMail}</span>
            </a>
            <a href={`tel:${CONSTANTS.phone}`} className={styles.link}>
              <span>{CONSTANTS.phone}</span>
            </a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          <p>© {new Date().getFullYear()} Gonzo India</p>
        </div>
      </div>
    </footer>
  );
};

export default GJGonzoFooter;