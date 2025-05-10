import React, { useRef, useEffect, useState } from "react";
import styles from "./GJPostModal.module.css";
import { X, ArrowLeft, ArrowRight, Music, Calendar, Clock, LocateFixedIcon } from "lucide-react";

const GJPostModal = ({ post, onClose, onNext, onPrev, disableNext, disablePrev }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textSectionRef = useRef(null);
  const modalRef = useRef(null);

  const handleScroll = () => {
    if (!textSectionRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = textSectionRef.current;
    const scrollableHeight = scrollHeight - clientHeight;
    
    if (scrollableHeight > 0) {
      const progress = (scrollTop / scrollableHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const textSection = textSectionRef.current;
    if (textSection) {
      textSection.addEventListener('scroll', handleScroll);
      return () => textSection.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (textSectionRef.current) {
      textSectionRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [post?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && !disablePrev) onPrev();
      if (e.key === 'ArrowRight' && !disableNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, disablePrev, disableNext]);

  if (!post) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContainer}>
        {/* Header with close button */}
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        {/* Content area */}
        <div className={styles.modalContent}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className={styles.postImage} 
            />
            
            {/* Navigation buttons */}
            <div className={styles.navButtons}>
              <button 
                className={`${styles.navButton} ${disablePrev ? styles.disabled : ''}`}
                onClick={onPrev}
                disabled={disablePrev}
                aria-label="Previous post"
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                className={`${styles.navButton} ${disableNext ? styles.disabled : ''}`}
                onClick={onNext}
                disabled={disableNext}
                aria-label="Next post"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Text Content Section with scrolling */}
          <div className={styles.textContainer}>
            {/* Post metadata */}
            <div className={styles.postMeta}>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className={styles.metaItem}>
                <LocateFixedIcon size={16} />
                <span>{post.destination}</span>
              </div>
              
            </div>
            
            {/* Scrollable content */}
            <div 
              ref={textSectionRef} 
              className={styles.textContent}
              onScroll={handleScroll}
            >
              <h2 className={styles.postTitle}>{post.title}</h2>
              
              <div className={styles.authorText}>
                <span>{post.event}</span></div>
              <div className={styles.postText}>{post.text}</div>
              <div className={styles.authorText}>-{post.authorName}</div>
              
              {/* Spotify embed if available */}
              {post.spotifyEmbedUrl && (
                <div className={styles.spotifyEmbed}>
                  <div className={styles.spotifyHeader}>
                    <Music size={16} />
                    <span>Listen while you read</span>
                  </div>
                  <iframe
                    src={post.spotifyEmbedUrl}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Embed"
                  ></iframe>
                </div>
              )}
            </div>
            
            {/* Scroll progress indicator */}
            <div className={styles.scrollProgressContainer}>
              <div 
                className={styles.scrollProgress}
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GJPostModal;