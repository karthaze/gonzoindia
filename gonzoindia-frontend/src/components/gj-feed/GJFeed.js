
import React, { useState, useEffect, useRef } from "react";
import styles from "./GJFeed.module.css";

const FeedList = ({ posts, onSelectPost }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const feedContainerRef = useRef(null);
  const handleScroll = () => {
    if (!feedContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = feedContainerRef.current;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(scrollPercentage, 100));
  };
  
  useEffect(() => {
    const feedContainer = feedContainerRef.current;
    if (feedContainer) {
      feedContainer.addEventListener('scroll', handleScroll);
      return () => feedContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <>
      <div className={styles.feedContainer} ref={feedContainerRef}>
        <div className={styles.feedList}>
          {posts?.map((post) => (
            <div 
              key={post.id}
              className={styles.postCard}
              onClick={() => onSelectPost(post)}
            >
              <div className={styles.imageContainer}>
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${post.imageUrl}`} 
                  alt={post.title}
                  className={styles.postImage}
                />
                
                <div className={styles.overlay}></div>
                
                {/* Spotify indicator */}
                {post.spotifyEmbedUrl && (
                  <div className={styles.musicIndicator}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18V6L21 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="15" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
                
                {/* Event tag */}
                <div className={styles.eventTag}>
                  {post.event}
                </div>
                
                {/* Date tag */}
                <div className={styles.dateTag}>
                  {post.date}
                </div>
              </div>
              
              <div className={styles.contentContainer}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                
                {/* Preview text - optional */}
                {post.text && (
                  <p className={styles.postText}>
                    {post.text}
                  </p>
                )}
              </div>

              <div className={styles.cardDecoration}></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div 
          className={styles.scrollProgress} 
          style={{ 
            height: `${scrollProgress}%`,
            top: 0
          }}
        ></div>
      </div>
    </>
  );
};

export default FeedList;