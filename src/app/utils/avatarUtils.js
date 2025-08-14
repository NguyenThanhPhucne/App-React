const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * Get the full URL for an avatar
 * @param {string} avatarPath - The avatar path from the database
 * @returns {string} - The full avatar URL
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return "/defaultAvatar.jpg";
  }
  
  // If it's already a full URL (starts with http/https), return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // If it's a default avatar or starts with '/', it's a local static file
  if (avatarPath.startsWith('/') && !avatarPath.startsWith('/uploads/')) {
    return avatarPath;
  }
  
  // If it's an uploaded file (starts with /uploads/), prepend the backend URL
  if (avatarPath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${avatarPath}`;
  }
  
  // If it doesn't start with '/', assume it's a relative upload path and add the prefix
  return `${API_BASE_URL}/uploads/${avatarPath}`;
};

/**
 * Get avatar source with fallback to default
 * @param {object} user - User object with avatar property
 * @returns {string} - The avatar URL with fallback
 */
export const getUserAvatarSrc = (user) => {
  if (user?.avatar) {
    return getAvatarUrl(user.avatar);
  }
  return "/defaultAvatar.jpg";
};

/**
 * Get server avatar source with fallback to default
 * @param {object} server - Server object with avatar property
 * @returns {string} - The server avatar URL with fallback
 */
export const getServerAvatarSrc = (server) => {
  if (server?.avatar) {
    return getAvatarUrl(server.avatar);
  }
  return "/defaultAvatar.jpg";
};

/**
 * Handle avatar error by setting fallback image
 * @param {Event} event - The error event
 */
export const handleAvatarError = (event) => {
  event.target.src = "/defaultAvatar.jpg";
};
