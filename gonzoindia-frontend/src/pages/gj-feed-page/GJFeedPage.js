import React, { useState, useEffect } from "react";
import styles from "./GJFeedPage.module.css";
import GJPostModal from "../../components/gj-post-modal/GJPostModal";
import GJCreatePost from "../../components/gj-create-post/GJCreatePost";
import TopBar from "../../components/gj-top-bar/GJTopBar";
import GJSidebar from "../../components/gj-side-bar/GJSideBar";
import FeedList from "../../components/gj-feed/GJFeed";
import { getPosts } from "../../apis/api";
import socket from "../../socket/socket";
import { useSelector } from "react-redux";

const GJFeedPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [myPosts, setMyPosts] = useState(false);
  const [eventFilter, setEventFilter] = useState(false);
  const [searchEvent, setSearchEvent] = useState(null);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response);
        console.log("Fetched posts:", response);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    const fetchMyPosts = async () => {
      try {
        const response = await getPosts({email:user?.email});
        setPosts(response);
        console.log("Fetched posts:", response);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    const fetchPostsByLocation = async () => {
      try {
        const response = await getPosts({event:searchEvent});
        setPosts(response);
        console.log("Fetched posts:", response);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    myPosts ? fetchMyPosts():fetchPosts();

    socket.on('new-post', (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off('new-post');
    };
  }, []);

  // Find the current post index for navigation
  const [currentIndex, setCurrentIndex] = useState( selectedPost 
    ? posts.findIndex(p => p.id === selectedPost.id)
    : -1)

  // Modal navigation functions
  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleNextPost = () => {
    if (currentIndex < posts.length - 1) {
      setSelectedPost(posts[currentIndex + 1]);
      setCurrentIndex(currentIndex+1)
    }
  };

  const handlePrevPost = () => {
    if (currentIndex > 0) {
      setSelectedPost(posts[currentIndex - 1]);
      setCurrentIndex(currentIndex-1)
    }
  };

  const handleCreatePost = async (postData) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(postData)
      // });
      // const data = await response.json();

      // For now, simulate API response with local data
      
      const newPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      // Add the new post to the beginning of the posts array
      setPosts([newPost, ...posts]);
      setShowCreate(false);
      
      // Show a success message or notification here
      console.log('Post created successfully', newPost);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.feedPage}>
      <TopBar onClick={()=>setShowCreate(true)} />
      <GJSidebar isOpen={sidebarOpen} toggleSidebar={()=>setSidebarOpen(!sidebarOpen)} onPressMyPosts={(payload)=>setMyPosts(payload)} numberOfPosts={posts.length} />
      
      <div className={styles.mainContent}>
        
        <div className={`${styles.contentArea} ${styles.withSidebar}`}>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.postList}>
            <FeedList
              posts={posts} 
              onSelectPost={setSelectedPost}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <GJPostModal 
          post={selectedPost}
          onClose={handleCloseModal}
          onNext={handleNextPost}
          onPrev={handlePrevPost}
          disableNext={currentIndex >= posts.length - 1}
          disablePrev={currentIndex <= 0}
        />
      )}
      
      {/* Create Post Modal */}
      <GJCreatePost 
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default GJFeedPage;