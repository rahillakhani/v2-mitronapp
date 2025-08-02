import { Product, SearchFilters, BikeCompatibility } from '../types';
import { Timestamp } from 'firebase/firestore';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: Date | Timestamp, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  
  switch (format) {
    case 'long':
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    
    case 'relative':
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(dateObj, 'short');
    
    default:
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Slugify string
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Truncate text
 */
export const truncate = (text: string, length: number, suffix: string = '...'): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Check if product is compatible with bike
 */
export const isProductCompatible = (
  product: Product,
  bikeMake: string,
  bikeModel: string,
  bikeYear: number
): boolean => {
  return product.bikeCompatibility.some((compatibility: BikeCompatibility) => {
    const makeMatch = compatibility.make.toLowerCase() === bikeMake.toLowerCase();
    const modelMatch = compatibility.models.some(model => 
      model.toLowerCase() === bikeModel.toLowerCase()
    );
    const yearMatch = compatibility.years.includes(bikeYear);
    
    return makeMatch && modelMatch && yearMatch;
  });
};

/**
 * Generate search keywords from product
 */
export const generateSearchKeywords = (product: Product): string[] => {
  const keywords = new Set<string>();
  
  // Add title words
  product.title.toLowerCase().split(/\s+/).forEach(word => {
    if (word.length > 2) keywords.add(word);
  });
  
  // Add category and subcategory
  keywords.add(product.category.toLowerCase());
  keywords.add(product.subcategory.toLowerCase());
  
  // Add brand
  if (product.brand) {
    keywords.add(product.brand.toLowerCase());
  }
  
  // Add part number
  if (product.partNumber) {
    keywords.add(product.partNumber.toLowerCase());
  }
  
  // Add bike compatibility
  product.bikeCompatibility.forEach(compatibility => {
    keywords.add(compatibility.make.toLowerCase());
    compatibility.models.forEach(model => {
      keywords.add(model.toLowerCase());
    });
  });
  
  // Add tags
  product.tags.forEach(tag => {
    keywords.add(tag.toLowerCase());
  });
  
  return Array.from(keywords);
};

/**
 * Build search query for Firestore
 */
export const buildSearchQuery = (searchTerm: string, filters: SearchFilters) => {
  const keywords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  return {
    keywords,
    filters: {
      ...filters,
      category: filters.category || null,
      subcategory: filters.subcategory || null,
      make: filters.make || null,
      model: filters.model || null,
      year: filters.year || null,
      priceRange: filters.priceRange || null,
      brand: filters.brand || null,
      inStock: filters.inStock ?? null,
      rating: filters.rating || null,
    },
    sortBy: filters.sortBy || 'newest',
  };
};

/**
 * Calculate shipping cost
 */
export const calculateShippingCost = (
  orderAmount: number,
  distance: number,
  weight: number
): number => {
  const baseShippingCost = 100; // ₹100 base cost
  const freeShippingThreshold = 2000; // Free shipping above ₹2000
  
  if (orderAmount >= freeShippingThreshold) {
    return 0;
  }
  
  // Calculate based on distance and weight
  const distanceCost = Math.ceil(distance / 100) * 20; // ₹20 per 100km
  const weightCost = Math.ceil(weight / 1000) * 15; // ₹15 per kg
  
  return baseShippingCost + distanceCost + weightCost;
};

/**
 * Calculate tax amount
 */
export const calculateTax = (amount: number, taxRate: number = 0.18): number => {
  return Math.round(amount * taxRate * 100) / 100;
};

/**
 * Generate order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD${timestamp.slice(-6)}${random}`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if file is image
 */
export const isImageFile = (file: File | string): boolean => {
  if (typeof file === 'string') {
    const extension = getFileExtension(file).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  }
  
  return file.type.startsWith('image/');
};

/**
 * Compress image
 */
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Group array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array by multiple keys
 */
export const sortBy = <T>(array: T[], ...keys: (keyof T)[]): T[] => {
  return array.sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let attempt = 1;
  
  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      attempt++;
    }
  }
  
  throw new Error('Max attempts reached');
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Handle storage errors silently
    }
  },
};
