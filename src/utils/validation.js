// Validation Utilities
/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validates a password for strength requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result and message
 */
export function validatePassword(password) {
  // Check minimum length
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  // Check for uppercase and lowercase letters
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain both uppercase and lowercase letters'
    };
  }
  
  return {
    valid: true,
    message: 'Password is strong'
  };
}

/**
 * Validates video file requirements
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {Object} Validation result and message
 */
export function validateVideoFile(file, maxSizeMB = 500) {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      message: 'Please select a file'
    };
  }
  
  // Check if file is a video
  if (!file.type.startsWith('video/')) {
    return {
      valid: false,
      message: 'File must be a video'
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      message: `File size must be less than ${maxSizeMB}MB`
    };
  }
  
  return {
    valid: true,
    message: 'File is valid'
  };
}

/**
 * Formats a string with character limits and adds ellipsis if needed
 * @param {string} text - Text to format
 * @param {number} maxLength - Maximum length allowed
 * @returns {string} Formatted text
 */
export function formatTextWithLimit(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats tags to match YouTube requirements
 * @param {Array<string>} tags - Tags to format
 * @param {number} maxTags - Maximum number of tags allowed
 * @returns {Array<string>} Formatted tags
 */
export function formatYouTubeTags(tags, maxTags = 500) {
  if (!Array.isArray(tags)) return [];
  
  // Filter out empty tags and trim whitespace
  const formattedTags = tags
    .filter(tag => tag && tag.trim())
    .map(tag => tag.trim());
  
  // Limit number of tags
  return formattedTags.slice(0, maxTags);
}