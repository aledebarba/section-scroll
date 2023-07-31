"use client";
import { Icon } from '@iconify/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef } from "react";
import { state } from "./state";


const Slide = ( { item, slideRef, titleRef, introRef, contentRef, iconRef } ) => (
    <>
        <div className="absolute inset-0 bg-black bg-center bg-cover rounded-lg place-content-center gap-y-6"
             style={{ backgroundImage: `url(${item.image})` }}
             ref={slideRef}
             data-id="slide-container"

            >
           <div data-id="slide-content"
                className="absolute inset-0 flex flex-col items-center justify-end p-2 mb-32 md:justify-center md:mb-0"
                >
                <p ref={ titleRef }
                    className="w-10/12 mx-auto text-[clamp(32px,calc(6vw+1rem),80px)] text-center text-white h-fit md:text-8xl lg:text-9xl"
                    >
                    {item.title}
                </p>
                <div  ref={ contentRef }
                    className="flex flex-col w-[clamp(300px,65vw,960px)] p-8 rounded-lg text-md bg-neutral-900/30 backdrop-blur-md"
                >
                <p ref={ introRef }
                    className="pb-2 font-bold text-white border-b-2 md:visible border-b-white border-b-solid"
                    >
                    {item.text.intro}
                </p>

                <p ref={ contentRef }
                    className="hidden pt-2 text-white md:block"
                    >
                    {item.text.content}
                </p>
            </div>
            <div ref={ iconRef }>
                <Icon
                    icon={item.icon}
                    className="grid w-24 h-24 p-4 text-4xl text-white rounded-full bg-black/40 place-content-center"
                />
            </div>
        </div>
        </div>
        </>
)

export const SlideTest = ( { item } ) => {
    return (
            <div className="absolute inset-0 grid bg-black bg-center bg-cover rounded-lg place-content-center gap-y-6"
             style={{ backgroundImage: `url(${item.image})` }}
             data-id="slide-container"
            >
              <div data-id="slide-content" data-title>
                { item.title }
              </div>
            </div>
    )}

export const SlideDefault = ( { item, index }  ) => {

    const
        slideRef = useRef(null),
        titleRef = useRef(null),
        introRef = useRef(null),
        contentRef = useRef(null),
        contentRef1 = useRef(null),
        iconRef = useRef(null)

        state.onStart.onChange( (v) => {

            let { onStart } = state.onStart.get();
            console.log( v.value[ state.index.get() ] , index+1 )
            console.log( state.onStart.get()[index+1 ] )
            const compare = state.onStart.get()[index+1] == state.index.get();
            if ( compare ) {
                handleOnStart();
            }
        })


    function handleOnStart() {
            if( slideRef.current ) {

                const tl=gsap.timeline()
                    .to( contentRef1.current, { opacity: 1, duration: 1, ease: "power2.out" }, -1 )
                    .from( titleRef.current, { delay: 0.5, duration: 0.5, y: -150, opacity: 0, ease: "power2.out" }, 0 )
                    .from( contentRef.current, { duration: 0.5, y: 150, opacity: 0, ease: "power2.out" }, ">" )
                    .from( iconRef.current, { duration: 1, scale: 0, opacity: 0, ease: "bounce.out" }, 1.5 )
            }
        }


    return <>
            <div className="absolute inset-0 bg-black bg-center bg-cover rounded-lg place-content-center gap-y-6"
             style={{ backgroundImage: `url(${item.image})` }}
             ref={ slideRef }
             data-id="slide-container"
            >
           <div data-id="slide-content"
                ref={ contentRef1 }
                className="absolute inset-0 flex flex-col items-center justify-end p-2 mb-32 opacity-0 md:justify-center md:mb-0"
                >
                <p ref={ titleRef }
                    data-title
                    className="w-10/12 mx-auto text-[clamp(32px,calc(6vw+1rem),80px)] text-center text-white h-fit md:text-8xl lg:text-9xl"
                    >
                    {item.title}
                </p>
                <div  ref={ contentRef }
                    className="flex flex-col w-[clamp(300px,65vw,960px)] p-8 rounded-lg text-md bg-neutral-900/30 backdrop-blur-md"
                >
                <p ref={ introRef }
                    className="pb-2 font-bold text-white border-b-2 md:visible border-b-white border-b-solid"
                    >
                    {item.text.intro}
                </p>

                <p ref={ contentRef }
                    className="hidden pt-2 text-white md:block"
                    >
                    {item.text.content}
                </p>
            </div>
            <div ref={ iconRef }>
                <Icon
                    icon={item.icon}
                    className="grid w-24 h-24 p-4 text-4xl text-white rounded-full bg-black/40 place-content-center"
                />
            </div>
        </div>
        </div>
    </>
}

export const SlideHero = ( { item, activeItem, imagepos, props } ) => {
    return <>
    </>
}

export const SlideColumns = ( { item, activeItem, props } ) => {
    return <>
    </>
}

export const SlideMega = ( { item, activeItem, props } ) => {
    return <>
    </>
}

export const SlidesAnimations = () => {
    return <style>
            {/*css*/`
              .inFromRight {
                    position: relative;
                    animation: 0.5s ease-in-out 1s in-from-right forwards;
                    opacity: 0;
                    transform: translateX(0);
                }
                .inFromLeft {
                    position: relative;
                    animation: 0.5s ease-in-out 1s in-from-left forwards;
                    opacity: 0;
                    transform: translateX(0);
                }
                .inFromTop {
                    position: relative;
                    animation: 0.5s ease-in-out 1s in-from-top forwards;
                    opacity: 0;
                    transform: translateY(0);
                }
                .inFromBottom {
                    position: relative;
                    animation: 0.5s ease-in-out 1s in-from-bottom forwards;
                    opacity: 0;
                    transform: translateY(0);
                }
               .fadeOut{
                    animation: fade-out 0.5s ease-in-out forwards;
                }
                .flickUp{
                    animation: 0.3s flick-up 1.5s ease-in-out 1 forwards;
                }
                .zoomBounceIn {
                    position: relative;
                    transform: scale(0);
                    animation-delay: 0.5s;
                    animation-duration: 1.5s;
                    animation-fill-mode: forwards;
                    animation-iteration-count: 1;
                    animation-name: zoom-bounce-in;
                    animation-timing-function: linear(0, 0.9, 1.4, 1.1, 0.9, 0.92, 1, 1.037, 1, 0.98, 1, 1.006, 1.002, 0.998, 0.9988, 1 100% 100%);
                }

                @keyframes in-from-right {
                    0% { transform: translateX(25%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes in-from-left {
                    0% { transform: translateX(-25%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes in-from-top {
                    0% {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes in-from-bottom {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes title-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes fade-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes flick-up {
                    0% { transform: translateY(10%); }
                    100% { transform: translateY(0); }
                }
                @keyframes zoom-bounce-in {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }
            `}
        </style>
}