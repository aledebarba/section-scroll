"use-client"
import { useLayoutEffect, useRef, Children, cloneElement  } from "react";
import { observe  } from "@legendapp/state";
import { Memo, useObserve  } from "@legendapp/state/react";
import { SlideDefault } from "./slideslayouts";
import { useGesture } from '@use-gesture/react'
import { gsap } from 'gsap';
import { slider } from "./sliderstate";

export const Carousel = ({
    items=[],
    autoplay = true, interval = 5000, increment = 1000, tick = 1000, clones = 1, startItem,
    loop = true, pauseOnHover = false,
    Next = <></>,
    Prev = <></>,
    Nav  = <></>,
    Goto = <></>,
    Layout = SlideDefault,
    children,
    ...otherprops }) => {

    const carouselContainerRef = useRef(null)
    const refs = useRef([]);
    const mountItems = useRef( [
        ...items.slice( -clones ),
        ...items,
        ...items.slice( 0, clones )
    ]);

    const navitems = items.map( (item, index) => ({ ...item, goTo:()=>{ slider.goTo( index ) } } ) )

    useLayoutEffect(() => {

        if ( !carouselContainerRef.current ) return;

        // const getSnaps = () => {
        //     const DOMitems = carouselContainerRef.current.querySelectorAll("[data-carousel-item]")
        //     const itemsArray = Array.from( DOMitems )
        //     return itemsArray.length ? itemsArray.map( (item, index) => {
        //         const { top, right, bottom, left, width, height, x, y } = item.getBoundingClientRect();
        //         return({
        //             index,
        //             offsetLeft: item.offsetLeft,
        //             offsetwidth: item.offsetWidth,
        //             top: top,
        //             bottom: bottom,
        //             left: left,
        //             right: right,
        //             width: width,
        //             height: height,
        //             x: x,
        //             y: y
        //         })
        //     }) : []
        // }


        //slider.items.snaps.set( getSnaps() );

        const itemsCoords = refs.current.map( el => ( {
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
        }))
        slider.init( { ref:carouselContainerRef, items, increment, tick, interval, autoplay, clones, loop, pauseOnHover, startItem, Next, Prev, Layout, Nav, Goto } )
        slider.items.snaps.set( itemsCoords.slice( clones, itemsCoords.length-clones ) );

        carouselContainerRef.current.classList.remove( "opacity-0" );
        if ( autoplay && !slider.timer.running ) slider.timer.start();

        // event listeners
        const handleResizeWindow = window.addEventListener( "resize", () => {
            slider.items.snaps.set( getSnaps() );
            slider.jumpTo( 0 );
        });

        const handleKeypress = window.addEventListener( "keydown", (e) => {
            if( e.key === "ArrowRight" ) {
                slider.next("keyboard");
            } else if( e.key === "ArrowLeft" ) {
                slider.prev("keyboard");
            }
        });

        observe( slider, ( state ) => { console.log( state.value ) } )


        return () => {
            window.removeEventListener( "resize", handleResizeWindow );
            window.removeEventListener( "keydown", handleKeypress );
            slider.timer.kill();
        }
    }, [] );



    return (
        <div className="relative isolate" >
            <div
                onMouseEnter={() => { if (pauseOnHover) slider.timer.pause() }}
                onMouseLeave={() => { if (pauseOnHover) slider.timer.resume() }}
                {...otherprops}
            >
                <div className="relative w-full h-full overflow-hidden">
                    <div ref={ carouselContainerRef } className="relative flex w-auto h-full overflow-visible opacity-0 flex-nowrap" >
                        {/* { mountItems.current.map( (item, index) =>
                            <div key={`item-key-${index}`}
                                data-carousel-item={index}
                                className="relative flex w-full h-full [flex:0_0_100%]"
                                ref={ el => (refs.current[index] = el ) }
                                >
                                <Layout
                                    item={item}
                                    items={items}
                                    autoplay={autoplay}
                                    interval={interval}
                                    increment={increment}
                                    pauseOnHover={pauseOnHover}
                                    tick={tick}
                                    loop={loop}
                                    Next={Next}
                                    Prev={Prev}
                                    Nav={Nav}
                                    Layout={Layout}
                                    onEnter={ () => { console.log( "on enter")  }}
                                    onLeave={ () => { console.log( "on leave")  }}
                                    onIdle={  () =>  { console.log( "on idle")  }}
                                />
                            </div> )} */}
                            {[
                                    ...Children.toArray( children ).slice( -clones ),
                                    ...Children.toArray( children ),
                                    ...Children.toArray( children ).slice( 0, clones )
                            ].map( (child, index) => { return (
                                <div
                                    className="relative flex w-full h-full [flex:0_0_100%]"
                                    ref={ el => ( refs.current[index] = el ) }
                                    data-index={ index - clones }
                                    data-ref={ child.ref }
                                    key={`element-type-item-${index}`}
                                    >
                                    { cloneElement( child, child.props ) }
                                </div> )})
                            }
                    </div>
                </div>

                {Next && <div onClick={ ()=>{ slider.next() }}><Next /></div>}
                {Prev && <div onClick={()=>{ slider.prev() } }><Prev /></div>}
                {Nav && <Nav items={ navitems }/> }
            </div>
        </div>
    );
}

export const CarouselItem = ({ children, ...otherprops }) => {
    return (
        <div {...otherprops} >
            {children}
        </div>
    );
}
