"use client"
import { gsap } from "gsap";
import { useGesture } from '@use-gesture/react'
import { ScrollToPlugin } from 'gsap/all';
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef } from 'react'

// register gsap plugin if is front-end
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function FullScreenScroll({ children, options={}, className="", otherProps }) {

    const mainRef = useRef(null);
    const currentPage = useRef(0);
    const scrollAttempts = useRef(0);
    const isScrolling = useRef(false);
    const scrollPosition = useRef([0,0]);

    const cPage = useCallback( ( page ) => {
        if( page === undefined ) return currentPage.current;
        currentPage.current = page;
    }, [currentPage] );


    useEffect( () => {
        const keyDown = (e) => {
            if( e.key === "ArrowDown" ) {
                scrollIfPossible({ direction: [0, 1] });
            }
            if( e.key === "ArrowUp" ) {
                scrollIfPossible({ direction: [0, -1] });
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

    function waitScrollEnding( state ) {
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
        const targets = gsap.utils.toArray( "*[snapconfig]" );

        const ctx = gsap.context((self) => {
            const visiblePage = targets.findIndex( ( target ) => target.getAttribute("data-visibility") === "visible" );
            cPage( cPage() !== visiblePage ? visiblePage : cPage() );

            const scrollOptions = children.map( ( child ) => child.props.snapconfig || {} );
            const maxPage = targets.length - 1;
            const nextPage =  cPage() + direction >= maxPage
                ? maxPage
                :  cPage() + direction < 0
                    ? 0
                    :  cPage() + direction;
            const wait = scrollOptions[ nextPage ]?.wait || 0.2;
            if ( targets[ nextPage ] === undefined ) return;
            if ( nextPage ===  cPage() ) return;

            const duration = direction === 1 ? scrollOptions[ cPage()]?.duration || 0.5 : scrollOptions[nextPage]?.duration || 0.5;
            const ease = direction === 1 ? scrollOptions[  cPage() ]?.ease || "power0" : scrollOptions[ nextPage ]?.ease || "power0";
            scrollPosition.current = [0 , targets[ nextPage ].offsetTop ];
            // TODO: remove body and html scroll-behaviour smooth
            gsap.to( window, {
                duration: duration,
                scrollTo: targets[ nextPage ].offsetTop,
                ease: "power4.inOut",
                onCompleteParams: [nextPage, wait],
                onUpdateParams: [nextPage],
                onComplete: onComplete,
                onUpdate: onUpdate,
                overwrite: "auto",
            });
            function onComplete( nextPage, wait ) {
                setTimeout( () => {
                    isScrolling.current = false;
                    cPage( nextPage );
                    scrollPosition.current = [0 , targets[ nextPage ].offsetTop ];
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

    useEffect( () => {
        console.log( snapconfig )
    }, [observerRef] )

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
