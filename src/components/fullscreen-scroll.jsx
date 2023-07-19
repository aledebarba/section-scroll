//"use client"
import { gsap, snap } from "gsap";
import { useGesture } from '@use-gesture/react'
import { ScrollToPlugin } from 'gsap/all';
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef } from 'react'

// register gsap plugin if is front-end
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function FullScreenScroll({ children, options={}, className="", otherProps }) {

    const mainRef         = useRef(null);
    const currentPage     = useRef(0);
    const scrollAttempts  = useRef(0);
    const isScrolling     = useRef(false);
    const scrollPosition  = useRef([0,0]);
    const scrollSectionsOptions  = useRef();

    const cPage = useCallback( ( page ) => {
        if( page === undefined ) return currentPage.current;
        currentPage.current = page;
    }, [currentPage] );


    useEffect( () => {

        scrollSectionsOptions.current = children.map( ( child ) => child.props.snapconfig || {} );

        const keyDown = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if( e.key === "ArrowDown" ) {
                console.log( "down" )
                scrollIfPossible({ direction: [0, 1], dragging: false });
                waitScrollEnding()
            }
            if( e.key === "ArrowUp" ) {
                console.log( "up" )
                scrollIfPossible({ direction: [0, -1], dragging: false });
                waitScrollEnding()
            }
        }
        window.addEventListener( "keydown", keyDown );

        const onScroll = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.scrollTo( ...scrollPosition.current );
        }

        window.addEventListener( "scroll", onScroll, { passive: false } );

        const onMouseDown = (e) => {
            e.preventDefault();
        }
        window.addEventListener( "mousedown", onMouseDown, { passive: false } );

        return () => {
            window.removeEventListener( "keydown", keyDown );
            window.removeEventListener( "scroll", onScroll );
            window.removeEventListener( "mousedown", onMouseDown );
        }
    }, [] )

    useGesture({
        onWheel: (state) => {
            scrollIfPossible(state);
        },
        onWheelEnd: (state) => {
            waitScrollEnding(state);
        },
        onDrag: (state) => {
            scrollIfPossible( state  );
        },
        onDragEnd: (state) => {
            waitScrollEnding(state);
        }
    },
        {
            target: mainRef,
            eventOptions: {
                passive: false,
            },
            wheel: {
                preventDefault: true,
                enabled: true,
            },
            drag: {
                preventDefault: true,
                enabled: true,
                threshold: 10,
                axis: "y",
            }
        }
    )

    function waitScrollEnding() {
        const waitUntilScrollStop = setInterval( () => {
            if( !isScrolling.current ) {
                clearInterval(waitUntilScrollStop);
                scrollAttempts.current = 0;
            }
        }, 100 )
    }

    function scrollIfPossible( state ) {
        scrollAttempts.current += 1;
        if ( scrollAttempts.current !== 1 ) return;
        if ( state.direction[1] === 0 && !state.dragging ) {
            scrollAttempts.current = 0;
            return
        };
        let direction = state.direction[1] === 1 ? 1 : -1;
            direction = state.dragging ? direction * -1 : direction;
        if( isScrolling.current ) return false;
        if( scrollAttempts.current > 1 ) return false;

        const ctx = gsap.context((self) => {

            const targets = gsap.utils.toArray( "*[snapconfig]" );
            const visiblePage = targets.findIndex( ( target ) => target.getAttribute("data-visibility") === "visible" );
            cPage( cPage() !== visiblePage ? visiblePage : cPage() );

            const scrollOptions = scrollSectionsOptions.current;
            const maxPage = targets.length - 1;
            const nextPage =  cPage() + direction >= maxPage
                ? maxPage
                :  cPage() + direction < 0
                    ? 0
                    :  cPage() + direction;
            const wait = scrollOptions[ nextPage ]?.wait
                            ?  scrollOptions[ nextPage ]?.once == "done"
                                ? 0.2 //default waiting time;
                                : scrollOptions[ nextPage ]?.wait
                            : 0.2 //default waiting time;

            if ( targets[ nextPage ] === undefined ) return;
            if ( nextPage ===  cPage() ) return;

            const duration  = direction === 1 ? scrollOptions[ cPage()]?.duration || 0.5 : scrollOptions[nextPage]?.duration || 0.5;
            const ease      = direction === 1 ? scrollOptions[ cPage() ]?.ease || "power0" : scrollOptions[ nextPage ]?.ease || "power0";
            const startCallback     = scrollOptions[ nextPage ]?.onEnter || function(){ return null };
            const completeCallback  = scrollOptions[ nextPage ]?.onComplete || function(){ return null };
            const leaveCallback     = scrollOptions[ cPage()  ]?.onLeave || function(){ return null };

            scrollPosition.current = [0 , targets[ nextPage ].offsetTop ];
            // TODO: remove body and html scroll-behaviour smooth

            gsap.to( window, {
                duration: duration,
                scrollTo: targets[ nextPage ].offsetTop,
                ease: ease,
                onCompleteParams: [ nextPage, wait ],
                onUpdateParams: [ nextPage ],
                onStartParams: [ startCallback, leaveCallback ],
                onComplete: onComplete,
                onUpdate: onUpdate,
                onStart: onStart,
                overwrite: "auto",
            });

            function onStart( startCallback, leaveCallback ) {
                if( scrollSectionsOptions.current[ nextPage ]?.once == "done" ) return;
                if( scrollSectionsOptions.current[ nextPage ]?.once == true ) {
                    scrollSectionsOptions.current[ nextPage ].once = "done";
                }
                startCallback();
                leaveCallback();
            }

            function onComplete( nextPage, wait ) {

                setTimeout( () => {
                    isScrolling.current = false;
                    cPage( nextPage );
                    scrollPosition.current = [0 , targets[ nextPage ].offsetTop ];
                    completeCallback();
                    // TODO: restore body and html scroll-behaviour smooth

                }, wait * 1000 )
            }
            function onUpdate( nextPage ) {
                isScrolling.current = true;
            }
            return () => {
                self.kill();
            }
        }, mainRef )
    }

    return (<>
        <div className={ className } {...otherProps} ref={ mainRef } style={{ touchAction: "none" }} >
            { children }
        </div>
        </>
    )
}

export const Section = ( props ) => {

    const [ observerRef, entry ] = useIntersectionObserver({
        threshold: 0.85,
        root: null,
        rootMargin: "0px",
    });
    const { children, snapconfig={}, ...otherProps } = props;

    return (
        <section
            ref={ observerRef }
            data-visibility={ entry?.isIntersecting ? "visible" : "hidden" }
            snapconfig={ snapconfig }
            {...otherProps}
        >
            { props.children }
        </section>
    )
}
