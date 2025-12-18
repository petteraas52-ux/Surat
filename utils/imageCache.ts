/**
 * IMAGE CACHE MANAGER
 * * ROLE:
 * Optimizes performance and reduces Firebase bandwidth usage by caching
 * remote images locally on native devices.
 * * CORE FUNCTIONALITY:
 * 1. Platform Detection: Automatically bypasses caching on Web (where the browser
 * handles it) and uses AsyncStorage for persistence on iOS/Android.
 * 2. Data-URI Transformation: Converts binary image blobs into Base64 Data URIs
 * to store them directly in the key-value storage.
 * 3. Lifecycle Management: Includes logic to invalidate specific images, clear
 * the entire cache, or prune old files based on a "Max Age" (default 7 days).
 * 4. Metadata Tracking: Maintains a separate record of when images were cached
 * to support the automatic cleaning process.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const CACHE_PREFIX = "@img_";
const METADATA_KEY = "@image_metadata";

type ImageMetadata = {
  [key: string]: {
    firebasePath: string;
    timestamp: number;
  };
};

class ImageCacheManager {
  /**
   * get
   * Retrieves an image from the local cache. If not found, it downloads
   * the image, converts it to a Data URI, and saves it.
   */
  async get(firebasePath: string, downloadUrl: string): Promise<string> {
    // Web platforms have native browser caching; we skip manual caching here.
    if (Platform.OS === "web") {
      console.log("🌐 Web platform: Skipping cache, returning direct URL");
      return downloadUrl;
    }

    const key = CACHE_PREFIX + this.getCacheKey(firebasePath);

    try {
      // 1. Check local storage first
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        console.log("🎯 Cache hit:", firebasePath);
        return cached;
      }

      // 2. Cache Miss: Download the image
      console.log("📥 Downloading image:", firebasePath);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // 3. Convert Blob to Base64 Data URI for storage
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // 4. Save to storage and update timestamp metadata
      await AsyncStorage.setItem(key, dataUri);
      await this.updateMetadata(firebasePath);

      return dataUri;
    } catch (error) {
      console.error("Cache error:", error);
      return downloadUrl; // Fallback to direct URL on failure
    }
  }

  /**
   * invalidate
   * Manually removes a specific image from the cache (e.g., if the user
   * updates their profile picture).
   */
  async invalidate(firebasePath: string) {
    if (Platform.OS === "web") return;

    const key = CACHE_PREFIX + this.getCacheKey(firebasePath);
    await AsyncStorage.removeItem(key);
    console.log("🗑️ Invalidated cache for:", firebasePath);
  }

  /**
   * clear
   * Wipes all cached images and associated metadata from the device.
   */
  async clear() {
    if (Platform.OS === "web") return;

    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove([...imageKeys, METADATA_KEY]);
      console.log("🗑️ Cleared all cached images");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  /**
   * cleanOldCache
   * Removes cached items that exceed the maxAgeMs (defaulting to 1 week).
   * This prevents the app from growing too large on the user's device.
   */
  async cleanOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
    if (Platform.OS === "web") return;

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
      console.error("Error cleaning cache:", error);
    }
  }

  /**
   * getCacheKey
   * Sanitizes the Firebase path to create a valid storage key.
   */
  private getCacheKey(firebasePath: string): string {
    return firebasePath.replace(/[^a-zA-Z0-9]/g, "_");
  }

  /**
   * updateMetadata
   * Updates the 'Last Cached' timestamp for an image.
   */
  private async updateMetadata(firebasePath: string) {
    try {
      const metadataStr = await AsyncStorage.getItem(METADATA_KEY);
      const metadata: ImageMetadata = metadataStr
        ? JSON.parse(metadataStr)
        : {};

      metadata[this.getCacheKey(firebasePath)] = {
        firebasePath,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  }
}

// Export as a singleton for use throughout the app
export const imageCache = new ImageCacheManager();
