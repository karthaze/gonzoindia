// src/components/gj-side-bar/GJSideBar.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./GJSideBar.module.css";
import { useNavigate } from "react-router-dom";
import useLogout from "../../common/logout";

const GJSideBar = ({ isOpen = true, toggleSidebar, onPressMyPosts, numberOfPosts }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogout = useLogout();
  const [activeItem, setActiveItem] = useState('All Posts');

  // Mock statistics - replace with actual data from your backend when available
  const stats = {
    posts: numberOfPosts,
    followers: 248,
    following: 153
  };

  const glitchPos ={ x: 0, y: 0 };

  const handleMenuItemClick = (itemName) => {
    setActiveItem(itemName);
    
    // Navigate based on menu item
    switch(itemName) {
      case 'All Posts':
        onPressMyPosts(false);
        break
      case 'My Posts':
        onPressMyPosts(true);
        break;
      case 'Settings':
        navigate('/settings');
        break;
      default:
        // Default action or no action
        break;
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.sidebarContent}>
      { <div className={styles.toggleButton} onClick={toggleSidebar}>
          <div className={styles.toggleIcon}>
            {isOpen ? '◄' : '►'}
          </div>
        </div> }
        
        <div className={styles.headerSection}>
          {/* <div className={styles.gonzoLogo}>
            <span className={styles.logoText}>[GONZO]</span>
            <div className={styles.redBar}></div>
          </div> */}
          
        </div>
        
        <div className={styles.profileSection}>
          <div className={styles.profileImageWrapper}>
            <div 
              className={styles.profileImageContainer}
              style={{ transform: `translate(${glitchPos.x}px, ${glitchPos.y}px)` }}
            >
              {user?.photo ? (
                <img src={user.photo} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.profilePlaceholder}>
                  {user?.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div className={styles.glitchEffect}></div>
            </div>
          </div>
          
          <h2 className={styles.userName}>{user?.displayName || "GONZO GUEST"}</h2>
          <p className={styles.userEmail}>{user?.email || ""}</p>
          
          
        </div>
        
        
        <div className={styles.menuSection}>
        <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.posts}</span>
              <span className={styles.statLabel}>POSTS ON FEED</span>
            </div>
            {/* <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.followers}</span>
              <span className={styles.statLabel}>FOLLOWERS</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.following}</span>
              <span className={styles.statLabel}>FOLLOWING</span>
            </div> */}
          </div>
          <ul className={styles.menuList}>
            <li 
              className={`${styles.menuItem} ${activeItem === 'All Posts' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('All Posts')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className={styles.menuText}>All Posts</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'All Posts' ? styles.visible : ''}`}></div>
            </li>
            {user?.email && (<li 
              className={`${styles.menuItem} ${activeItem === 'My Posts' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('My Posts')}
            >
              <div className={styles.menuIconWrapper}>
                {/* <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg> */}
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span className={styles.menuText}>My Posts</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'My Posts' ? styles.visible : ''}`}></div>
            </li>)}
            {
            /* Commented out menu items - kept in code for future use
            <li 
              className={`${styles.menuItem} ${activeItem === 'Explore' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('Explore')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/>
                </svg>
              </div>
              <span className={styles.menuText}>Explore</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'Explore' ? styles.visible : ''}`}></div>
            </li>
            
            <li 
              className={`${styles.menuItem} ${activeItem === 'Music' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('Music')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <span className={styles.menuText}>Music</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'Music' ? styles.visible : ''}`}></div>
            </li>
            
            <li 
              className={`${styles.menuItem} ${activeItem === 'Articles' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('Articles')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className={styles.menuText}>Articles</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'Articles' ? styles.visible : ''}`}></div>
            </li>
            
            <li 
              className={`${styles.menuItem} ${activeItem === 'Favorites' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('Favorites')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span className={styles.menuText}>Favorites</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'Favorites' ? styles.visible : ''}`}></div>
            </li>
            */}
            
            {/* <li 
              className={`${styles.menuItem} ${activeItem === 'Settings' ? styles.activeItem : ''}`}
              onClick={() => handleMenuItemClick('Settings')}
            >
              <div className={styles.menuIconWrapper}>
                <svg className={styles.menuIcon} viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </div>
              <span className={styles.menuText}>Settings</span>
              <div className={`${styles.activeIndicator} ${activeItem === 'Settings' ? styles.visible : ''}`}></div>
            </li> */}
          </ul>
        </div>
        
        
        <div className={styles.footer}>
          <button onClick={onLogout} className={styles.logoutButton}>
            <span className={styles.logoutText}>LOGOUT</span>
            <svg className={styles.logoutIcon} viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GJSideBar;