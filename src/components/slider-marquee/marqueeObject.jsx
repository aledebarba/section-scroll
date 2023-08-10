"use client";
export function marqueeObject() {

    const marquee = {
        direction: 1,
        start: 0,
        current: 0,
        target: 0.001,
        acceleration: 0.00001,
        paused: false,
        onPause: () => { },
        onResume: () => { },
        resume: () => {
            marquee.paused = false;
            marquee.onResume();
        },
        pause: (time) => {
            marquee.paused = true;
            if (time) {
                setTimeout(() => {
                    marquee.resume();
                }, time);
            }
            marquee.onPause();
        }
    };

    return {
        ...marquee,
        init: (start, target, acceleration, direction, onPause, onResume) => {
            marquee.start = start || 0;
            marquee.target = target || 0.001;
            marquee.acceleration = acceleration || 0.00001;
            marquee.direction = direction || 1;
            marquee.onPause = onPause || (() => { });
            marquee.onResume = onResume || (() => { });
        },
        reset: () => {
            marquee.current = marquee.start;
        },
        speed: () => {
            if (marquee.current < marquee.target) {
                marquee.current += marquee.acceleration;
            }
            return marquee.paused ? 0 : marquee.current * marquee.direction;
        },
        direction: (value) => { marquee.direction = value; },
    };
}
;
