import api from './api';

export async function generateVideoMetadata(data) {
  try {
    let response;
    
    if (data.videoFile) {
      const formData = new FormData();
      formData.append('video', data.videoFile.get('video'));
      formData.append('description', data.description);
      formData.append('input_text', data.description);
      if (data.targetAudience) formData.append('target_audience', data.targetAudience);
      if (data.tone) formData.append('tone', data.tone);
      if (data.platform) formData.append('platform', data.platform);
      
      response = await api.post('/metadata/generate/', formData, {
        // headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await api.post('/metadata/generate/', {
        description: data.description,
        input_text : data.description,
        target_audience: data.targetAudience,
        tone: data.tone,
        platform: data.platform,
        video_url: data.videoUrl,
      });
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate metadata');
  }
}

export async function getMetadataResult(requestId) {
  try {
    const response = await api.get(`/metadata/generate/${requestId}/result/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get metadata result');
  }
}

export async function getMetadataHistory() {
  try {
    const response = await api.get('/metadata/generate/history/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch metadata history');
  }
}

export async function getTemplates() {
  try {
    const response = await api.get('/metadata/templates/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch templates');
  }
}

export async function createTemplate(templateData) {
  try {
    const response = await api.post('/metadata/templates/', templateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create template');
  }
}

export async function updateTemplate(id, templateData) {
  try {
    const response = await api.put(`/metadata/templates/${id}/`, templateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update template');
  }
}

export async function deleteTemplate(id) {
  try {
    const response = await api.delete(`/metadata/templates/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete template');
  }
}

export async function generateWithTemplate(templateId, data) {
  try {
    const response = await api.post(`/metadata/templates/${templateId}/generate/`, {
      description: data.description,
      platform: data.platform,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate with template');
  }
}

export async function generateThumbnail(title, description) {
  try {
    const response = await api.post('/metadata/generate-thumbnail/', {
      title,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate thumbnail');
  }
}