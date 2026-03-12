'use client';
import { useState, useEffect, useRef } from 'react';

const FPS = 24;

export default function ZunovaAvatar({ isTalking, className = "w-16 h-16" }) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [actualIsTalking, setActualIsTalking] = useState(isTalking);
    const requestRef = useRef();
    const lastUpdateRef = useRef(0);
    const timeoutRef = useRef(null);

    // idle folder only has these specific frame numbers
    const idleFrames = [
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
        118, 119, 120, 121, 122, 123, 124, 125, 126, 127
    ];

    // talk folder has frames 1 through 145 continuously
    const talkFrames = Array.from({ length: 145 }, (_, i) => i + 1);

    useEffect(() => {
        if (isTalking) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActualIsTalking(true);
        } else {
            timeoutRef.current = setTimeout(() => {
                setActualIsTalking(false);
            }, 2000); // Talk for 2 seconds longer after generation finishes
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isTalking]);

    const currentFolder = actualIsTalking ? 'talk' : 'idle';
    const framesArray = actualIsTalking ? talkFrames : idleFrames;
    const totalFrames = framesArray.length;

    useEffect(() => {
        const frameInterval = 1000 / FPS;

        const updateFrame = (time) => {
            if (time - lastUpdateRef.current > frameInterval) {
                setFrameIndex((prev) => {
                    let next = prev + 1;
                    if (next >= totalFrames) return 0;
                    return next;
                });
                lastUpdateRef.current = time;
            }
            requestRef.current = requestAnimationFrame(updateFrame);
        };

        requestRef.current = requestAnimationFrame(updateFrame);

        return () => cancelAnimationFrame(requestRef.current);
    }, [totalFrames]);

    // When switching between talk and idle, reset frame to 0
    useEffect(() => {
        setFrameIndex(0);
    }, [actualIsTalking]);

    const currentFrameNumber = framesArray[frameIndex] || framesArray[0];
    const frameStr = String(currentFrameNumber).padStart(5, '0');
    const src = `/${currentFolder}/${frameStr}.png`;

    return (
        <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
            <img
                src={src}
                alt="Zunova"
                className="w-full h-full object-contain pointer-events-none select-none scale-[1.2] drop-shadow-md"
                loading="eager"
                decoding="sync"
            />
        </div>
    );
}
