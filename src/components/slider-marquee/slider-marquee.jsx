"use client"
import { useEffect, useRef } from 'react';
import { scrollObj } from './scrollObj';
import { itemObj } from './itemObj';
import { wheelObj } from './wheelObj';
import { marqueeObject } from './marqueeObject';
import { sliderObj } from './sliderObj';
import { useGesture } from '@use-gesture/react';

export function SliderMarquee( { items, showLogger=false } ) {

    const mainRef = useRef(null);
    const wrapper = useRef(null);
    const loggerRef = useRef(null);
    const scroll = new scrollObj();
    const item   = new itemObj();
    const wheel  = new wheelObj();
    const marquee = new marqueeObject();
    const slider  = new sliderObj();


    let speed = 0;
    let position = 0;

    let obj = Array(items.length).fill({dist:0});
    let wrapperWidth = item.width * obj.length - 1;

    const bind = useGesture({
        onDrag: (state) => onDragEvent(state),
    })

    function onDragEvent( state ) {
        if ( state.dragging ) {
            let mult = scroll.dragMultiply.find(( screen, i )=> screen.width <= window.innerWidth ).by;
            speed += state.delta[0] * (mult || 0.00025);
            marquee.direction(Math.sign( -state.delta[0] ));
            marquee.reset();
        }
    }

    useEffect(() => {

        let items = document.querySelectorAll('.scroll-item');
        slider.init( { items, startItem:0, autoplay:true, autoplayDelay:5000, autoplayDirection:1, onSlideChange: () => {} } );
        stageItems();
        raf();

        function raf() {
            position += speed - marquee.speed();
            speed *= scroll.decay;
            items.forEach((_,i) => {
                items[i].style.left = `${calcPos( item.width, i , position )}px`;
                if( showLogger ) {
                    logger([
                        { label: "position", value: position },
                        { label: "speed", value: speed },
                        { label: "mspeed", value: marquee.speed() },
                        { label: "mdirection", value: marquee.direction },
                    ], loggerRef )
                }

            })

            window.requestAnimationFrame(raf);
        }

        function stageItems() {
            mainRef.current.style.height = `${window.innerHeight}px`;
            mainRef.current.style.width = `${window.innerWidth}px`;
            item.width = window.innerWidth / item.perScreen ;
            item.height = window.innerHeight;
            items = document.querySelectorAll('.scroll-item');
            wrapperWidth = item.width * items.length - 1;
            items.forEach((o,i) => {
                items[i].style.width = `${item.width}px`;
                items[i].style.height = `${item.height}px`;
                items[i].style.left = `${calcPos( item.width, i, position )}px`;
            })
            wrapper.current.style.width = `${wrapperWidth}px`;
            wrapper.current.style.height = `${item.height}px`;
        }

        function calcPos( elWidth, i, position ) {
            let pos = ( elWidth * i ) + ( (position % obj.length) * elWidth );
            let newPos = ( ( pos + wrapperWidth + elWidth ) % wrapperWidth - elWidth );
            return newPos;
        }

       /* events listeners */

        const eventWheelId = window.addEventListener('wheel', (e) => {
            let delta = (e.deltaY * wheel.useY * wheel.yFactor ) + (e.deltaX * wheel.useX * wheel.xFactor * wheel.xDirection )
            speed +=  Math.abs( ( delta ) / 1000 ) < 0.05
                        ? delta * 0.002
                        : delta * 0.00015;
            marquee.direction(Math.sign( -delta ));
            marquee.reset();
        })

        const eventResizeId = window.addEventListener('resize', (e) => {
            stageItems();
        })

        return () => {
            // unmount
            window.removeEventListener("wheel", eventWheelId);
            window.removeEventListener("resize", eventResizeId);
        }

    },[]);

    return <>
        <div id="main-container"
            className="relative w-screen overflow-hidden"
            ref={ mainRef }
            style={{ height: window.innerHeight }}
            >
            <div
                className="absolute left-0 -translate-y-1/2 top-1/2"
                ref = { wrapper }
                style={{touchAction:"none"}}
                {...bind()}
            >
            { items.map(( scrollItem, i) =>
                <div key={i}
                    className="absolute scroll-item"
                    style={{
                            left: i * item.width,
                            width: item.width,
                            height: item.height,
                            top: "50%",
                            transform:"translateY(-50%)",
                            zIndex: 1000-i,
                    }}
                    >
                    <div className="absolute inset-0 overflow-hidden transition-all duration-500 rounded-md hover:scale-105"
                        style={ {
                            left: 0,
                            backgroundImage: `url(${scrollItem})`,
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `no-repeat`,
                        }}
                    />
                </div> )}
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

