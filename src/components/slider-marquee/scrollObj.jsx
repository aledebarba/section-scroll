"use client";
export function scrollObj() {
    const scroll = {
        speed: 0,
        decay: 0.92,
        dragMultiply: [
            { width: 3840, by: 0.00007 },
            { width: 2560, by: 0.00010 },
            { width: 1920, by: 0.00015 },
            { width: 1440, by: 0.0002 },
            { width: 1024, by: 0.00025 },
            { width: 768, by: 0.0003 },
            { width: 320, by: 0.0005 },
        ],
        axis: "x",
    };
    return { ...scroll };
}
