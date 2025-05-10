import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Music, Calendar, MapPin, Tag, User, Search } from "lucide-react";
import styles from "./GJCreatePost.module.css";
import { createPost, searchSpotify } from "../../apis/api";
import { useSelector } from "react-redux";
import axios from "axios";

const GJCreatePost = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    date: "",
    event: "",
    destination: "",
    imageUrl: "",
    spotifyEmbedUrl: "",
    authorName: localStorage.getItem("userName") || "",
    email: user?.email,
  });
  
  const [activeTab, setActiveTab] = useState("content");
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  
  // Spotify search states
  const [spotifySearchQuery, setSpotifySearchQuery] = useState("");
  const [spotifySearchResults, setSpotifySearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle modal animations and outside clicks
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
      
      const handleEscKey = (e) => e.key === "Escape" && handleClose();
      const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
      };
      
      document.addEventListener("keydown", handleEscKey);
      document.addEventListener("mousedown", handleOutsideClick);
      
      return () => {
        document.removeEventListener("keydown", handleEscKey);
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isOpen]);

  // Handle clicks outside the spotify dropdown
  useEffect(() => {
    const handleOutsideDropdownClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && 
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideDropdownClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideDropdownClick);
    };
  }, []);

  // Spotify search logic with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (spotifySearchQuery.trim() !== "") {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchSpotify(spotifySearchQuery);
          setSpotifySearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          console.error("Spotify search error:", err);
          setError("Failed to search Spotify tracks");
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSpotifySearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [spotifySearchQuery]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({ ...prev, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Spotify search handlers
  const handleSpotifySearchChange = (e) => {
    setSpotifySearchQuery(e.target.value);
    setError("");
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setFormData(prev => ({ ...prev, spotifyEmbedUrl: track.embedUrl }));
    setSpotifySearchQuery(`${track.name} - ${track.artist}`);
    setShowDropdown(false);
  };

  const clearSelectedTrack = () => {
    setSelectedTrack(null);
    setFormData(prev => ({ ...prev, spotifyEmbedUrl: "" }));
    setSpotifySearchQuery("");
  };

  // Form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  // Validation
  const requiredFields = ["title", "text", "date", "event", "destination"];
  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    setError("Please fill all required fields");
    setIsSubmitting(false);
    return;
  }

  try {
    const formDataToSend = new FormData();

    // Append all fields to formData
    formDataToSend.append("title", formData.title);
    formDataToSend.append("text", formData.text);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("event", formData.event);
    formDataToSend.append("destination", formData.destination);
    formDataToSend.append("email", user?.email || "");
    if (formData.spotifyEmbedUrl) {
      formDataToSend.append("spotifyEmbedUrl", formData.spotifyEmbedUrl);
    }

    // Attach image file (if provided)
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    // Make request (replace createPost with axios/fetch if needed)
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });

    handleClose();
  } catch (err) {
    console.log({ error: err });
    if (err.response?.status === 413) {
      setError("Media size too large, upload limit: 20MB");
    } else {
      setError("Failed to create post. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};


  // Close modal with animation
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
      // Reset form
      setFormData({
        title: "",
        text: "",
        date: "",
        event: "",
        destination: "",
        imageUrl: "",
        spotifyEmbedUrl: "",
        authorName: localStorage.getItem("userName") || "",
        email: user?.email,
      });
      setActiveTab("content");
      setPreviewImage(null);
      setSpotifySearchQuery("");
      setSelectedTrack(null);
      setError("");
    }, 300);
  };

  if (!isOpen) return null;

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "content":
        return (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a captivating title"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="text">Your Gonzo Experience</label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="Share your unfiltered experience in true Gonzo style..."
                className={styles.textarea}
                rows={10}
              />
            </div>
          </>
        );
      
      case "media":
        return (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="imageUpload" className={styles.mediaLabel}>
                <Camera size={20} /> Upload Image
              </label>
              <div className={styles.mediaUpload}>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  onChange={handleImageInput}
                  className={styles.fileInput}
                />
                <div className={styles.uploadPreview}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className={styles.previewImage} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <Camera size={32} />
                      <p>Drag an image or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="spotifySearch" className={styles.mediaLabel}>
                <Music size={20} /> Add Spotify Track
              </label>
              <div className={styles.spotifySearchContainer}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    id="spotifySearch"
                    ref={searchInputRef}
                    value={spotifySearchQuery}
                    onChange={handleSpotifySearchChange}
                    onFocus={() => spotifySearchQuery && setShowDropdown(true)}
                    placeholder="Search for a song or artist"
                    className={styles.input}
                  />
                  {isSearching && (
                    <div className={styles.searchingIndicator}>Searching...</div>
                  )}
                  {selectedTrack && (
                    <button 
                      className={styles.clearButton} 
                      onClick={clearSelectedTrack}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                {showDropdown && spotifySearchResults.length > 0 && (
                  <div className={styles.searchDropdown} ref={dropdownRef}>
                    {spotifySearchResults.map((track, index) => (
                      <div 
                        key={index} 
                        className={styles.searchResultItem}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className={styles.trackInfo}>
                          <p className={styles.trackName}>{track.name}</p>
                          <p className={styles.artistName}>{track.artist}</p>
                        </div>
                        <Music size={16} className={styles.spotifyIcon} />
                      </div>
                    ))}
                  </div>
                )}
                
                {showDropdown && spotifySearchQuery && spotifySearchResults.length === 0 && !isSearching && (
                  <div className={styles.noResults}>
                    No tracks found for "{spotifySearchQuery}"
                  </div>
                )}
              </div>
              
              {selectedTrack && (
                <div className={styles.spotifyPreview}>
                  <Music size={20} className={styles.spotifyIcon} />
                  <div className={styles.selectedTrackInfo}>
                    <p className={styles.selectedTrackName}>{selectedTrack.name}</p>
                    <p className={styles.selectedArtistName}>{selectedTrack.artist}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      
      case "details":
        return (
          <>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="date" className={styles.detailLabel}>
                  <Calendar size={18} /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="event" className={styles.detailLabel}>
                  <Tag size={18} /> Event
                </label>
                <input
                  type="text"
                  id="event"
                  name="event"
                  value={formData.event}
                  onChange={handleInputChange}
                  placeholder="Concert, Festival, Trip..."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="destination" className={styles.detailLabel}>
                <MapPin size={18} /> Destination/Location
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Where did it happen?"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="authorName" className={styles.detailLabel}>
                <User size={18} /> Author Name
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="Your name"
                className={styles.input}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${animateIn ? styles.active : ""}`}>
      <div 
        ref={modalRef} 
        className={`${styles.modal} ${animateIn ? styles.active : ""}`}
      >
        <div className={styles.modalHeader}>
          <h2>Create Gonzo Experience</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.tabsContainer}>
          {["content", "media", "details"].map(tab => (
            <button 
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.tabContent} ${styles.activeContent}`}>
            {renderTabContent()}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GJCreatePost;