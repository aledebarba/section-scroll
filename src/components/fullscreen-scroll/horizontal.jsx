import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/all";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated, easings } from "@react-spring/web";
import { Section } from "./section";

gsap.registerPlugin( ScrollToPlugin );

export const HorizontalScrollContext = React.createContext();

export const HorizontalScroll = ({ className, style, children, options, snapconfig, ...props }) => {

    const hoScrollRef = useRef(null);
    const [ maxX, setMaxX ] = useState();
    const currentSection = useRef(0);
    const hoSections = useRef([]);

    useLayoutEffect( () => {
        setMaxX( hoScrollRef.current.scrollWidth - hoScrollRef.current.getBoundingClientRect().width );
        hoSections.current = Array.from( hoScrollRef.current.querySelectorAll("[data-hosection]") );
    }, [hoScrollRef.current] );

    const [ {x,y,cursor}, api ] = useSpring( () => {
        return ({
            x: 0,
            y: 0,
            cursor: "grab",
            config: {
                tension: 120, friction: 14
            }
        })
    });

    const bindFreeScroll = useDrag( ( { active, movement:[mx], offset: [x,y], cancel } )=> {
        return api.start( { x: x, y:0 } )
    },
    {
        axis: "lock",
        bounds: { left: -1*maxX ,right: 0 },
        eventOptions: { passive: false },
        preventDefault: true,
        threshold: 10,
    });

    const bindSnapScroll = useDrag( ( { active, movement:[mx], offset: [x,y], direction, cancel } )=> {
        if( !active ) {
            const targetPage = currentSection.current + direction[0] *-1
            const nextPage = targetPage < 0 ? 0 : targetPage > hoSections.current.length-1 ? hoSections.current.length-1 : targetPage;
            const nextX = hoSections.current[nextPage].getAttribute("data-position");
            currentSection.current = nextPage;
            return api.start(
                {
                    x: -1*nextX,
                    y:0,
                    cursor: active ? "grabbing" : "grab"
                }
            )
        }
    },
    {
        axis: "x",
        bounds: { left: -1*maxX ,right: 0 },
        eventOptions: { passive: false },
        preventDefault: true,
        threshold: 10,

    });

    return (
        <HorizontalScrollContext.Provider value={ {horizontalScroll: true} }>
        <Section snapconfig={ snapconfig }>
            <div data-id="horizontal-scroll-container"
                className="relative w-screen h-screen overflow-hidden isolate"
                style={{touchAction: "none"}}
                >
                <animated.div
                    { ...bindSnapScroll() }
                    data-id="horizontal-scroll-content"
                    ref={ hoScrollRef }
                    className="absolute top-0 left-0 flex flex-row w-auto h-full bottom-full flex-nowrap"
                    style={{ width: "100%!important", touchAction: "none", x, cursor }}
                    {...props}
                    >
                    { children }
                </animated.div>
            </div>

        </Section>
        </HorizontalScrollContext.Provider>
    )

}

export const HoSection = ({ children, className, ...props }) => {

    const hoSectionRef = useRef(null);
    useLayoutEffect( () => {
        hoSectionRef.current.setAttribute( "data-position", hoSectionRef.current.getBoundingClientRect().left );
    }, [hoSectionRef.current] );

    return (
        <div {...props}
            ref={ hoSectionRef }
            data-hosection={true}
            className={`${className} flex-grow-0 flex-shrink-0 `}
            style={{width: "100vw !important"}}
            >
            { children }
        </div>
    )

}