'use client';
import { useState, useEffect, useRef } from 'react';

function useIsMobile() {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
        const isAndroid = /Android/i.test(ua);
        const isMobileUA = /Mobile|webOS|Opera Mini/i.test(ua);
        setMobile(isIOS || isAndroid || isMobileUA);
    }, []);

    return mobile;
}

export default function ZunnovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const idleRef = useRef(null);
    const talkRef = useRef(null);
    const mobileRef = useRef(null);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const [ready, setReady] = useState(false);
    const timeoutRef = useRef(null);
    const isMobile = useIsMobile();

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
        if (isMobile) {
            mobileRef.current?.play().catch(() => {});
            return;
        }
        if (actualIsTalking) {
            talkRef.current?.play().catch(() => {});
            idleRef.current?.pause();
        } else {
            idleRef.current?.play().catch(() => {});
            talkRef.current?.pause();
            if (talkRef.current) talkRef.current.currentTime = 0;
        }
    }, [actualIsTalking, isMobile]);

    if (isMobile) {
        return (
            <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
                <video
                    ref={mobileRef}
                    src="/zunnova_mobile.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onCanPlay={() => setReady(true)}
                    className="w-full h-full object-cover object-bottom pointer-events-none select-none rounded-xl"
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
