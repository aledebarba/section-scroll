import { state } from "../carousel/state";

export function linear( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {

    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    const result = from + (to - from) * (k / duration);
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeIn (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    const result = from + (to - from) * Math.pow(k / duration, 2);
    const proportionalResult = Math.abs((result * (max - min)) / 100);

    return proportionalResult;
}

export function easeOut (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    const result = from - (to - from) * (k / duration) * (k / duration - 2);
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInOut (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {

    const lerp = ( start:number, end:number, pct:number ) =>  start + ( end - start ) * pct
    const t = k * (1/duration);
    const easein = t * t;
    const flip = 1 - t;
    const easeout = 1 - (flip * flip);
    const easeinout = lerp( easein, easeout, t );
    const result = Math.round(easeinout*to)
    if(state.log.peek()) { console.log( result ) }

    return ( result ) ;
}

export function bounceOut (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    if ((k /= duration) < (1 / 2.75)) {
        const result = (to - from) * (7.5625 * k * k) + from;
        const proportionalResult = Math.abs((result * (max - min)) / 100);
        return proportionalResult;
    } else if (k < (2 / 2.75)) {
        const result = (to - from) * (7.5625 * (k -= (1.5 / 2.75)) * k + 0.75) + from;
        const proportionalResult = Math.abs((result * (max - min)) / 100);
        return proportionalResult;
    } else if (k < (2.5 / 2.75)) {
        const result = (to - from) * (7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375) + from;
        const proportionalResult = Math.abs((result * (max - min)) / 100);
        return proportionalResult;
    } else {
        const result = (to - from) * (7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375) + from;
        const proportionalResult = Math.abs((result * (max - min)) / 100);
        return proportionalResult;
    }
}

export function springOut (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    const result = (to - from) * (1 - Math.exp(-6 * k / duration) * Math.cos(20 * k / duration)) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return Math.round( ( proportionalResult + Number.EPSILON ) * 100 ) / 100;
}

export function springIn (from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;
    const result = (to - from) * (1 - Math.exp(-6 * k / duration) * Math.cos(20 * k / duration)) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return Math.round( ( proportionalResult + Number.EPSILON ) * 100 ) / 100;
}

export function easeInOutQuart ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    if ((k /= duration / 2) < 1) return (to - from) / 2 * k * k * k * k + from;
    const result = -(to - from) / 2 * ((k -= 2) * k * k * k - 2) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInBack ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    let s = 1.70158;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    const result = (to - from) * (k /= duration) * k * ((s + 1) * k - s) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeOutBack ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    let s = 1.70158;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    const result = (to - from) * ((k = k / duration - 1) * k * ((s + 1) * k + s) + 1) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInOutBack ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    let s = 1.70158;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    if ((k /= duration / 2) < 1) return (to - from) / 2 * (k * k * (((s *= (1.525)) + 1) * k - s)) + from;
    const result = (to - from) / 2 * ((k -= 2) * k * (((s *= (1.525)) + 1) * k + s) + 2) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInElastic ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const p = 0.3;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    if (k === 0) return from;
    if ((k /= duration) === 1) return to;
    let s = p / 4;
    const result = -(to - from) * Math.pow(2, 10 * (k -= 1)) * Math.sin((k * duration - s) * (2 * Math.PI) / p) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeOutElastic ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const p = 0.3;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    if (k === 0) return from;
    if ((k /= duration) === 1) return to;
    let s = p / 4;
    const result = (to - from) * Math.pow(2, -10 * k) * Math.sin((k * duration - s) * (2 * Math.PI) / p) + (to - from) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInOutElastic ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const p = 0.3 * 1.5;
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    if (k === 0) return from;
    if ((k /= duration / 2) === 2) return to;
    let s = p / 4;
    if (k < 1) {
        const result = -(to - from) / 2 * Math.pow(2, 10 * (k -= 1)) * Math.sin((k * duration - s) * (2 * Math.PI) / p) + from;
        const proportionalResult = Math.abs((result * (max - min)) / 100);
        return proportionalResult;
    }
    const result = (to - from) / 2 * Math.pow(2, -10 * (k -= 1)) * Math.sin((k * duration - s) * (2 * Math.PI) / p) + (to - from) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInBounce ( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const min = propertyRange ? propertyRange.min : 0;
    const max = propertyRange ? propertyRange.max : 100;

    const result = (to - from) - bounceOut(0, to - from, duration - k, duration) + from;
    const proportionalResult = Math.abs((result * (max - min)) / 100);
    return proportionalResult;
}

export function easeInCubic( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const result = (to - from) * (k /= duration) * k * k + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}

export function easeOutCubic( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const result = (to - from) * ((k = k / duration - 1) * k * k + 1) + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}


export function easeInOutCubic( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    if ((k /= duration / 2) < 1) return (to - from) / 2 * k * k * k + from;
    const result = (to - from) / 2 * ((k -= 2) * k * k + 2) + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}

export function easeInSine( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const result = -(to - from) * Math.cos(k / duration * (Math.PI / 2)) + (to - from) + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}

export function easeOutSine( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const result = (to - from) * Math.sin(k / duration * (Math.PI / 2)) + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}

export function easeInOutSine( from:number, to:number, duration:number, k:number, propertyRange?:{ min:number, max:number } ):number {
    const result = -(to - from) / 2 * (Math.cos(Math.PI * k / duration) - 1) + from;
    const proportionalResult = Math.abs((result * (propertyRange.max - propertyRange.min)) / 100);
    return proportionalResult;
}

export const ease = {
    linear,
    in: easeIn,
    out: easeOut,
    inOut: easeInOut,
    bounceOut:Function,
    springOut,
    springIn,
    inOutQuart: easeInOutQuart,
    inBack: easeInBack,
    outBack: easeOutBack,
    inOutBack: easeInOutBack,
    inElastic: easeInElastic,
    outElastic: easeOutElastic,
    inOutElastic: easeInOutElastic,
    inBounce: easeInBounce,
    inCubic: easeInCubic,
    outCubic: easeOutCubic,
    inOutCubic: easeInOutCubic,
    inSine: easeInSine,
    outSine: easeOutSine,
    inOutSine: easeInOutSine,
}