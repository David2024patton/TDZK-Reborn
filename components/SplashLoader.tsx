
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Banner } from './Banner';
import { detectSplashImages, SplashAsset } from '../data/splashLoader';

// HARDCODED FALLBACK ASSETS
// Specific list as requested: 001-009, then 110
const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 110];

const HARDCODED_ASSETS: SplashAsset[] = indices.map(i => ({
  type: 'image',
  src: `https://itakhost.net/imgs/${i.toString().padStart(3, '0')}.jpeg`
}));

export const SplashLoader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [assets, setAssets] = useState<SplashAsset[]>(HARDCODED_ASSETS);
  const [debug, setDebug] = useState<any>(null);

  // Initialize and optionally fetch dynamic assets
  useEffect(() => {
    const load = async () => {
      const data = await detectSplashImages();
      if (data.images.length > 0) {
        setAssets(data.images);
        setDebug(data.debug);
      }
    };
    load();
  }, []);
  
  // Cycle Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % assets.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [assets]);

  return (
    <>
      <Header 
        currentIndex={currentIndex} 
        totalImages={assets.length}
        onIndexChange={setCurrentIndex}
      />
      
      <Banner 
        asset={assets[currentIndex]}
        debugInfo={debug}
      />
    </>
  );
};
