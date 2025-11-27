
import { GENERATED_SPLASH_ASSETS } from './generatedSplash';

export interface SplashAsset {
  type: 'image' | 'video';
  src: string;
}

export interface SplashData {
  images: SplashAsset[];
  debug?: any;
}

/**
 * Detects splash images.
 * Strategy:
 * 1. Fetch from /public/splash.php (Dynamic PHP Scan)
 * 2. Fallback to generatedSplash.ts (Static Build List)
 */
export const detectSplashImages = async (): Promise<SplashData> => {
  // 1. Try PHP Script
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    // Try the PHP script at the public location
    const res = await fetch('/public/splash.php', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type");
    
    // Ensure we actually got JSON back
    if (res.ok && contentType && contentType.includes("application/json")) {
      const fileList = await res.json();
      
      if (Array.isArray(fileList) && fileList.length > 0) {
        const images = fileList.map((filePath: string) => {
            const ext = filePath.split('.').pop()?.toLowerCase();
            const type = (ext === 'mp4' || ext === 'mov') ? 'video' : 'image';
            return { type, src: filePath };
        });

        return { 
          images: images as SplashAsset[], 
          debug: { source: 'PHP', count: images.length } 
        };
      }
    }
  } catch (e) {
    // PHP unavailable or network error
    console.warn("Splash PHP fetch failed, falling back to static.");
  }

  // 2. Fallback to Generated File (Fixed Paths)
  if (GENERATED_SPLASH_ASSETS && GENERATED_SPLASH_ASSETS.length > 0) {
      return { 
          images: GENERATED_SPLASH_ASSETS as SplashAsset[], 
          debug: { source: 'GeneratedFile', count: GENERATED_SPLASH_ASSETS.length } 
      };
  }

  // 3. Empty State
  return { 
    images: [], 
    debug: { source: 'None', info: 'No assets found via PHP or Generated file. Check /public/splash/ folder.' } 
  };
};
