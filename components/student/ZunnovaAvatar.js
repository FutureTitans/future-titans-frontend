'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function ZunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const idleRef = useRef(null);
    const talkRef = useRef(null);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [ready, setReady] = useState(false);
    const [needsBlend, setNeedsBlend] = useState(false);
    const timeoutRef = useRef(null);

    const detectFormat = useCallback((video) => {
        if (video?.currentSrc?.endsWith('.mp4')) {
            setNeedsBlend(true);
        }
    }, []);

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

    useEffect(() => {
        if (actualIsTalking) {
            talkRef.current?.play().catch(() => {});
            idleRef.current?.pause();
        } else {
            idleRef.current?.play().catch(() => {});
            talkRef.current?.pause();
            if (talkRef.current) talkRef.current.currentTime = 0;
        }
    }, [actualIsTalking]);

    const blendStyle = needsBlend ? { mixBlendMode: 'screen' } : undefined;

    return (
        <div
            className={`relative flex items-end justify-center overflow-hidden ${className}`}
            style={needsBlend ? { isolation: 'isolate' } : undefined}
        >
            <video
                ref={idleRef}
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={(e) => { setReady(true); detectFormat(e.target); }}
                className="w-full object-cover object-bottom pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'none' : 'block', ...blendStyle }}
            >
                <source src="/idle_animation.webm" type="video/webm" />
                <source src="/zunnova_mobile.mp4" type="video/mp4" />
            </video>
            <video
                ref={talkRef}
                loop
                muted
                playsInline
                onCanPlay={(e) => detectFormat(e.target)}
                className="w-full object-cover object-bottom pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'block' : 'none', ...blendStyle }}
            >
                <source src="/talk_animation.webm" type="video/webm" />
                <source src="/zunnova_mobile.mp4" type="video/mp4" />
            </video>
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full animate-pulse">
                    <span className="text-[10px] text-gray-400 font-medium">syncing...</span>
                </div>
            )}
        </div>
    );
}
