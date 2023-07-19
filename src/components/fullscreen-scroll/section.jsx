import React from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";


export const Section = ( props ) => {

    const [ observerRef, entry ] = useIntersectionObserver({
        threshold: 0.85,
        root: null,
        rootMargin: "0px",
    });

    const { children, snapconfig={}, ...otherProps } = props;

    const handleNext = (e) => {
        window.dispatchEvent( new KeyboardEvent("keydown", {key:"ArrowDown"}) );
    }

    const handlePrev = () => {
        window.dispatchEvent( new KeyboardEvent("keydown", {key:"ArrowUp"}) );
    }

    return (
            <section
                ref={ observerRef }
                data-visibility={ entry?.isIntersecting ? "visible" : "hidden" }
                snapconfig={ snapconfig }
                {...otherProps}
                style={{ ...props.style, position: "relative" }}
            >
                { props.children }
                { snapconfig?.Next && <div  onClick={ handleNext }><snapconfig.Next /></div> }
                { snapconfig?.Prev && <div  onClick={ handlePrev }><snapconfig.Prev /></div> }
            </section>
    )
}