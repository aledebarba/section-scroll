"use client"
import { SlideDefault, state } from '../../components/carousel';
import { getItemsFromAPI } from '@/components/mockup';
import {  Memo } from '@legendapp/state/react';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { slide } from "@/components/pose";
import { Telemetry, logger } from "@/components/utils";
import { swap, ease } from "@/components/swapper";

export default function Page(){
    const scrollerRef = useRef();
    const refs = useRef([]);
    const items = useRef( getItemsFromAPI() );

    return(<div className="relative w-screen h-screen">
        <RecycleScroller items={items.current} display={1} />
    </div>)
}

interface RecycleScrollerProps {
    items?: any[];
    display: number;
    firstItem?: number;
}
const RecycleScroller = ( { items=getItemsFromAPI(), display=1, firstItem=1 }:RecycleScrollerProps ) => {

    const contentRef  = useRef();
    const scrollerRef = useRef();
    const listeningToResize = useRef( false );
    const [ requestRedraw, setRequestRedraw ] = useState( false );

    useEffect( () => {

        if( requestRedraw ) {
            setRequestRedraw( false );
            const element:HTMLElement = scrollerRef.current;
            element.style.setProperty('transform', 'translateZ(0)');
            // this will remove the property 1 frame later
            requestAnimationFrame(() => {
                handleNext( 0, "linear" );
                element.style.removeProperty('transform');
            });
            return;
        }
        const handleResize = () => {
            window.addEventListener( "resize", () => {
                setRequestRedraw( true );
            })
        }
        if( !listeningToResize.current ) {
            handleResize();
            listeningToResize.current = true;
        }
        return () => {
            window.removeEventListener( "resize", handleResize );
        }

    }, [requestRedraw] )

    useEffect( () => {
        state.content.set( contentRef );
    }, [contentRef.current] )


    const handleNext = ( duration:number=1000, easeFn:Function=ease.inOut, useThisIndex?:number ):void => {
        // slide to next item

        let nextIndex = state.next.get();

        if( nextIndex > items.length ) nextIndex = 1;
        let anim = slide.next( contentRef.current, duration )

        // swap({ from: 0, to: 100, duration: 2000, property: "left", ease: easeFn });

             anim.finished.then( () => {
                 state.index.set( useThisIndex || nextIndex );
             });
    }

    const handlePrev = ( duration:number=1000, easeFn:Function=ease.inOut, useThisIndex?:number ):void => {
        // slide to previous item
            let prevIndex = state.prev.get();
            if( prevIndex < 1 ) prevIndex = items.length;
            let anim = slide.prev( contentRef.current )
            anim.finished.then( () => {
                state.index.set( useThisIndex || prevIndex );
            })
        }

    const promiseNext = ( duration:number, easing="ease-in-out", useThisIndex?:number ) => {
        return new Promise( (resolve, reject) => {
            handleNext( duration, easing, useThisIndex || null );
            const timerDuration = setTimeout( () => {
                resolve( true );
                console.log( "useThisIndex", useThisIndex );
            }, duration, [duration, easing]);
        })
    }
    const promisePrev = ( duration:number, easing="ease-in-out", useThisIndex?:number ) => {
        return new Promise( (resolve, reject) => {
            handlePrev( duration, easing, useThisIndex || null );
            const timerDuration = setTimeout( () => {
                resolve( true );
            }, duration, [duration, easing]);
        })
    }

    async function runTo( to:number, duration:number=1000 ) {

        if( to <= 0 || to === undefined || to === null || to === state.index.get() ) return;

        const origin = state.index.peek();
        const diff = Math.abs( to - origin );
        const inc = to > origin ? 1 : -1;

        if( diff === 1 && inc === 1 ) {
            handleNext( duration, "ease-out" );
            return
        } else if ( diff === 1 && inc === -1 ) {
            handlePrev( duration, "ease-in" );
            return
        } else if ( diff >= 2 ) {

            for( let i=0; i<diff; i++ ) {

                let itemEase:string = "linear";
                let itemDuration:number = duration;

                if( i === 0 ) {
                    // it's the first of a minimum of 3 items
                    itemEase = "ease-in";
                    itemDuration = duration * 1.5;
                }
                if( i === diff-1 ) {
                    // it's the last of a minimum of 3 items
                    itemEase = "ease-out";
                    itemDuration = duration * 1.5;
                }
                if( inc === 1 ) {
                    await promiseNext( itemDuration, itemEase, origin+1+i );
                } else {
                     await promisePrev( itemDuration, itemEase, origin-1-i );
                }
            }
            state.index.set( to );
        }


    }

    const handleScroll = ( to:number, duration:number=1000, useThisIndex?:number ) => {
        const origin = state.index.peek();
        const target = to;
        const diff = Math.abs( target - origin );
        const inc = target > origin ? 1 : -1;
        if( diff === 0 ) return;
        if( diff === 2 ) {
            promiseNext( 2000, "ease-in", 2 ).then( function(){
                return new Promise( () => handleNext( 2000, "ease-out" ) );
            })
        } else if ( diff > 2 ) {

            let indexArray = [];
            for( let i=0; i<diff; i++ ) {
                indexArray.push( i );
            }


            let result = indexArray.reduce( (accumulatorPromise, next) => {
                return accumulatorPromise.then(() => {
                    return promiseNext( 300, "linear", next+2 );
                });
            }, Promise.resolve());
        }
    }




    return (
    <div data-scroll-container
        className="relative w-full h-full overflow-hidden"
        ref={ scrollerRef }
        data-redraw={ requestRedraw }
        >

        <Memo>{()=>(
            <section data-scroll-items
                className="absolute flex w-full h-full gap-16 p-8 flex-nowrap"
                ref={ contentRef }
                style={{
                    left: ( scrollerRef.current ? scrollerRef.current.getBoundingClientRect().width * -1 : 0 ),
                }}
                >
                    {/* TODO: transform the VisibleItems to a function that render the content without the virtual DOM */}
                <VisibleItems items={items} index={ state.index.get() }/>
            </section>)}
        </Memo>
        <div data-scroll-contollers
            className="absolute flex items-center justify-between w-full h-24 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        >
            <button
                data-scroll-next
                className="relative grid px-8 py-4 text-white transition-colors translate-x-6 rounded-lg bg-fuchsia-900 place-content-center hover:bg-fuchsia-300 hover:text-black transition-300"
                onClick={ ()=>handlePrev() }
                >
                Prev
            </button>
            <button
                data-scroll-prev
                className="relative grid px-8 py-4 text-white transition-colors -translate-x-6 rounded-lg bg-fuchsia-900 place-content-center hover:bg-fuchsia-300 hover:text-black transition-300"
                onClick={ ()=>handleNext() }
                >
                Next
            </button>
        </div>
        <Memo>{()=>(<div data-scroll-navigation className="absolute flex justify-center w-full h-10 gap-2 align center bottom-16" index={ state.index.get() }>
            { items.map( (item, index) => (
                <button
                    key={index}
                    data-scroll-to={index}
                    className="relative grid px-4 py-2 text-white transition-colors -translate-x-6 rounded-lg place-content-center hover:bg-fuchsia-300 hover:text-black transition-300"
                    onClick={()=>runTo( index+1, 500 ) }
                    style = {{ backgroundColor: index+1 === state.index.get() ? "magenta" : "darkred" }}
                    >
                    {index+1}
                </button>
            ))}
        </div>)}</Memo>
        {/* <Telemetry/> */}
    </div>)
}


const ScrollItem = ( { index, item } ) => {

    if( !item ) return null;
    if( index === null || index === undefined ) return null;

    if( state.cachedItems[index].peek()!== undefined ) {
        return state.cachedItems.peek()[ index ];
    } else {
        const randomHSLColor = `hsl(${Math.random() * 360}, 100%, 15%)`;
        const result = (
                <div className="flex-[0_0_100%] h-full grid place-content-center rounded-2xl
                                bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%
                                bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${item.image})` }}
                    data-swapper-item={index}
                    >
                    <h1 className="text-4xl text-white absolute-center">{item.title}</h1>
                    <h1 className="text-4xl text-white absolute-center"> index { index }</h1>
                </div>)

        state.cachedItems[index].set(result);
        return result;
    }
}

const VisibleItems = ({items, index}) => {
    const itemsRef = useRef( null );

    if( !itemsRef.current ) {
        const temp = getItemsFromAPI();
        itemsRef.current = [...temp.slice(-1), ...temp, ...temp.slice(0,1)];
        state.index.set( 1 );
    }

    return (
    <>
        <ScrollItem index={state.prev.peek() } item={ itemsRef.current[ state.prev.peek() ]} />
        <ScrollItem index={state.index.get() } item={ itemsRef.current[ state.index.peek() ]} />
        <ScrollItem index={state.next.peek() } item={ itemsRef.current[ state.next.peek() ]} />

    </>)
}




