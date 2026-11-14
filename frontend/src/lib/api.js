/**
 * Resolves API paths to either the local proxy or the direct production backend URL.
 * In development, uses relative paths (/api/...) handled by next.config.js rewrites.
 * In production on Vercel, points directly to the live Render backend
 * (https://ashik-portfolio-backend.onrender.com) to avoid any edge proxy timeouts.
 */
export function getApiUrl(path = '') {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/+$/, '')}${cleanPath}`;
  }

  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `https://ashik-portfolio-backend.onrender.com${cleanPath}`;
  }

  return cleanPath;
}
