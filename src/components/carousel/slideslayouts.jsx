"use client";
import { Icon } from '@iconify/react';

export const SlideDefault = ( { item, activeItem, props } ) => {
    const active = item.id === activeItem.id;
    return (<>
        <div className="relative flex flex-col items-center justify-center w-full h-full p-24 transition-all duration-700 bg-black bg-center bg-cover rounded-lg gap-y-6"
        style={{
            transform: active ? "scale(1)" : "scale(0.5)",
            backgroundImage: `url(${item.image})`
        }}>
            <p className={`text-6xl md:text-8xl lg:text-9xl whitespace-nowrap text-white ${active?"inFromTop":"fadeOut"}` }>{item.title}</p>
            <div className={ `flex flex-col w-full p-8 rounded-md text-md bg-neutral-900/30 backdrop-blur-md translate-y-[10%] ${active ? "flickUp" : "" } `}>
                <p className="pb-2 font-bold text-white border-b-2 border-b-white border-b-solid">{item.text.intro}</p>
                <p className="pt-2 text-white">{item.text.content}</p>
            </div>
            <Icon icon={item.icon} className={`grid w-24 h-24 p-4 text-4xl text-white rounded-full bg-black/40 place-content-center ${active ? "zoomBounceIn" : "" }`} />
        </div>
        </>
      )
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