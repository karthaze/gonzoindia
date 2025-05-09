// src/components/gj-top-bar/GJTopBar.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./GJTopBar.module.css";
import GJButton from "../gj-button/GJButton";

const GJTopBar = ({onClick}) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  
  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          [GONZO<span className={styles.highlight}>INDIA</span>]
        </div>
      </div>
      <div className={styles.centerSection}>
        <div className={`${styles.searchContainer} ${searchActive ? styles.active : ''}`}>
          <input
            type="text"
            placeholder="SEARCH THE GONZO UNIVERSE..."
            className={styles.searchInput}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
          />
          <span className={styles.searchIcon}>⌕</span>
        </div>
      </div>
      <GJButton text={"ADD GONZO"} onClick={onClick}/>
    </div>
  );
};

export default GJTopBar;