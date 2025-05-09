import { useState, useEffect, useRef } from 'react';
import { Music, Search, Loader } from 'lucide-react';
import { searchSpotify } from '../../apis/api'; // Import your existing function
import styles from './GJSpotifySearch.module.css';

const SpotifySearch = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(value ? JSON.parse(value) : null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Search when typing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        try {
          const data = await searchSpotify(searchTerm);
          setResults(data);
          setShowResults(data.length > 0);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }, 400);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const selectTrack = (track) => {
    setSelected(track);
    setSearchTerm('');
    setShowResults(false);
    onChange(JSON.stringify(track));
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="spotifySearch" className={styles.mediaLabel}>
        <Music size={20} /> Add Spotify Track
      </label>
      
      {!selected ? (
        <div className={styles.spotifySearchContainer}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              id="spotifySearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a song or artist..."
              className={styles.input}
              style={{ paddingLeft: '36px' }}
              onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
            {loading && <Loader size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: '#999' }} />}
          </div>
          
          {showResults && (
            <div ref={dropdownRef} className={`${styles.spotifyDropdown} ${styles.active}`}>
              {results.map((track, i) => (
                <div key={i} className={styles.searchResult} onClick={() => selectTrack(track)}>
                  <Music size={20} className={styles.spotifyIcon} />
                  <div className={styles.resultInfo}>
                    <p className={styles.trackName}>{track.name}</p>
                    <p className={styles.artistName}>{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.selectedTrack}>
          <Music size={20} className={styles.spotifyIcon} />
          <div className={styles.resultInfo}>
            <p className={styles.trackName}>{selected.name}</p>
            <p className={styles.artistName}>{selected.artist}</p>
          </div>
          <button 
            onClick={() => {setSelected(null); onChange('');}}
            style={{marginLeft: 'auto', background: 'none', border: 'none', color: '#999', cursor: 'pointer'}}
          >✕</button>
        </div>
      )}
    </div>
  );
};

export default SpotifySearch;