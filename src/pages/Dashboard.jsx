import React, { useState, useEffect } from 'react';
import { useMetadata } from '../contexts/MetadataContext';
import MetadataForm from '../components/metadata/MetadataForm';
import PreviewPanel from '../components/metadata/PreviewPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { getMetadataHistory } from '../services/metadata';

function Dashboard() {
  const { clearMetadata, loadFromHistory, deleteHistoryItem } = useMetadata();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  
  // Load history when component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        setError(null);
        const data = await getMetadataHistory();
      
        setHistory(data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again.');
      } finally {
        setLoadingHistory(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  const handleLoadFromHistory = (item) => {
    loadFromHistory(item.id);
  };
  const handleDeleteHistoryItem = async (id) => {
    try {
      await deleteHistoryItem(id);
      // Update local history state by filtering out the deleted item
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Failed to delete history item');
    }
  };

  const MapHistoryData = history.map((item) => {

    return (
      <div 
          key={item.id} 
          className="bg-white dark:bg-gray-800 rounded-md shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleLoadFromHistory(item)}
        >
            <div className="flex justify-between items-start">
              <h3 className="font-medium line-clamp-2">{item.title || 'Untitled'}</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHistoryItem(item.id);
                }} 
                className="text-gray-400 hover:text-red-500 p-1"
                aria-label="Delete"
              >
                &times;
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              <FiClock className="mr-1" size={14} />
              <span>
                {new Date(item.timestamp).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {item.platform && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  {item.platform}
                </span>
              )}
              {item.metadata?.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
              {(item.metadata?.tags?.length > 2) && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                  +{item.metadata.tags.length - 2} more
                </span>
              )}
            </div>
      </div>
    )
  })
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Video Metadata Generator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column - Metadata Form */}
        <div>
          <MetadataForm />
        </div>
        
        {/* Right Column - Preview Panel */}
        <div>
          <PreviewPanel />
        </div>
      </div>
      
      {/* History Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Generations</h2>
          <button 
            onClick={() => clearMetadata()} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create New
          </button>
        </div>
        
        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="py-6 flex items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md p-4 flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No previous generations found. Start by creating your first metadata.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MapHistoryData}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;