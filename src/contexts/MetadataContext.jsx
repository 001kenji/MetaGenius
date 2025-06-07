import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateVideoMetadata } from '../services/metadata';

// Create context
const MetadataContext = createContext();

// Provider component
export function MetadataProvider({ children }) {
  const [metadata, setMetadata] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Generate metadata
  const generateMetadata = useCallback(async (data) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedMetadata = await generateVideoMetadata(data);
      setMetadata(generatedMetadata);
      
      // Add to history
      setHistory(prev => [
        {
          id: Date.now().toString(),
          title: generatedMetadata.title,
          timestamp: new Date().toISOString(),
          metadata: generatedMetadata
        },
        ...prev
      ]);
      
      return generatedMetadata;
    } catch (err) {
      setError(err.message || 'Failed to generate metadata');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  // Update metadata (for manual edits)
  const updateMetadata = useCallback((updates) => {
    setMetadata(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  // Clear current metadata
  const clearMetadata = useCallback(() => {
    setMetadata({});
  }, []);
  
  // Load metadata from history
  const loadFromHistory = useCallback((id) => {
    const item = history.find(item => item.id === id);
    if (item) {
      setMetadata(item.metadata);
    }
  }, [history]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);
  
  // Delete history item
  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const value = {
    metadata,
    isGenerating,
    error,
    history,
    generateMetadata,
    updateMetadata,
    clearMetadata,
    loadFromHistory,
    clearHistory,
    deleteHistoryItem
  };
  
  return <MetadataContext.Provider value={value}>{children}</MetadataContext.Provider>;
}

// Custom hook for using the metadata context
export function useMetadata() {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
}