import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { FiYoutube, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { uploadToYoutube } from '../../services/youtube';

function UploadModule({ metadata }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState('');

  // Check if the user is authenticated with YouTube
  const isYoutubeConnected = user?.connections?.youtube;

  const handleYoutubeAuth = () => {
    // Redirect to backend auth URL
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/youtube`;
  };

  const handleUpload = async () => {
    if (!metadata) return;

    try {
      setUploading(true);
      setUploadStatus(null);
      setUploadMessage('');

      // Call the YouTube upload service with metadata
      const result = await uploadToYoutube({
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        videoFile: metadata.videoFile,
        thumbnail: metadata.thumbnail,
        privacyStatus: 'private' // Default to private for safety
      });

      setUploadStatus('success');
      setUploadMessage(result.message || 'Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadMessage(error.message || 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!metadata || !metadata.title || !metadata.description) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Upload to Social Media</h3>

      {uploadStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md flex items-center">
          <FiCheck className="mr-2" />
          {uploadMessage}
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          {uploadMessage}
        </div>
      )}

      <div className="space-y-3">
        {!isYoutubeConnected ? (
          <Button 
            onClick={handleYoutubeAuth} 
            className="w-full flex items-center justify-center"
            variant="secondary"
          >
            <FiYoutube className="mr-2" size={20} />
            Connect YouTube Account
          </Button>
        ) : (
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full flex items-center justify-center"
            variant="youtube"
          >
            <FiYoutube className="mr-2" size={20} />
            {uploading ? 'Uploading to YouTube...' : 'Upload to YouTube'}
          </Button>
        )}
        
        {/* Add more platforms here in the future */}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Videos will be uploaded as private by default. You can change visibility settings on the platform.
      </p>
    </div>
  );
}

export default UploadModule;