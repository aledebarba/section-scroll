"use client"
import { useGesture } from '@use-gesture/react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from "gsap";
import { ScrollToPlugin } from 'gsap/all';
gsap.registerPlugin(ScrollToPlugin);

export default function FullScreenScroller({ children, options={}, className="", otherProps }) {


    const scrollAttempts = useRef(0);
    const isScrolling = useRef(false);
    const currentPage = useRef(0);
    const mainRef = useRef(null);
    const markers = options.markers || false;
    const [ markerInfo, setMarketInfo ] = useState( "" );

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
                threshold: 0.2,
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

        let direction = state.direction[1] === 1 ? 1 : -1;
        direction = state.dragging ? direction * -1 : direction;

        if( isScrolling.current ) return false;
        if( scrollAttempts.current > 1 ) return false;

        const ctx = gsap.context((self) => {
            const scrollOptions = children.map( ( child ) => child.props.snapconfig || {} );
            const targets = gsap.utils.toArray( "*[snapconfig]" )
            const maxPage = targets.length - 1;
            const nextPage = currentPage.current + direction >= maxPage
                ? maxPage
                : currentPage.current + direction < 0
                    ? 0
                    : currentPage.current + direction;
            const wait = scrollOptions[ nextPage ]?.wait || 0.2;

            if ( scrollAttempts.current !== 1 ) return;
            if ( targets[ nextPage ] === undefined ) return;
            if ( nextPage === currentPage.current ) return;

            const duration = direction === 1 ? scrollOptions[currentPage.current]?.duration || 0.25 : scrollOptions[nextPage]?.duration || 0.25;
            const ease = direction === 1 ? scrollOptions[ currentPage.current ]?.ease || "power0" : scrollOptions[ nextPage ]?.ease || "power0";
            gsap.to( window, {
                duration: duration,
                scrollTo: targets[ nextPage ].offsetTop,
                ease: ease,
                onCompleteParams: [nextPage, wait],
                onUpdateParams: [nextPage],
                onComplete: onComplete,
                onUpdate: onUpdate,
                overwrite: "auto",
            });
            function onComplete( nextPage, wait ) {
                setTimeout( () => {
                    isScrolling.current = false;
                    currentPage.current = nextPage;
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
        <div className={ className } {...otherProps} ref={ mainRef } style={{ touchAction: "none" }}>
            { children }
        </div>
        </>
    )
}

export function SnapSection({ children, ...otherProps }) {
    return (
        <section
            {...otherProps}
        >
            {children}
        </section>
    )
}
