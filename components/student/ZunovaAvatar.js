'use client';
import { useState, useEffect, useRef } from 'react';

const FPS = 24;

// Global cache to avoid reloading images if the component unmounts and remounts
const imageCache = {
    idle: [],
    talk: [],
    loaded: { idle: false, talk: false },
};

const idleFrames = Array.from({ length: 105 }, (_, i) => i + 1); // 1 to 105
const talkFrames = Array.from({ length: 145 }, (_, i) => i + 1);  // 1 to 145

// Preloader utility
const preloadImages = (folder, framesArray, cacheArray, onComplete) => {
    let loadedCount = 0;
    const total = framesArray.length;

    framesArray.forEach((frameNum, index) => {
        const img = new Image();
        const frameStr = folder === 'idle' ? `0${frameNum}` : String(frameNum).padStart(5, '0');
        img.src = `/${folder}/${frameStr}.png?v=3`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === total && onComplete) {
                onComplete();
            }
        };
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === total && onComplete) {
                onComplete();
            }
        };
        cacheArray[index] = img;
    });
};

export default function zunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const canvasRef = useRef(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [imagesReady, setImagesReady] = useState(false);

    const requestRef = useRef();
    const lastUpdateRef = useRef(0);
    const timeoutRef = useRef(null);

    // Initial Preload
    useEffect(() => {
        // Load idle frames first for immediate display
        if (!imageCache.loaded.idle) {
            preloadImages('idle', idleFrames, imageCache.idle, () => {
                imageCache.loaded.idle = true;
                setImagesReady(true); // Ready to show at least idle
                // Then lazily preload talk frames in background
                if (!imageCache.loaded.talk) {
                    preloadImages('talk', talkFrames, imageCache.talk, () => {
                        imageCache.loaded.talk = true;
                    });
                }
            });
        } else {
            setImagesReady(true);
        }
    }, []);

    // Handle isTalking timeout (buffer 2s after generation finishes)
    useEffect(() => {
        if (isTalking) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActualIsTalking(true);
        } else {
            timeoutRef.current = setTimeout(() => {
                setActualIsTalking(false);
            }, 2000);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isTalking]);

    // Reset frame to 0 on state switch
    useEffect(() => {
        setFrameIndex(0);
    }, [actualIsTalking]);

    const currentCache = actualIsTalking ? imageCache.talk : imageCache.idle;
    const totalFrames = actualIsTalking ? talkFrames.length : idleFrames.length;

    // Animation Loop
    useEffect(() => {
        if (!imagesReady) return;

        const frameInterval = 1000 / FPS;

        const updateFrame = (time) => {
            if (time - lastUpdateRef.current > frameInterval) {
                setFrameIndex((prev) => (prev + 1) % totalFrames);
                lastUpdateRef.current = time;
            }
            requestRef.current = requestAnimationFrame(updateFrame);
        };

        requestRef.current = requestAnimationFrame(updateFrame);
        return () => cancelAnimationFrame(requestRef.current);
    }, [totalFrames, imagesReady]);

    // Draw to Canvas
    useEffect(() => {
        if (!imagesReady || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Ensure image is actually fully loaded before drawing
        const img = currentCache[frameIndex] || currentCache[0];

        if (img && img.complete && img.naturalHeight !== 0) {
            // Clear previous frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw image scaled up roughly matching previous scale-[1.2]
            const scaleX = 1.7; // slightly wider
            const scaleY = 1.05;  // keep vertical mostly the same
            const w = canvas.width * scaleX;
            const h = canvas.height * scaleY;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;

            ctx.drawImage(img, x, y, w, h);
        }
    }, [frameIndex, currentCache, imagesReady]);

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* 300x300 internal canvas resolution, scaled by CSSclassName */}
            <canvas
                ref={canvasRef}
                width={450}
                height={450}
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
            />
            {/* Show a spinner until idle frames are preloaded */}
            {!imagesReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full animate-pulse">
                    <span className="text-[10px] text-gray-400 font-medium">syncing...</span>
                </div>
            )}
        </div>
    );
}
