import CryptoJS from 'crypto-js';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Create signature for secure upload
  const signatureString = `timestamp=${timestamp}${apiSecret}`;
  const signature = CryptoJS.SHA1(signatureString).toString();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
