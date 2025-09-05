import axios from 'axios';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
  next_page?: string;
}

class PexelsService {
  private apiKey: string;
  private baseURL: string = 'https://api.pexels.com/v1';

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('PEXELS_API_KEY not found in environment variables');
    } else {
      console.log('✅ Pexels API key loaded successfully');
    }
  }

  async searchPhotos(query: string, perPage: number = 5, page: number = 1): Promise<string[]> {
    try {
      if (!this.apiKey) {
        console.warn('Pexels API key not configured, using placeholder images');
        return this.getPlaceholderImages(perPage);
      }

      const response = await axios.get<PexelsResponse>(`${this.baseURL}/search`, {
        headers: {
          'Authorization': this.apiKey
        },
        params: {
          query,
          per_page: perPage,
          page,
          orientation: 'landscape'
        }
      });

      if (response.data.photos.length === 0) {
        console.warn(`No images found for query: ${query}`);
        return this.getPlaceholderImages(perPage);
      }

      // Return array of image URLs (using large size for products)
      return response.data.photos.map(photo => photo.src.large);
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
      return this.getPlaceholderImages(perPage);
    }
  }

  async getCuratedPhotos(perPage: number = 5, page: number = 1): Promise<string[]> {
    try {
      if (!this.apiKey) {
        console.warn('Pexels API key not configured, using placeholder images');
        return this.getPlaceholderImages(perPage);
      }

      const response = await axios.get<PexelsResponse>(`${this.baseURL}/curated`, {
        headers: {
          'Authorization': this.apiKey
        },
        params: {
          per_page: perPage,
          page
        }
      });

      return response.data.photos.map(photo => photo.src.large);
    } catch (error) {
      console.error('Error fetching curated photos from Pexels:', error);
      return this.getPlaceholderImages(perPage);
    }
  }

  async getPhotoById(photoId: number): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await axios.get<PexelsPhoto>(`${this.baseURL}/photos/${photoId}`, {
        headers: {
          'Authorization': this.apiKey
        }
      });

      return response.data.src.large;
    } catch (error) {
      console.error(`Error fetching photo ${photoId} from Pexels:`, error);
      return null;
    }
  }

  private getPlaceholderImages(count: number): string[] {
    const placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(`https://via.placeholder.com/800x600/cccccc/666666?text=Product+Image+${i + 1}`);
    }
    return placeholders;
  }

  // Helper method to get images for specific product categories
  async getProductImages(category: string, productName: string, count: number = 3): Promise<string[]> {
    // Map categories to relevant search terms
    const categorySearchTerms: Record<string, string> = {
      'home-decor': 'luxury home interior furniture',
      'office-supplies': 'modern office supplies desk',
      'smart-home': 'smart home technology devices',
      'furniture': 'luxury furniture interior design',
      'lighting': 'modern lighting fixtures',
      'kitchen': 'kitchen appliances modern',
      'storage': 'storage organization furniture'
    };

    const searchTerm = categorySearchTerms[category] || productName;
    return this.searchPhotos(searchTerm, count);
  }

  // Get banner images for stores
  async getStoreBannerImage(storeName: string): Promise<string> {
    const searchTerms: Record<string, string> = {
      'Majlis Interiors': 'luxury arabic interior',
      'Desert Tech Solutions': 'modern technology office',
      'Gulf Office Pro': 'modern office workspace',
      'Oasis Living': 'luxury home interior',
      'Emirate Smart Systems': 'smart home automation'
    };

    const searchTerm = searchTerms[storeName] || 'modern business office';
    const images = await this.searchPhotos(searchTerm, 1);
    return images[0] || 'https://via.placeholder.com/1200x400';
  }
}

export default new PexelsService();