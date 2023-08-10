interface slideProps {
    el: HTMLElement;
    direction: number;
    size?: number;
    easing?: string;
    duration?: number;
}

export const slide = {
    /**
     * slide element el left or right based on direction
     * @param el HTMLElement
     * @param direction number -1 slide left, 1 slide right
     * @param size number will divide the sliding width by this number
     * @param easing string, like CSS easings, default ease-in-out
     * @param duration number in milliseconds
     * @returns void
     */
    to: ( { el, direction, size=3, easing="ease-in-out", duration=1000 }:slideProps ):any => {
        if( el !== undefined ) {
            const width = (el.scrollWidth / size) * direction;
            const currentScrollLeft = el.scrollLeft;
            const animationUniqueId = Math.random().toString(36).substr(2, 9);
            const animation = new Animation (
                new KeyframeEffect (
                    el,
                    [
                        { transform: `translate3D(${currentScrollLeft}, 0, 0)` },
                        { transform: `translate3D(${width}px, 0, 0)` },
                    ],
                    {
                        duration: duration,
                        easing: easing,
                    }
                ),
                document.timeline
            )
            animation.id = animationUniqueId;
            animation.play();
            return animation;
        }
        else {
            console.warn("slide.to was called without a valid element");
            return "error";
        }
    },
    /**
     * slide element right
     * @param el HTMLElement
     * @param easing string, like CSS easings, default ease-in-out
     * @param duration number in milliseconds
     * @returns void
     */
    next: (el:HTMLElement, duration?:number, easing?:string ):any => slide.to( { el:el, direction: -1, size:3, duration, easing } ),
    /**
     * slide element el left
     * @param el HTMLElement
     * @param easing string, like CSS easings, default ease-in-out
     * @param duration number in milliseconds
     * @returns void
     */
    prev: (el:HTMLElement, duration?:number, easing?:string ):any => slide.to( { el, direction: 1 , duration, easing } ),
}