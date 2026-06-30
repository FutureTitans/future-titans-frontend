'use client';
import { useState, useEffect, useRef } from 'react';

export default function ZunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [ready, setReady] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (isTalking) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActualIsTalking(true);
        } else {
            timeoutRef.current = setTimeout(() => setActualIsTalking(false), 2000);
        }
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [isTalking]);

    return (
        <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
            <img
                src="/idle_animation.webp"
                alt="Zunnova AI"
                onLoad={() => setReady(true)}
                className="w-full object-cover object-bottom pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'none' : 'block' }}
            />
            <img
                src="/talk_animation.webp"
                alt="Zunnova AI talking"
                className="w-full object-cover object-bottom pointer-events-none select-none drop-shadow-md"
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
