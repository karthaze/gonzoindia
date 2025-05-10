import axios from 'axios';
import CONSTANTS from '../constants/constants';

const BASE_URL = CONSTANTS.BaseUrlPosts; 


export const createPost = async (postData) => {

    const apiReadyData = postData;
    console.log('Sending post data:', apiReadyData);
    return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, apiReadyData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });
};


export const getPosts = async (filters = {}) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: filters
    });
    console.log({response})
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error.response?.data || error;
  }
};

export const searchSpotify = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/spotify/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Spotify search failed:', error);
    return [];
  }
};