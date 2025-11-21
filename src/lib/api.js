/**
 * API Configuration Utility
 * Provides centralized API URL management for dynamic configuration
 */

// Get API base URL from environment variable
// Defaults to empty string for relative paths (Next.js API routes)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Constructs a full API URL from a path
 * @param {string} path - API endpoint path (e.g., '/api/auth/login')
 * @returns {string} Full API URL
 */
export function apiUrl(path) {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Export base URL for direct usage if needed
 */
export { API_BASE_URL };
