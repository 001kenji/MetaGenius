import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMetadata } from '../../contexts/MetadataContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiVideo, FiAlertCircle } from 'react-icons/fi';
function MetadataForm() {
  const { generateMetadata, isGenerating } = useMetadata();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
        setFormError(null);
      } else {
        setFormError('Please select a valid video file.');
        setVideoFile(null);
        setVideoPreview(null);
      }
    }
  };
  const onSubmit = async (data) => {
    try {
      setFormError(null);
      if (!videoFile && !data.videoUrl) {
        setFormError('Please upload a video file or provide a video URL.');
        return;
      }

      // Prepare data for the API
      const formData = new FormData();
      if (videoFile) {
        formData.append('video', videoFile);
      }
      
      // Call the generateMetadata function from context
      await generateMetadata({
        ...data,
        videoFile: videoFile ? formData : null,
        videoUrl: data.videoUrl || null
      });
      
      // Reset form after successful generation
      // reset();
      // Don't reset the form to keep the video and description for review
    } catch (error) {
      console.error('Error generating metadata:', error);
      setFormError(error.message || 'Failed to generate metadata. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Generate Video Metadata</h2>
      
      {formError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium" htmlFor="videoUpload">
            Upload Video (optional if URL provided)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiVideo className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">MP4, WebM, AVI, MOV (MAX. 500MB)</p>
              </div>
              <input 
                id="videoUpload" 
                type="file" 
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>
          </div>
          {videoPreview && (
            <div className="mt-3">
              <video 
                src={videoPreview} 
                controls 
                className="w-full h-40 object-cover rounded-md"
              ></video>
            </div>
          )}
        </div>

        <div className="- or -">
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="videoUrl">
            Video URL (optional if file uploaded)
          </label>
          <input
            id="videoUrl"
            type="url"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            placeholder="https://example.com/video.mp4"
            {...register('videoUrl')}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="videoDescription">
            Video Description *
          </label>
          <textarea
            id="videoDescription"
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            placeholder="Describe your video content in detail for better AI-generated metadata"
            {...register('description', { required: 'Description is required' })}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="targetAudience">
            Target Audience
          </label>
          <input
            id="targetAudience"
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            placeholder="E.g., Developers, Gamers, Students, etc."
            {...register('targetAudience')}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="contentTone">
            Content Tone
          </label>
          <select
            id="contentTone"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            {...register('tone')}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="funny">Funny</option>
            <option value="serious">Serious</option>
            <option value="educational">Educational</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium" htmlFor="platform">
            Primary Platform
          </label>
          <select
            id="platform"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            {...register('platform')}
          >
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <Button 
          type="submit" 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Generating...</span>
            </>
          ) : 'Generate Metadata'}
        </Button>
      </form>
    </div>
  );
}

export default MetadataForm;