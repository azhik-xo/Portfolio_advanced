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

/**
 * Uploads an image or video directly to Cloudinary using signed authorization
 * obtained securely from our backend.
 * Provides live progress callback (0% - 100%) and returns the secure Cloudinary CDN URL.
 */
export async function uploadToCloudinary(file, folder = 'ashik-portfolio/lifts', onProgress = null) {
  if (!file) return null;

  // 1. Get signed authorization from backend
  const token = typeof window !== 'undefined' ? localStorage.getItem('ashik_admin_token') : null;
  const signUrl = getApiUrl(`/api/admin/cloudinary-sign?folder=${encodeURIComponent(folder)}`);

  const signRes = await fetch(signUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!signRes.ok) {
    throw new Error('Failed to obtain Cloudinary upload authorization');
  }

  const signData = await signRes.json();
  if (!signData.success) {
    throw new Error(signData.error || 'Failed to authenticate upload signature');
  }

  const { signature, timestamp, apiKey, cloudName } = signData;

  // 2. Determine resource type (video or image)
  const isVideo = file.type?.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.name || '');
  const resourceType = isVideo ? 'video' : 'image';
  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  // 3. Prepare FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  // 4. Upload with progress reporting via XMLHttpRequest
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint);

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            duration: response.duration,
            format: response.format,
            resourceType: response.resource_type,
          });
        } else {
          reject(new Error(response.error?.message || 'Cloudinary upload failed'));
        }
      } catch (err) {
        reject(new Error('Invalid response from Cloudinary'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
}

