"use-client"
import { useSpringCarousel } from "react-spring-carousel";
import { useEffect, useState, useRef } from "react";
import { SlidesAnimations, SlideMega, SlideColumns, SlideHero, SlideDefault } from "./slideslayouts";

export const Carousel = ( {autoplay=true, interval=5000, loop=true, carouselItems=[], pauseOnHover=false, Next=false, Prev=false, controller=false, items, ...props } ) => {

    const [ activeItem, setActiveItem ] = useState( { id: "", index: 0 } );
    const {
        carouselFragment,
        slideToNextItem,
        slideToPrevItem,
        slideToItem,
        getCurrentActiveItem,
        useListenToCustomEvent
    } = useSpringCarousel({
        withLoop: loop,
        items: items.map( item => ( {
            ...item,
            renderItem: item?.layout === "mega"
                            ? <SlideMega item={item} activeItem={activeItem} />
                            : item.layout === "columns"
                            ? <SlideColumns item={item} activeItem={activeItem} />
                            : item.layout === "hero-left"
                            ? <SlideHero item={item} activeItem={activeItem} imagepos={"left"}/>
                            : item.layout === "hero-right"
                            ? <SlideHero item={item} activeItem={activeItem} imagepos={"right"}/>
                        : <SlideDefault item={item} activeItem={activeItem} />
            }
         ))
    });
    useEffect(() => {
        if( !items.length ) return;
        console.log( items )
        slideToItem( items[0].id );
        setActiveItem( getCurrentActiveItem() );
    }, []);

    const pause = useRef(false);
    const timeCounter = useRef({
        interval: 0,
        reset:  ()=>{timeCounter.current.interval=0},
        pause:  ()=>{ pause.current = true },
        resume: ()=>{ pause.current = false }
    });

    useListenToCustomEvent((event) => {
        // Triggered during drag gestures
        if (event.eventName === "onDrag") {
            // Do something...
        }
        // Triggered when the slide is about to slide
        else if (event.eventName === "onSlideStartChange") {
            setActiveItem( getCurrentActiveItem() );
            console.log( getCurrentActiveItem() )
            // Do something...
        }
        // Triggered when the slide animation is completed
        else if (event.eventName === "onSlideChange") {
            timeCounter.current.reset();
        }
        // Triggered on fullscreen change
        else if (event.eventName === "onFullscreenChange") {
        }
    });

    useEffect(() => {
        if( !autoplay ) return;

        const timer = setInterval(() => {
            if( pause.current ) return;
            if( timeCounter.current.interval > interval ) {
                slideToNextItem();
                timeCounter.current.interval = 0;
            }
            timeCounter.current.interval += 1000;
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, [slideToNextItem]);
    return (
        <div className="relative isolate">
            <SlidesAnimations />
            <div
                {...props}
                onMouseEnter={() => { if (pauseOnHover) timeCounter.current.pause() }}
                onMouseLeave={() => { if (pauseOnHover) timeCounter.current.resume() }}
            >
                {Next && <div onClick={slideToNextItem}><Next /></div>}
                {carouselFragment}
                {Prev && <div onClick={slideToPrevItem}><Prev /></div>}

                {controller &&
                <div className={controller.className}>
                    {items.map((item, index) => {
                        return <div onClick={() => { slideToItem(item.id) }} key={index}>
                            <controller.Render item={{ ...item,
                                isActive: item.id == activeItem.id,
                                index: index
                                }}
                            />
                        </div>
                    })}
                </div>}
            </div>
        </div>
    );
}

