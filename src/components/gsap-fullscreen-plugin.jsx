"use client"
import { useGesture } from '@use-gesture/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from "gsap";
import { ScrollToPlugin } from 'gsap/all';
gsap.registerPlugin(ScrollToPlugin);

export default function FullScreenScroller({ children, options={}, className="", otherProps }) {

    const scrollAttempts = useRef(0);
    const currentPage = useRef(0);

    const cPage = useCallback( ( page ) => {
        if( page === undefined ) return currentPage.current;
        currentPage.current = page;
        console.log(  "current page: ", currentPage.current );
    }, [currentPage] );


    const isScrolling = useRef(false);
    const mainRef = useRef(null);

    const childRef = useRef( new Array() );

    const markers = options.markers || false;
    const [ markerInfo, setMarketInfo ] = useState( "" );

    useGesture({
        onWheel: (state) => {
            console.log( state.direction, state.down )
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
            const scrollOptions = children.map( ( child ) => child.props.snapconfig || {} );
            const targets = gsap.utils.toArray( "*[snapconfig]" )
            const maxPage = targets.length - 1;

            const nextPage =  cPage() + direction >= maxPage
                ? maxPage
                :  cPage() + direction < 0
                    ? 0
                    :  cPage() + direction;
            const wait = scrollOptions[ nextPage ]?.wait || 0.2;


            if ( targets[ nextPage ] === undefined ) return;
            if ( nextPage ===  cPage() ) return;

            const duration = direction === 1 ? scrollOptions[ cPage()]?.duration || 0.25 : scrollOptions[nextPage]?.duration || 0.25;
            const ease = direction === 1 ? scrollOptions[  cPage() ]?.ease || "power0" : scrollOptions[ nextPage ]?.ease || "power0";
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
                    cPage( nextPage );
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
