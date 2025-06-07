import { useState } from 'react';
import { useMetadata } from '../../contexts/MetadataContext';
import Button from '../common/Button';
import { FiEdit2, FiCopy, FiCheckCircle } from 'react-icons/fi';
import UploadModule from '../upload/UploadModule';

function PreviewPanel() {
  const { metadata, updateMetadata } = useMetadata();
  const [editMode, setEditMode] = useState({
    title: false,
    description: false,
    tags: false
  });
  const [copied, setCopied] = useState({
    title: false,
    description: false,
    tags: false
  });

  const handleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    updateMetadata({ [field]: value });
  };

  const handleCopy = (field) => {
    const text = metadata[field];
    navigator.clipboard.writeText(text);
    
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  };

  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Generate metadata to see the preview here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Generated Metadata</h2>
      
      <div className="space-y-6">
        {/* Title Section */}
        <div className="metadata-item">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Title</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy('title')}
                disabled={copied.title}
              >
                {copied.title ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
                <span className="ml-1">{copied.title ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit('title')}
              >
                <FiEdit2 />
                <span className="ml-1">{editMode.title ? 'Save' : 'Edit'}</span>
              </Button>
            </div>
          </div>
          
          {editMode.title ? (
            <input
              type="text"
              value={metadata.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <p className="border px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              {metadata.title}
            </p>
          )}
        </div>
        
        {/* Description Section */}
        <div className="metadata-item">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Description</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy('description')}
                disabled={copied.description}
              >
                {copied.description ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
                <span className="ml-1">{copied.description ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit('description')}
              >
                <FiEdit2 />
                <span className="ml-1">{editMode.description ? 'Save' : 'Edit'}</span>
              </Button>
            </div>
          </div>
          
          {editMode.description ? (
            <textarea
              rows="8"
              value={metadata.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <div className="border px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {metadata.description}
            </div>
          )}
        </div>
        
        {/* Tags Section */}
        <div className="metadata-item">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Tags</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopy('tags')}
                disabled={copied.tags}
              >
                {copied.tags ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
                <span className="ml-1">{copied.tags ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit('tags')}
              >
                <FiEdit2 />
                <span className="ml-1">{editMode.tags ? 'Save' : 'Edit'}</span>
              </Button>
            </div>
          </div>
          
          {editMode.tags ? (
            <input
              type="text"
              value={Array.isArray(metadata.tags) ? metadata.tags.join(', ') : metadata.tags || ''}
              onChange={(e) => {
                const tagsArray = e.target.value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0);
                handleChange('tags', tagsArray);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder="Separate tags with commas"
            />
          ) : (
            <div className="border px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(metadata.tags) && metadata.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Thumbnail Section */}
        {metadata.thumbnail && (
          <div className="metadata-item">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Thumbnail</h3>
            </div>
            <div className="border p-2 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <img 
                src={metadata.thumbnail} 
                alt="Generated thumbnail" 
                className="w-full h-auto object-cover rounded"
              />
            </div>
          </div>
        )}
        
        {/* Upload Button */}
        <div className="border-t dark:border-gray-700 pt-4 mt-6">
          <UploadModule metadata={metadata} />
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;