// utils/imageCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CACHE_PREFIX = '@img_';
const METADATA_KEY = '@image_metadata';

type ImageMetadata = {
  [key: string]: {
    firebasePath: string;
    timestamp: number;
  };
};

class ImageCacheManager {
  /**
   * Hent bilde fra cache eller last ned
   * VIKTIG: Caching fungerer bare på native platforms (iOS/Android)
   */
  async get(firebasePath: string, downloadUrl: string): Promise<string> {
    // På web: returner bare download URL (ingen caching)
    if (Platform.OS === 'web') {
      console.log('🌐 Web platform: Skipping cache, returning direct URL');
      return downloadUrl;
    }

    const key = CACHE_PREFIX + this.getCacheKey(firebasePath);
    
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        console.log('🎯 Cache hit:', firebasePath);
        return cached;
      }

      console.log('📥 Downloading image:', firebasePath);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      await AsyncStorage.setItem(key, dataUri);
      await this.updateMetadata(firebasePath);
      
      return dataUri;
    } catch (error) {
      console.error('Cache error:', error);
      return downloadUrl;
    }
  }

  async invalidate(firebasePath: string) {
    // På web: ingenting å invalidere
    if (Platform.OS === 'web') {
      return;
    }

    const key = CACHE_PREFIX + this.getCacheKey(firebasePath);
    await AsyncStorage.removeItem(key);
    console.log('🗑️ Invalidated cache for:', firebasePath);
  }

  async clear() {
    // På web: ingenting å cleare
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove([...imageKeys, METADATA_KEY]);
      console.log('🗑️ Cleared all cached images');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async cleanOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
    // På web: ingenting å cleane
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const metadataStr = await AsyncStorage.getItem(METADATA_KEY);
      if (!metadataStr) return;

      const metadata: ImageMetadata = JSON.parse(metadataStr);
      const now = Date.now();
      const toDelete: string[] = [];

      for (const [key, data] of Object.entries(metadata)) {
        if (now - data.timestamp > maxAgeMs) {
          toDelete.push(CACHE_PREFIX + key);
          delete metadata[key];
        }
      }

      if (toDelete.length > 0) {
        await AsyncStorage.multiRemove(toDelete);
        await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
        console.log(`🧹 Cleaned ${toDelete.length} old cached images`);
      }
    } catch (error) {
      console.error('Error cleaning cache:', error);
    }
  }

  private getCacheKey(firebasePath: string): string {
    return firebasePath.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private async updateMetadata(firebasePath: string) {
    try {
      const metadataStr = await AsyncStorage.getItem(METADATA_KEY);
      const metadata: ImageMetadata = metadataStr ? JSON.parse(metadataStr) : {};
      
      metadata[this.getCacheKey(firebasePath)] = {
        firebasePath,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  }
}

export const imageCache = new ImageCacheManager();