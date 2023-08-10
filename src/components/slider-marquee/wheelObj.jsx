"use client";
export function wheelObj() {
    const wheel = {
        useX: 1,
        useY: 1,
        xFactor: 0.5,
        yFactor: 1,
        xDirection: -1,
        yDirection: -1,
    };
    return {
        ...wheel,
        muteX: () => {
            wheel.useX = 0;
        },
        muteY: () => {
            wheel.useY = 0;
        },
        listenToX: () => {
            wheel.useX = 1;
        },
        listenToY: () => {
            wheel.useY = 1;
        }
    };
}
