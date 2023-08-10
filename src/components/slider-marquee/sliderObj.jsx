"use client";
export function sliderObj() {

    const slider = {
        ui: {
            Next: <div className="slider-default-ui-next" onClick={() => next()}>Next</div>,
            Prev: <div className="slider-default-ui-prev" onClick={() => prev()}>Prev</div>,
        },
        current: 0,
        startItem: 0,
        autoplay: false,
        autoplayDelay: 5000,
        autoplayDirection: 1,
        autoplayTimer: null,
        items: [],
    };

    function next() {
        slider.current = (slider.current + 1) % slider.items.length;
        slider.onSlideChange();
        slider.autoplayResume();
    }

    function prev() {
        slider.current = (slider.current - 1 + slider.items.length) % slider.items.length;
        slider.onSlideChange();
        slider.autoplayResume();
    }

    return {
        ...slider,
        init: function ({ items, startItem, autoplay, autoplayDelay, autoplayDirection, onSlideChange }) {
            slider.startItem = startItem || 0;
            slider.autoplay = autoplay || false;
            slider.autoplayDelay = autoplayDelay || 5000;
            slider.autoplayDirection = autoplayDirection || 1;
            slider.onSlideChange = onSlideChange || (() => { });
            slider.items = items;
        },
        autoplayPause: () => {
            if (slider.autoplayTimer) {
                clearTimeout(slider.autoplayTimer);
            }
        },
        autoplayResume: () => {
            slider.autoplayTimer = setTimeout(() => {
                slider.next();
            }, slider.autoplayDelay);
        },
        autoplayStart: () => {
            slider.autoplay = true;
            slider.autoplayResume();
        },
        autoplayStop: () => {
            slider.autoplay = false;
            slider.autoplayPause();
        },
    };
}
