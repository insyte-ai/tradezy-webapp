import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if credentials are available
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('Cloudinary credentials not configured. File uploads will not work properly in production.');
}

export default cloudinary;