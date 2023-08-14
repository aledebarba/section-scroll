"use client"
import { useEffect, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { scrollObj } from './scrollObj';
import { itemObj } from './itemObj';
import { wheelObj } from './wheelObj';
import { marqueeObject } from './marqueeObject';
import { SliderObj } from './sliderObj';
import { AnimationFrame } from './animationFrame';

export function SliderMarquee( { showLogger=false, slider:displaySliders, children, ...props } ) {

    const mainRef = useRef(null);
    const wrapper = useRef(null);
    const loggerRef = useRef(null);
    const scroll = new scrollObj();
    const item   = new itemObj();
    const wheel  = new wheelObj();
    const marquee = new marqueeObject();
    const slider  = new SliderObj();

    let speed = 0;
    let position = 0;
    let items;
    let obj = Array(children.length).fill({dist:0});
    let wrapperWidth = item.width * obj.length - 1;

    // handles gestures
    const gesturesSharedConfig = {}
    const gesturesConfig = {
        ...gesturesSharedConfig,
        drag: {
            target: wrapper,
            preventDefault: true,
        }
    }
    const bind = useGesture(
        { onDrag: (state) => onDragEvent(state) },
        gesturesConfig,
    )
    function onDragEvent( state ) {
        if ( state.dragging ) {
            let mult = scroll.dragMultiply.find(( screen, i )=> screen.width <= window.innerWidth ).by;
            speed += state.delta[0] * (mult || 0.00025);
            marquee.direction(Math.sign( -state.delta[0] ));
            marquee.reset();
        }
    }

    useEffect(() => {

        let eventWheelId = null;
        let eventResizeId = null;
        let startTime, endTime, duration;

        if( window !== undefined ) {
            items = wrapper.current.querySelectorAll('.slider-marquee-item');

            if( displaySliders && !slider.started ) {
                slider.init( {
                    items:items,
                    autoplay:true,
                    autoplayDelay: 5000,
                    onStart:( from, to )=>{
                        startTime = Date.now();
                    },
                    onSlideChange: ( from, to )=>{
                        //console.log(`on start from ${from} to ${to} timestamp = ${Date.now()}`)
                        endTime = Date.now();
                        duration = endTime - startTime;
                        logger( [{label:"duration", value:duration}], loggerRef );
                        startTime = Date.now();
                    }

                });
            }
            stageItems();

            let animations = new AnimationFrame( 60, runAnimations )
            animations.start();

            function runAnimations( delta ) {
                if( displaySliders ) {
                    position = slider.updatePosition( position );
                    speed = 0;
                } else {
                    position += speed - marquee.speed();
                    speed *= scroll.decay;
                }

                items.forEach((_,i) => {
                    items[i].style.left = `${calcPos( item.width, i , position )}px`;
                    // if( showLogger ) {
                    //     logger([
                    //         { label: "position", value: position },
                    //         { label: "speed", value: speed },
                    //         { label: "mspeed", value: marquee.speed() },
                    //         { label: "mdirection", value: marquee.direction },
                    //     ], loggerRef )
                    // }

                })
               // window.requestAnimationFrame(raf);
            }

            function stageItems() {
                mainRef.current.style.height = `${window.innerHeight}px`;
                mainRef.current.style.width = `${window.innerWidth}px`;
                item.width = window.innerWidth / item.perScreen ;
                item.height = window.innerHeight;
                wrapperWidth = item.width * items.length - 1;
                items.forEach((o,i) => {
                    items[i].style.width = `${item.width}px`;
                    items[i].style.height = `${item.height}px`;
                    items[i].style.left = `${calcPos( item.width, i, position )}px`;
                })
                wrapper.current.style.width = `${wrapperWidth}px`;
                wrapper.current.style.height = `${item.height}px`;
                marquee.reset();
            }

            function calcPos( elWidth, i, position ) {
                let pos = ( elWidth * i ) + ( (position % obj.length) * elWidth );
                let newPos = ( ( pos + wrapperWidth + elWidth ) % wrapperWidth - elWidth );
                return newPos;
            }

        /* events listeners */

            eventWheelId = window.addEventListener('wheel', (e) => {
                let delta = (e.deltaY * wheel.useY * wheel.yFactor ) + (e.deltaX * wheel.useX * wheel.xFactor * wheel.xDirection )
                speed +=  Math.abs( ( delta ) / 1000 ) < 0.05
                        ? delta * 0.002
                        : delta * 0.00015;
                marquee.direction(Math.sign( -delta ));
                marquee.reset();
            })

            eventResizeId = window.addEventListener('resize', (e) => {
                stageItems();
            })

        }

        return () => {
            eventWheelId  &&  window.removeEventListener("wheel", eventWheelId );
            eventResizeId &&  window.removeEventListener("resize", eventResizeId );
        }

    },[]);

    return <>
        <div id="main-container"
            className="relative w-screen overflow-hidden"
            ref={ mainRef }
            >
            <div
                className="absolute left-0 -translate-y-1/2 top-1/2"
                ref = { wrapper }
                style={{touchAction:"none"}}
                {...bind()}
                >
                { children }
            </div>

           { showLogger &&
            <div className="fixed grid w-1/2 h-20 p-2 text-black rounded-lg top-5 left-5 bg-zinc-400/80">
                <div ref={ loggerRef } ></div>
            </div> }
        </div>
    </>
}

function logger( info, ref ) {
    const divmap = info.map((data, i) => `<div style="overflow: hidden; height: 2rem; border: 1px solid red; padding: 2px; rem; " key="info-logger-${i}">${data.label}:${data.value}</div>`).join('')
    ref.current.innerHTML = `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 2px; grid-template-rows: 2.2rem 2.2rem; place-content: center;">${divmap}</div>`
}

export function SlideItem( { children, className="", ...props } ) {
    return <div className={`absolute slider-marquee-item z-1000 ${className}`} {...props} >{children}</div>
}