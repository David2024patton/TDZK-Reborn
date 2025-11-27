
import React, { useState, useEffect } from 'react';

interface BannerProps {
  asset: { type: string; src: string } | null;
  debugInfo?: any;
}

export const Banner: React.FC<BannerProps> = ({ asset }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  // When asset changes, reset
  useEffect(() => {
    if (asset) {
      setImgSrc(asset.src);
      setHasError(false);
    }
  }, [asset]);

  const handleError = () => {
    // Remote Asset Fallback Strategy
    if (imgSrc.startsWith('http')) {
        if (imgSrc.endsWith('.jpeg')) {
            setImgSrc(imgSrc.replace('.jpeg', '.jpg'));
            return;
        }
        if (imgSrc.endsWith('.jpg')) {
            setImgSrc(imgSrc.replace('.jpg', '.png'));
            return;
        }
        // If PNG fails or other extensions, give up
        setHasError(true);
        return;
    }

    // Local Asset Fallback Strategy
    if (imgSrc.startsWith('/public/')) {
      setImgSrc(imgSrc.replace('/public', ''));
    } else if (imgSrc.startsWith('public/')) {
        setImgSrc('/' + imgSrc); // Try absolute if relative failed
    } else {
      setHasError(true);
    }
  };

  if (!asset) {
    return <div className="w-full h-[200px] md:h-[250px] bg-[#020202] flex items-center justify-center text-gray-500">No Asset Loaded</div>;
  }

  return (
    <div className="relative w-full h-[200px] md:h-[250px] bg-[#020202] border-b border-[#333333] overflow-hidden group shadow-2xl flex items-center justify-center">
      
      {/* Media Layer */}
      {!hasError ? (
        asset.type === 'video' ? (
          <video
            key={asset.src} 
            src={imgSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
            onError={handleError}
          />
        ) : (
          <img
            key={asset.src} 
            src={imgSrc}
            alt="Splash"
            className="w-full h-full object-cover opacity-90 animate-in fade-in duration-700"
            onError={handleError}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full bg-[#110000]">
            <div className="text-red-500 font-bold mb-2 text-[12px] uppercase tracking-widest">Image Failed To Load</div>
            <div className="text-gray-500 font-mono text-[10px] mb-2 bg-black/50 px-2 py-1 rounded border border-gray-800">src: {imgSrc}</div>
            <div className="text-gray-600 text-[9px] max-w-[300px]">Check that the file exists in the folder and the name matches exactly</div>
        </div>
      )}

      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  );
};
