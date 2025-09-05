import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Upload to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer, 
  folder: string, 
  resourceType: 'image' | 'video' = 'image'
): Promise<string> => {
  try {
    // For local development, save to local filesystem
    if (process.env.NODE_ENV === 'development' && !process.env.CLOUDINARY_URL) {
      return await saveToLocalStorage(buffer, folder, resourceType);
    }

    // For production, upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `tradezy/${folder}`,
        resource_type: resourceType as any,
        transformation: resourceType === 'image' ? [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ] : undefined
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file');
  }
};

// Save to local storage for development
const saveToLocalStorage = async (
  buffer: Buffer, 
  folder: string, 
  resourceType: 'image' | 'video'
): Promise<string> => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = resourceType === 'image' ? '.jpg' : '.mp4';
    const filename = `${timestamp}-${randomString}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    if (resourceType === 'image') {
      // Process image with sharp before saving
      const processedBuffer = await sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      await fs.writeFile(filepath, processedBuffer);
    } else {
      // Save video as-is
      await fs.writeFile(filepath, buffer);
    }

    // Return a URL that can be served by the backend
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw new Error('Failed to save file locally');
  }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    if (!url || !url.includes('cloudinary')) {
      // If it's a local file, delete it from local storage
      if (url.includes('/uploads/')) {
        const filename = url.split('/uploads/')[1];
        const filepath = path.join(process.cwd(), 'uploads', filename);
        await fs.unlink(filepath).catch(() => {});
      }
      return;
    }

    // Extract public ID from Cloudinary URL
    const urlParts = url.split('/');
    const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
    const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/');
    const publicId = publicIdWithExtension.split('.')[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw error as this is not critical
  }
};

// Optimize image before upload
export const optimizeImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(buffer)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();
  } catch (error) {
    console.error('Error optimizing image:', error);
    return buffer; // Return original if optimization fails
  }
};

// Generate thumbnail
export const generateThumbnail = async (buffer: Buffer, size: number = 300): Promise<Buffer> => {
  try {
    return await sharp(buffer)
      .resize(size, size, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 80 
      })
      .toBuffer();
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error('Failed to generate thumbnail');
  }
};