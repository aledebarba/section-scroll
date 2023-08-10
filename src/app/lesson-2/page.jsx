"use client"
import { useEffect, useRef } from 'react';
import { SliderMarquee } from "../../components/slider-marquee";

export default function Page() {
    const items = [
        "JPEG/slide-0.jpg",
        "JPEG/slide-1.jpg",
        "JPEG/slide-2.jpg",
        "JPEG/slide-3.jpg",
        "JPEG/slide-4.jpg",
        "JPEG/slide-5.jpg",
        "JPEG/slide-6.jpg",
        "JPEG/slide-7.jpg",
        "JPEG/slide-8.jpg",
        "JPEG/slide-9.jpg",
        "JPEG/slide-10.jpg",
    ]

    return <SliderMarquee items={items} />
}
// export default function Page() {
//     const wrapper = useRef(null);
//     const loggerRef = useRef(null);

//     function scrollObj(){
//         const scroll = {
//             speed: 0,
//             decay: 0.92,
//             axis: "x",
//         }
//         return { ...scroll }
//     }
//     const scroll = new scrollObj();

//     function itemObj() {
//         const item = {
//             elementsPerScreen: 1,
//             width: 0,
//             height: 0,
//             content: null,
//         }
//         return { ...item }
//     }
//     const item = new itemObj();

//     function wheelObj() {
//         const wheel = {
//             useX: 1,
//             useY: 1,
//             xFactor: 0.5,
//             yFactor: 1,
//             xDirection: -1,
//             yDirection: -1,
//         }
//         return {
//             ...wheel,
//             muteX: () => {
//                 wheel.useX = 0;
//             },
//             muteY: () => {
//                 wheel.useY = 0;
//             },
//             listenToX: () => {
//                 wheel.useX = 1;
//             },
//             listenToY: () => {
//                 wheel.useY = 1;
//             }
//     }}
//     const wheel = new wheelObj();

//     function marqueeObject() {

//         const marquee = {
//             direction: 1,
//             start: 0,
//             current: 0,
//             target: 0.001,
//             acceleration: 0.00001,
//             paused: false,
//             onPause: () => {},
//             onResume: () => {},
//         }

//         return {
//             ...marquee,
//             init: ( start, target, acceleration, direction, onPause, onResume ) => {
//                 marquee.start = start || 0;
//                 marquee.target = target || 0.001;
//                 marquee.acceleration = acceleration || 0.00001;
//                 marquee.direction = direction || 1;
//                 marquee.onPause = onPause || (() => {});
//                 marquee.onResume = onResume || (() => {});
//             },
//             reset: () => {
//                 marquee.current = marquee.start;
//             },
//             speed: () => {
//                 if ( marquee.current < marquee.target ) {
//                     marquee.current += marquee.acceleration;
//                 }
//                 return marquee.paused ? 0 : marquee.current * marquee.direction;
//             },
//             pause: ( time ) => {
//                 marquee.paused = true;
//                 if( time ) {
//                     setTimeout( () => {
//                         marquee.resume();
//                     }, time );
//                 }
//                 marquee.onPause();
//             },
//             resume: () => {
//                 marquee.paused = false;
//                 marquee.onResume();
//             },
//             direction: ( value )=> { marquee.direction = value },
//     }};
//     const marquee = new marqueeObject();

//     function sliderObj() {

//         const slider = {
//             ui: {
//                 Next: <div className="slider-default-ui-next" onClick={ ()=>slider.next() }>Next</div>,
//                 Prev: <div className="slider-default-ui-prev" onClick={ ()=>slider.prev() }>Prev</div>,
//             },
//             current: 0,
//             startItem: 0,
//             autoplay: false,
//             autoplayDelay: 5000,
//             autoplayDirection: 1,
//             autoplayTimer: null,
//             items: [],
//         }

//         function next() {
//             slider.current = ( slider.current + 1 ) % slider.items.length;
//             slider.onSlideChange();
//             slider.autoplayResume();
//         }

//         function prev() {
//             slider.current = ( slider.current - 1 + slider.items.length ) % slider.items.length;
//             slider.onSlideChange();
//             slider.autoplayResume();
//         }

//         return {
//             ...slider,
//             init: function ( { items, startItem, autoplay, autoplayDelay, autoplayDirection, onSlideChange } ) {
//                 slider.startItem = startItem || 0;
//                 slider.autoplay = autoplay || false;
//                 slider.autoplayDelay = autoplayDelay || 5000;
//                 slider.autoplayDirection = autoplayDirection || 1;
//                 slider.onSlideChange = onSlideChange || (() => { });
//                 slider.items = items;
//             },
//             autoplayPause: () => {
//                 if ( slider.autoplayTimer ) {
//                     clearTimeout( slider.autoplayTimer );
//                 }
//             },
//             autoplayResume: () => {
//                 slider.autoplayTimer = setTimeout( () => {
//                     slider.next();
//                 }, slider.autoplayDelay );
//             },
//             autoplayStart: () => {
//                 slider.autoplay = true;
//                 slider.autoplayResume();
//             },
//             autoplayStop: () => {
//                 slider.autoplay = false;
//                 slider.autoplayPause();
//             },
//     }}
//     const slider = new sliderObj();

//     const easing = {
//         linear: (t) => t,
//         easeInQuad: (t) => t*t,
//         easeOutQuad: (t) => t*(2-t),
//         easeInOutQuad: (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
//         easeInCubic: (t) => t*t*t,
//         easeOutCubic: (t) => (--t)*t*t+1,
//         easeInOutCubic: (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
//     }

//     useEffect(() => {

//         let speed = 0;
//         let position = 0;
//         let items = document.querySelectorAll('.scroll-item');
//         let obj = Array(items.length).fill({dist:0});
//         let wrapperWidth = item.width * obj.length - 1;

//         const stageItems = () => {
//             item.width = window.innerWidth;
//             item.height = window.innerHeight;
//             items = document.querySelectorAll('.scroll-item');
//             let obj = Array(items.length).fill({dist:0});
//             wrapperWidth = item.width * obj.length - 1;
//             let elPos;

//             obj.forEach((o,i) => {
//                 o.dist = Math.min( Math.abs( position - i ), 1);
//                 o.dist = 1 - o.dist ** 2;
//                 elPos = calcPos( item.width, i , position )
//                 items[i].style.width = `${item.width}px`;
//                 items[i].style.height = `${item.height}px`;
//                 items[i].style.left = `${elPos}px`;
//             })
//             wrapper.current.style.width = `${wrapperWidth}px`;
//             wrapper.current.style.height = `${item.height}px`;
//         }

//         // mousewheel event
//         const eventWheelId = window.addEventListener('wheel', (e) => {
//             let delta = (e.deltaY * wheel.useY * wheel.yFactor ) + (e.deltaX * wheel.useX * wheel.xFactor * wheel.xDirection )
//             speed +=  Math.abs( ( delta ) / 1000 ) < 0.05
//                         ? delta * 0.002
//                         : delta * 0.00015;
//             marquee.direction(Math.sign( -delta ));
//             marquee.reset();
//         })

//         const eventResizeId = window.addEventListener('resize', (e) => {
//             stageItems();
//         })

//         function calcPos( elWidth, i, position ) {
//             let pos = ( elWidth * i ) + ( (position % obj.length) * elWidth );
//             let newPos = ( ( pos + wrapperWidth + elWidth ) % wrapperWidth - elWidth );
//             return newPos;
//         }

//         function raf() {
//             position += speed - marquee.speed();
//             speed *= scroll.decay;
//             let elPos;
//             items.forEach((o,i) => {
//                 o.dist = Math.min( Math.abs( position - i ), 1);
//                 o.dist = 1 - o.dist ** 2;
//                 elPos = calcPos( item.width, i , position )
//                 logger([
//                     { label: "elPos", value: elPos },
//                     { label: "position", value: position },
//                     { label: "speed", value: speed },
//                     { label: "mspeed", value: marquee.speed() },
//                     { label: "mdirection", value: marquee.direction },
//                 ], loggerRef )
//                 items[i].style.left = `${elPos}px`;
//             })
//             window.requestAnimationFrame(raf);
//         }

//         stageItems();
//         slider.init( { items, startItem:0, autoplay:true, autoplayDelay:5000, autoplayDirection:1, onSlideChange: () => {} } );
//         raf();

//         return () => {
//             window.removeEventListener("wheel", eventWheelId);
//             window.removeEventListener("resize", eventResizeId);
//         }

//     },[]);

//     return <>
//         <div id="main-container"
//             className="relative w-screen h-screen overflow-hidden bg-zinc-100"
//             >
//             <div className="absolute left-0 -translate-y-1/2 top-1/2 "
//             ref = { wrapper }
//             >
//                 {[...Array(10).keys()].map((i) => {
//                     return <div key={i}
//                                 className="absolute scroll-item"
//                                 style={{
//                                         left: i * item.width,
//                                         width: item.width,
//                                         height: item.height,
//                                         top: "50%",
//                                         transform:"translateY(-50%)",
//                                         zIndex: 1000-i,
//                                 }}
//                                 >
//                                 <div className="absolute inset-0 overflow-hidden rounded-md"
//                                     style={ {
//                                         left: 0,
//                                         backgroundImage: `url(JPEG/slide-${i+1}.jpg)`,
//                                         backgroundSize: `cover`,
//                                         backgroundPosition: `center`,
//                                         backgroundRepeat: `no-repeat`,

//                                     }} />
//                             </div>
//                 })}
//             </div>
//             <div className="fixed grid w-1/2 h-20 p-2 text-black rounded-lg top-5 left-5 bg-zinc-400/80">
//                 <div ref={ loggerRef } ></div>
//             </div>

//         </div>
//     </>
// }
// function logger( info, ref ) {
//     const divmap = info.map((data, i) => `<div style="overflow: hidden; height: 2rem; border: 1px solid red; padding: 2px; rem; " key="info-logger-${i}">${data.label}:${data.value}</div>`).join('')
//     ref.current.innerHTML = `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 2px; grid-template-rows: 2.2rem 2.2rem; place-content: center;">${divmap}</div>`
// }
