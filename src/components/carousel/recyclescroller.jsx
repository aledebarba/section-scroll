"use-client"
import { useLayoutEffect, useRef, Children, cloneElement  } from "react";
import { observe  } from "@legendapp/state";
import { SlideDefault } from "./slideslayouts";
import { defaultUi } from "./ui";
import { state } from "./state";
import { gsap } from "gsap";

export const RecycleScroller = ({
    items=[],
    autoplay = true, interval = 5000, increment = 1000, tick = 1000, display = 1, startItem,
    loop = true, pauseOnHover = false,
    Next = Next || defaultUi.Next,
    Prev = Prev || defaultUi.Prev,
    Nav  = Nav || defaultUi.Nav,
    Layout = SlideDefault,
    children,
    ...otherprops }) => {

    const clones = display;
    const container = useRef(null)
    const masterTimeline = useRef(null);
    const navRef = useRef(null);
    const refs = useRef([]);
    const content = useRef([
        ...items.slice( -clones ),
        ...items,
        ...items.slice( 0, clones )
    ]);


    const tween = ( from, to, vars ) => {
        if(!masterTimeline.current) { return };
        //if( state.isAnimating.get() ) { return };

        const fromLabel = `step:${from}`;
        const toLabel = `step:${to}`;
        state.isAnimating.set( true )


        masterTimeline.current.tweenFromTo( fromLabel, toLabel, {
            ...vars,
            onStart: onStart,
            onComplete: onComplete,
            onUpdate: onUpdate,
        } ).then( () => { state.isAnimating.set( false ) } );

        state.index.set( to );


        function onComplete() {
            state.isAnimating.set( false );
            state.onComplete.set( state.index.get() );
            state.onStart.set( null )
        }
        function onStart() {
            state.isAnimating.set( true );
            state.onComplete.set( null );
            console.log( state.index.get() )
            state.onStart.set( state.index.get() );
        }
        function onUpdate() {
            state.isAnimating.set( true );
            console.log( "progress ", transition.progress(), "of ", transition.duration() )
        }
    }

    const jumpTo = ( to ) => {
        const tl = gsap.timeline();
        gsap.set( container.current, { x: -1 * refs.current[to].offsetLeft })
        //tl.to( container.current, { x: -1 * refs.current[to].offsetLeft, duration: 0 } );
    }

    const handleNext = ( vars ) => {
        const tl = gsap.timeline();
        if( state.next.get() >= state.max.get() ) {
            jumpTo( state.min.get()-1 );
            state.index.set( state.min.get()-1 );
        }
        tl.to( container.current, { x: -1 * refs.current[ state.next.get() ].offsetLeft, duration: 0.5 } );
        state.index.set( state.next.get() );
    }

    const handlePrev = ( vars ) => {
        const tl = gsap.timeline();
        let ito = state.prev.get();

        function onComplete( ito ) {
            state.isAnimating.set( false );
            state.onComplete[ ito ].set( ito );
            state.onStart[ ito ].set( null )
        }

        function onStart( ito ) {
            console.log( "on start->", ito )
            state.index.set( ito );
            state.onStart[ ito ].set( ito );
            state.onComplete[ ito ].set( null );
            state.isAnimating.set( true );
        }


        if( state.prev.get() <= state.min.get()-1 ) {
            ito = state.max.get();
            tl.add( gsap.set( container.current, { x: -1 * refs.current[ ito ].offsetLeft } ))
            ito--
        }

        console.log( ito )

        tl.add(gsap.to( container.current, {
            x: -1 * refs.current[ ito ].offsetLeft,
            duration: 1,
            onStartParams: [ ito ],
            onCompleteParams: [ ito ],
            onStart: onStart,
            onComplete: onComplete,
        }))



    }

    const goto = ( to, vars ) => {
        const duration = vars?.duration || Math.abs( state.index.get() - to ) * 0.5;
        gsap.to( container.current, { x: -1 * refs.current[to].offsetLeft, duration: duration });
        state.timer.reset();
        state.index.set( to );
    }

    const next = ( vars ) => {
        transition( masterTimeline.current, state.index.get(), state.next.get(), { ease: "linear" } );
    }

    const prev = ( vars ) => { transition( masterTimeline.current, state.index.get(), state.prev.get(), { ease: "linear" } ); }


    useLayoutEffect(() => {

        if ( !container.current ) return;

        const itemsCoords = refs.current.map( el => {
            return ( {
            x:el.getBoundingClientRect().x,
            y:el.getBoundingClientRect().y,
            w:el.getBoundingClientRect().width,
            h:el.getBoundingClientRect().height,
            width: el.offsetWidth,
            height: el.offsetHeight,
            top: el.offsetTop,
            left: el.offsetLeft,
            offsetLeft: el.offsetLeft,
            offsetwidth: el.offsetWidth,
            bottom: el.offsetTop+el.offsetHeight,
            right: el.offsetLeft+el.offsetWidth,
            title: el.getAttribute("data-title"),
            index: el.getAttribute("data-index"),
            ref: el.getAttribute("data-ref"),
        })})

        masterTimeline.current = createMasterTimeline( itemsCoords, container.current );
        state.min.set( display )
        state.index.set( startItem ? startItem : 1 );
        state.max.set( children.length+display )
        jumpTo( state.index.get() );
        container.current.classList.remove( "opacity-0" );
        observe( state.index , ( i ) => {

        } );

        if ( autoplay && !state.timer.running.get() ) {
            state.timer.start()
            observe( state.timer.intervals, ( i )=>{
                //next();
            })
        };

        // event listeners
        const handleResizeWindow = window.addEventListener( "resize", () => {
            jumpTo( state.index.get(), true );
            state.timer.reset();
        });

        const handleKeypress = window.addEventListener( "keydown", (e) => {
            if( e.key === "ArrowRight" ) {
                next();
            } else if( e.key === "ArrowLeft" ) {
                prev();
            }
        });

        return () => {
            window.removeEventListener( "resize", handleResizeWindow );
            window.removeEventListener( "keydown", handleKeypress );
            state.timer.kill();
        }
    }, [] );

    const itemOnStartFn = ( onstart ) => onstart ? onstart : () => {};

    return (
        <div className="relative isolate">
            <div
                onMouseEnter={() => { if (pauseOnHover) state.timer.pause() }}
                onMouseLeave={() => { if (pauseOnHover) state.timer.resume() }}
                {...otherprops}
            >
            <div className="relative w-full h-full overflow-hidden">
                <div ref={ container }
                    className="relative flex w-auto h-full overflow-visible opacity-0 flex-nowrap"
                    >
                    {[
                            ...Children.toArray( children ).slice( -clones ),
                            ...Children.toArray( children ),
                            ...Children.toArray( children ).slice( 0, clones )
                    ].map( (child, index) => { return (
                        <div
                            className="relative flex w-full h-full [flex:0_0_100%]"
                            ref={ el => ( refs.current[index] = el ) }
                            data-index={ index }
                            data-ref={ child.ref }
                            key={`element-type-item-${index}`}
                            >
                            { cloneElement( child, child.props ) }
                        </div> )})
                    }
                </div>
            </div>

            {Next && <div onClick={()=>{
                if(state.isAnimating.get()) return;
                handleNext()
            }}>
                <Next />
            </div>}

            {Prev && <div onClick={()=>{
                if(state.isAnimating.get()) return;
                handlePrev()
            }}>
                <Prev />
            </div>}

            {Nav  && <Nav items={items} goto={goto}/> }
            </div>
        </div>
    );
}

function createMasterTimeline( items, container, defaults ) {
    const timeline = gsap.timeline( defaults ?? { defaults: { duration: 1, ease: "power2.inOut" }, paused: true } );
    items.forEach( ( item, index ) => {
        timeline.add( [`step:${index}`, gsap.to( container, { x: -1 * item.offsetLeft } )], ">"  )
    })
    return timeline;
}

  function runTimeline( container, fromParams, toParams, vars ) {
    const iFrom = fromParams.index;
    const iTo = toParams.index;
    const animFrom = fromParams.animation || { x: 0, opacity: 0 };
    const animTo = toParams.animation || { x: -1920, opacity: 1 };

    const tl = gsap.timeline();
    tl.fromTo( container, { ...animFrom }, { ...animTo, ...vars } );
  }
  function transition( timeline, ifrom, to, vars ) {

        if( !timeline ) { return };
        if( state.onTransition.get() ) { return };
        if( !to ) { return };
        const from = ifrom || state.index.get();

        const fromLabel = `step:${from}`;
        const toLabel = `step:${to}`;
        state.onTransition.set( true )

        timeline.tweenFromTo( fromLabel, toLabel, {
            ...vars,
            onStart: onStart,
            onComplete: onComplete,
        } ).then( () => { console.log("then") } );

        state.index.set( to );

        function onComplete() {
            state.onTransition.set( false );
            console.log( "completed")
        }
        function onStart() {
            state.onTransition.set( true );
            console.log( "started ")
        }
        function onUpdate() {
            console.log( "progress ", Math.round(timeline.progress()*100), "of ", timeline.duration() )
        }
    }

    const Navigation = ( { children } ) => {
        console.log( children )
        return (
            <></>
        )
    }