'use client';
import { useState, useEffect, useRef } from 'react';

export default function ZunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const idleRef = useRef(null);
    const talkRef = useRef(null);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [ready, setReady] = useState(false);
    const timeoutRef = useRef(null);

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

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <video
                ref={idleRef}
                src="/idle_animation.webm"
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={() => setReady(true)}
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'none' : 'block' }}
            />
            <video
                ref={talkRef}
                src="/talk_animation.webm"
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'block' : 'none' }}
            />
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full animate-pulse">
                    <span className="text-[10px] text-gray-400 font-medium">syncing...</span>
                </div>
            )}
        </div>
    );
}
