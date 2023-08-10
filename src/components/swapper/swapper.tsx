"use client"
import React, { useEffect, useState, useRef } from "react";
import { state } from "../carousel/state";
import { linear } from "./easing";

type SwapProps = {
    pcn?: Array<object>; // previous current and next elements
    property?: string; // property to swap
    from: number; // inital value of property
    to: number; // final value of property
    duration?: number;
    onStart?: Function;
    onComplete?: Function;
    onProgress?: Function;
    tick?: number;
    ease?: Function;
    //ease?: "ease-in" | "ease-out" | "ease-in-out" | "linear" | "step-start" | "step-end" | "bounce";
    index?: number;
}

export function swap({pcn, property, from, to, duration, onStart, onComplete, onProgress, tick = 25, ease }:SwapProps):Promise<any> {

    // 1. setup values and defaults
    let swapArray = pcn ? pcn : state.content.get().current.children;
    let status ={ finished: false, canceled: false };
    if( !ease ) ease = linear;
    let k = 0;

    let steps = 1;
    let inc = duration / steps;

    const visibleItems:HTMLElement[] = [...swapArray]
    const itemsContainer:HTMLElement = state.content.get().current;
    const containerRect:DOMRect = itemsContainer.getBoundingClientRect();
    const animationsKeyframes = new Array( Math.round( Math.round( steps )+1 ) ).fill({})
    const lastFrame = animationsKeyframes.length-1;

    // 2. calculate the keyframes for each element
    const animations:any = visibleItems.map( ( animatedElement:any, index: number ) => {
        let moment = 0;
        state.log.set( index === 1 );
        return [...animationsKeyframes.map( ( _:any, frame:number ) => {
            const animationFrom = animatedElement.getBoundingClientRect().left;
            const animationTo = ( index === 0 )
                        ? animatedElement.getBoundingClientRect().left
                        : index === 1
                        ? containerRect.width
                        : index === 2
                        ? 0
                        : 0;
            const sign = animationFrom > animationTo ? 1 : -1;
            const interpolation = ease( parseInt( animationFrom ), parseInt( animationTo ), duration, frame*inc );
            if( interpolation === null ) return ( { visible: "visible" } )
            const round2Decimals = (n:number) => Math.round( n );

            return { transform:`translate3d(${round2Decimals(interpolation) * sign}px,0,0)`}
        }) ]
    })

    // 3. position elements on screen at initial state
    visibleItems.forEach( ( item:HTMLElement, position:number ) => positionVisibleElements({ position, element: item, container: itemsContainer }) );
    console.log(animations)

    // 4. start the animation
    const animate = visibleItems.map( ( animatedElement:any, index: number ) => {
        const animationKeyframes = new KeyframeEffect(
            animatedElement,
            [
                { transform: `translateX(-${window.innerWidth}px)` },
            ],
            {
                duration: duration,
            }
        )
        return new Animation(animationKeyframes, document.timeline);
    })

    animate.forEach( ( animation:Animation ) => {
        animation.play()
    });


    // 5. return a promise that resolves when the animation is complete
    return new Promise( (resolve, reject) => {
        resolve( status );
    })
}


interface PositionVisibleElementsProps {
    position: number;
    element: HTMLElement;
    container: HTMLElement;
}
/**
 * Position the visible elements on the screen, inside it's container
 * @param position number 0, 1, 2 where 0 is left, 1 is center, 2 is right
 * @param element HTMLElement to position
 * @param container that contains the element
 * @example
 * ```
 * const container = document.querySelector(".container");
 * const element = document.querySelector(".element");
 * positionVisibleElements({ position: 0, element, container });
 * ```
 * @returns void
 */
function positionVisibleElements({ position, element, container }: PositionVisibleElementsProps ):void {

    const viewRect = container.getBoundingClientRect();
    // style the elements according to the positiions
    // 1. style the container
    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.style.width = `${viewRect.width}px`;
    container.style.height = `${viewRect.height}px`;
    container.style.left = `50%`;
    container.style.top = `50%`;
    container.style.transform = `translate(-50%, -50%)`;

    // 2. common styles for all elements
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.bottom = "0";
    element.style.width = `100%`;
    element.style.height = `100%`;
    element.style.overflow = "hidden";

    if (position === 0) { // set initial animation values for each element}
        element.style.left = `${-viewRect.width}px`;
        return;
    } else if (position === 1) {
        element.style.left = `${0}px`;
        return;
    } else if (position === 2) {
        element.style.left = `${viewRect.width}px`;
        return;
    }
}


