// YouTube API Integration Service
import api from './api' 

/**
 * Upload a video to YouTube
 * @param {Object} videoData - Video data for upload
 * @param {string} videoData.title - Video title
 * @param {string} videoData.description - Video description
 * @param {Array<string>} videoData.tags - Video tags
 * @param {FormData|File} videoData.videoFile - Video file to upload
 * @param {string} [videoData.thumbnail] - Thumbnail URL or base64
 * @param {string} [videoData.privacyStatus='private'] - Privacy status (private, public, unlisted)
 * @param {string} [videoData.categoryId] - YouTube category ID
 * @returns {Promise<Object>} Upload result with video ID and URL
 */
export async function uploadToYoutube(videoData) {
  try {
    // Prepare form data for upload
    const formData = new FormData();
    
    // Add video file
    if (videoData.videoFile instanceof File) {
      formData.append('video_file', videoData.videoFile);
    } else if (videoData.videoFile instanceof FormData) {
      formData.append('video_file', videoData.videoFile.get('video'));
    } else {
      throw new Error('Invalid video file format');
    }
    
    // Add metadata
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    
    // Add optional fields
    if (Array.isArray(videoData.tags)) {
      formData.append('tags', JSON.stringify(videoData.tags));
    }
    
    if (videoData.thumbnail) {
      formData.append('thumbnail', videoData.thumbnail);
    }
    
    formData.append('privacy_status', videoData.privacyStatus || 'private');
    
    if (videoData.categoryId) {
      formData.append('category_id', videoData.categoryId);
    }
    
    // Send upload request
    const response = await api.post('/youtube/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add timeout for large uploads
      timeout: 300000, // 5 minutes
    });
    
    return response.data;
  } catch (error) {
    console.error('YouTube upload error:', error);
    throw new Error(
      error.response?.data?.detail || 
      'Failed to upload video to YouTube. Please try again.'
    );
  }
}

/**
 * Get YouTube account information
 * @returns {Promise<Object>} YouTube account information
 */
export async function getYoutubeAccountInfo() {
  try {
    const response = await api.get('/youtube/account-info/');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 
      'Failed to fetch YouTube account information'
    );
  }
}

/**
 * Get YouTube upload quota information
 * @returns {Promise<Object>} Quota information
 */
export async function getYoutubeQuotaInfo() {
  try {
    const response = await api.get('/youtube/quota-info/');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 
      'Failed to fetch YouTube quota information'
    );
  }
}