import { gsap } from "gsap";
import { observable, computed } from "@legendapp/state";

export const slider = observable({
    init:({ items, ref, increment, tick, interval, autoplay, clones, loop, display, pauseOnHover, startItem, Next, Prev, Layout, Nav, Goto }) => {

        if( !items ) {
            fail( "Slider requires an array of items" );
        }

        const UI = defaultUIElements();

        slider.options.clones.set( clones || 1 );
        slider.options.startItem.set( startItem || 0 );
        slider.items.data.set( items || [] );
        slider.carouselRef.set( ref );
        slider.options.loop.set(  loop || true );
        slider.options.autoplay.set( autoplay || false );
        slider.options.interval.set( interval || 5000 );
        slider.options.pauseOnHover.set( pauseOnHover || false );
        slider.options.clones.set( clones | 1 );
        slider.options.display.set( display || 1);
        slider.timer.increment.set( increment || 1000 );
        slider.timer.tick.set( tick || 1000 );
        slider.assign({
            ui:{
                Next: Next || UI.Next,
                Prev: Prev || UI.Prev,
                Layout: Layout || UI.Layout,
                Nav: Nav || UI.Nav,
                Goto: Goto || UI.Goto,
            }
        })
        slider.jumpTo( startItem+clones || clones );
        slider.timer.start();
    },

    createTimeline: () => {
        const items = slider.items.snaps.get();
        const timeline = gsap.timeline( { defaults: { duration: 1, ease: "power2.inOut" }, paused: true } );

        function newTween( label, tox ){
            var tl = gsap.timeline();
            tl.to( slider.carouselRef.get().current, { x: -tox }, {} ,">"  );
            return tl;
        }
        items.forEach( ( item, index ) => {
            timeline.add( `item-${index}`, gsap.to( slider.carouselRef.get().current, { x: -1 * item.offsetLeft } ), 0 )
        })
        slider.timeline = timeline;
    },
    timeline: null,

    clones: ()=>slider.options.clones.get() * 2,

    next: () => {

        let current = slider.current.index.get();
        let next = slider.state.next.get();
        let max = slider.items.size();
        let min = slider.options.clones.get();

        if( next >=max ) {
            next = min
            slider.fromTo( current, min-1, { duration: 0 } )
        }
        //slider.goTo( next );
        slider.current.index.set( slider.fromTo( current, next, { duration: 0.5 } ) );
    },

    prev: () => {
        let current = slider.state.getCurrentIndex();
        let previous = current - 1;

        if( previous < 0 ) {
            slider.jumpTo( slider.items.size() );
            previous = slider.items.size(-1)
        };
        slider.goTo( previous );

    },

    fromTo: ( from, to, varsObj ) => {
        const tl = slider.timeline;
        if( slider.current.isAnimating.peek() ) { return from };
        slider.current.isAnimating.set( true );
        tl.tweenFromTo( from, to, varsObj ).then( () => {
            slider.timer.reset()
            slider.current.isAnimating.set( false )
            return to
        });
    },

    goTo:( index, velocity=500, ease="power2.inOut" ) => {
        if( slider.carouselRef.get() == undefined || slider.carouselRef.get().current == undefined ) { return index };
        const fromIndex = slider.state.getCurrentIndex();
        const toObj = slider.items.getSnap( index );
        const to = -1 * ( toObj.offsetLeft );
        const fromObj = slider.items.getSnap( fromIndex );
        const from = -1 * (fromObj.offsetLeft);
        const duration = (velocity * Math.abs(fromIndex - index ))/1000;

        function onComplete() {
            slider.timer.reset()
            slider.state.isAnimating.set( false );
            slider.current.index.set( index );
        }

        function onStart() {
            slider.state.isAnimating.set( true );
        }
        gsap.fromTo(slider.carouselRef.get().current,
            { x: from },
            {
                x: to, duration: duration, eas: ease,
                onStart: onStart, onComplete: onComplete
            }
        );
    },

    jumpTo: ( index ) => {
        if( !slider.carouselRef.get()  || !slider.carouselRef.get().current  ) {
            console.error( "Undefined object reference in slider.jumpTo: slider.carouselRef.get().current is ", lider.carouselRef.get().current )
            return
        };
        const to = slider.items.getSnap( index )?.offsetLeft ||
            slider.items.getSnap( slider.getCurrent() )?.offsetLeft;

        gsap.set( slider.carouselRef.get().current, { x: to } )
        slider.current.index.set( index );
    },

    getCurrent: () => slider.current.index.get(),
    isCurrent: ( index ) => slider.current.index.get() == index,

    carouselRef: null,
    items: {
        data: [],
        getItems: () => slider.items.data.get(),
        getItem: ( index ) => slider.items.data.get()[index],
        size: (offset = 0) => {
            return slider.items.data.get().length + offset
        },
        renderData: () => {
            if( slider.items.size() == 0 ) { return [] }
            return [ ...slider.items.data.slice( slider.options.clones.get() * -1 ), ...slider.items.data, ...slider.items.data.slice( 0, slider.options.clones.get() ) ]
        },
        snaps: [],
        getSnap: (index) => slider.items.snaps.get()[index],
    },

    state: {
        getCurrentIndex: ( minusClones ) => slider.current.index.get() - ( minusClones || 0 ),
        isAnimating: false,
        isLoading: false,
        isReady: false,
        isPaused: false,
        nextItem: 0,
        prevItem: 0,
        next: computed( () => slider.current.index.get() + 1 ),
        prev: computed( () => slider.current.index.get() - 1 ),
        max: 0,
        min: 0,

    },

    ui: {},
    options: {
        loop: false,
        autoplay: false,
        interval: 5000,
        pauseOnHover: false,
        clones: 1,
        startItem: 0,
    },
    current: {
        index: 0,
        focus: false,
        isAnimating: false,
    },
    timer: {
        count: 0,
        increment: 1000,
        tick: 500,
        interval: computed(() => slider.options.interval.get() ),
        clear: false,
        paused: false,
        running: false,
        reset:  () => { slider.timer.count.set(0) },
        pause:  () => { slider.timer.paused.set(true); },
        resume: () => { slider.timer.paused.set(false); },
        kill:   () => { slider.timer.clear.set(true); },
        start:  ( newInterval ) => {
            const interval = newInterval || slider.options.interval.get();
            if( slider.timer.running.get() ) { return };
            slider.timer.running.set(true);
            const timer = setInterval( () => {
                if (slider.timer.paused.get()) { return };
                const interval = newInterval || slider.options.interval.peek();
                if (slider.timer.count.get() > interval ) {
                    slider.next();
                    slider.timer.count.set(0);
                }
                slider.timer.count.set(time => time + slider.timer.increment.get());
                if (slider.timer.clear.get()) {
                    clearInterval(timer);
                    slider.timer.clear.set(false);
                }
            }, slider.timer.tick.get());
        }
    },
})

function fail( status ) {

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

function defaultUIElements() {
    return ({
        Next: ()=>{ return <span>Next</span> },
        Prev: ()=>{ return <span>Previous</span> },
        Layout: ()=>{ return <span>Layout</span> },
        Goto: ( props ) => {
            const navigateTo = props?.item;
            return <div onClick={()=>slider.goto( navigateTo )}>
                { props?.children }
            </div>
        },
        Nav: ( items )=>{ return <span>[...]</span> },
    })
}
