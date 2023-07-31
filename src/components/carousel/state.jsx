import { gsap } from "gsap";
import { observable, computed } from "@legendapp/state";

export const state = observable({
    index: 0,
    next: computed( () => state.index.get() + 1 ),
    prev: computed( () => state.index.get() - 1 ),
    min: 0,
    max: 0,
    direction: 1,
    isAnimating: false,
    moving: false,
    loading: false,
    ready: false,
    paused: false,
    onTransition: false,
    onComplete: [],
    onStart: [],
    itemStatus:[],
    setStatus: ( index, value ) => { state.itemStatus[index].set(
        { index: index, state: value }
    )},
    timer: {
        count: 0,
        increment: 1000,
        interval: 5000,
        tick: 500,
        intervals: 0,
        clear: false,
        paused: false,
        running: false,

        reset:  () => { state.timer.count.set(0) },
        pause:  () => { state.timer.paused.set(true); },
        resume: () => { state.timer.paused.set(false); },
        kill:   () => { state.timer.clear.set(true); },
        start:  ( newInterval ) => {
            if( state.timer.running.peek() ) { return };
            const interval = newInterval || state.timer.interval.get();
            const increment = (state.timer.tick.get() / state.timer.increment.get())*1000;

            state.timer.running.set(true);
            const timer = setInterval( () => {
                if (state.timer.paused.get()) { return };
                if (state.timer.count.get() > interval ) {
                    state.timer.count.set(0);
                    state.timer.intervals.set( i => i + 1 );
                }
                state.timer.count.set( k => k + increment );
                if (state.timer.clear.get()) {
                    clearInterval(timer);
                    state.timer.clear.set(false);
                    state.timer.running.set(false);
                    state.timer.paused.set(false);
                }
            }, state.timer.tick.get());
        }
    },
});
