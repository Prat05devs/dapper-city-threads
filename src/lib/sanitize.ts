import DOMPurify from 'dompurify';

// Configure DOMPurify options
const purifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param content - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (content: string): string => {
  if (!content) return '';
  
  // For server-side rendering, we need to check if window is available
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(content, purifyConfig);
};

/**
 * Sanitize plain text content
 * @param content - The text content to sanitize
 * @returns Sanitized text string
 */
export const sanitizeText = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}; 