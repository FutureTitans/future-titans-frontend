'use client';
import { useState, useEffect, useRef } from 'react';

function useSupportsWebMAlpha() {
    const [supported, setSupported] = useState(null);

    useEffect(() => {
        if (typeof navigator === 'undefined') { setSupported(true); return; }
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
        if (isIOS) { setSupported(false); return; }
        const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua);
        if (isSafari) { setSupported(false); return; }
        setSupported(true);
    }, []);

    return supported;
}

export default function ZunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const idleRef = useRef(null);
    const talkRef = useRef(null);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [ready, setReady] = useState(false);
    const timeoutRef = useRef(null);
    const supportsWebM = useSupportsWebMAlpha();

    useEffect(() => {
        if (isTalking) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActualIsTalking(true);
        } else {
            timeoutRef.current = setTimeout(() => setActualIsTalking(false), 2000);
        }
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [isTalking]);

    useEffect(() => {
        if (supportsWebM === false) return;
        if (actualIsTalking) {
            talkRef.current?.play().catch(() => {});
            idleRef.current?.pause();
        } else {
            idleRef.current?.play().catch(() => {});
            talkRef.current?.pause();
            if (talkRef.current) talkRef.current.currentTime = 0;
        }
    }, [actualIsTalking, supportsWebM]);

    if (supportsWebM === null) {
        return (
            <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full animate-pulse">
                    <span className="text-[10px] text-gray-400 font-medium">syncing...</span>
                </div>
            </div>
        );
    }

    if (!supportsWebM) {
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

    return (
        <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
            <video
                ref={idleRef}
                src="/idle_animation.webm"
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={() => setReady(true)}
                className="w-full object-cover object-bottom pointer-events-none select-none drop-shadow-md"
                style={{ display: actualIsTalking ? 'none' : 'block' }}
            />
            <video
                ref={talkRef}
                src="/talk_animation.webm"
                loop
                muted
                playsInline
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
