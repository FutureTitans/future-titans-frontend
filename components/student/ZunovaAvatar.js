'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const FPS = 24;

const idleFrames = Array.from({ length: 20 }, (_, i) => i + 108); // 108 to 127
const talkFrames = Array.from({ length: 145 }, (_, i) => i + 1);  // 1 to 145

// Global cache — lives outside the component so it survives re-mounts.
// Populated lazily inside useEffect (browser-only) to avoid SSR crashes.
let imageCache = null;

function getCache() {
    if (!imageCache) {
        imageCache = {
            idle: new Array(idleFrames.length),
            talk: new Array(talkFrames.length),
            loaded: { idle: false, talk: false },
        };
    }
    return imageCache;
}

// Preloader: returns a Promise that resolves when all images in the set
// are either loaded or errored (so the animation can always proceed).
function preloadImages(folder, framesArray, cacheArray) {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const total = framesArray.length;

        framesArray.forEach((frameNum, index) => {
            const img = new window.Image();           // ← use window.Image explicitly
            img.src = `/${folder}/${String(frameNum).padStart(5, '0')}.png`;
            img.onload = img.onerror = () => {
                cacheArray[index] = img;
                loadedCount++;
                if (loadedCount >= total) resolve();
            };
        });
    });
}

export default function ZunovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const canvasRef = useRef(null);
    const frameIndexRef = useRef(0);
    const [imagesReady, setImagesReady] = useState(false);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);

    const requestRef = useRef();
    const lastUpdateRef = useRef(0);
    const timeoutRef = useRef(null);

    // ──── 1. Preload (browser-only) ────
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const cache = getCache();

        if (cache.loaded.idle) {
            setImagesReady(true);
            return;
        }

        let cancelled = false;

        (async () => {
            await preloadImages('idle', idleFrames, cache.idle);
            cache.loaded.idle = true;
            if (!cancelled) setImagesReady(true);

            // Background-load talk frames
            if (!cache.loaded.talk) {
                await preloadImages('talk', talkFrames, cache.talk);
                cache.loaded.talk = true;
            }
        })();

        return () => { cancelled = true; };
    }, []);

    // ──── 2. isTalking with 2 s buffer ────
    useEffect(() => {
        if (isTalking) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActualIsTalking(true);
        } else {
            timeoutRef.current = setTimeout(() => setActualIsTalking(false), 2000);
        }
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [isTalking]);

    // Reset frame on mode switch
    useEffect(() => { frameIndexRef.current = 0; }, [actualIsTalking]);

    // ──── 3. Animation loop (no React state per frame — pure refs + canvas) ────
    const draw = useCallback(() => {
        if (!canvasRef.current) return;
        const cache = getCache();
        const currentCache = actualIsTalking ? cache.talk : cache.idle;
        const totalFrames = actualIsTalking ? talkFrames.length : idleFrames.length;
        const idx = frameIndexRef.current % totalFrames;
        const img = currentCache[idx];

        if (img && img.complete && img.naturalHeight !== 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scale 1.2× centred
            const scale = 1.2;
            const w = canvas.width * scale;
            const h = canvas.height * scale;
            ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        }
    }, [actualIsTalking]);

    useEffect(() => {
        if (!imagesReady) return;

        const frameInterval = 1000 / FPS;

        const tick = (time) => {
            if (time - lastUpdateRef.current > frameInterval) {
                const cache = getCache();
                const totalFrames = actualIsTalking ? talkFrames.length : idleFrames.length;
                frameIndexRef.current = (frameIndexRef.current + 1) % totalFrames;
                lastUpdateRef.current = time;
                draw();
            }
            requestRef.current = requestAnimationFrame(tick);
        };

        // Draw first frame immediately
        draw();
        requestRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(requestRef.current);
    }, [imagesReady, actualIsTalking, draw]);

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
            />
            {!imagesReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full animate-pulse">
                    <span className="text-[10px] text-gray-400 font-medium">syncing...</span>
                </div>
            )}
        </div>
    );
}
