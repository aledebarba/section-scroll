"use client";
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function Page() {

    const mainRef = useRef(null)
    const slider = useRef(null)
    useEffect(() => {
        if( !mainRef.current ) return;
        slider.current = new ScrollLayer( mainRef.current, 1, 1 );
    }, [])

    const theData = [
        {title: "Introduction", color: "green" } ,
        {title: "Problem", color: "blue" } ,
        {title: "Propoasal", color: "red" } ,
        {title: "Methodology", color: "cyan" } ,
        {title: "Results", color: "yellow" } ,
        {title: "Conclusion", color: "purple" }
    ]
    const handleItems = () => {
        return ScrollLayer.addClones( theData, 1 );
    }

    return (

    <div className="relative w-screen h-screen overflow-hidden" ref={mainRef} data-id="container">
        <div data-layer="scroller" className="relative flex flex-row flex-nowrap">
            {handleItems().map( ( {title, color}, index) => { return(
            <div key={`item--${index}`} className="relative [flex:0_0_100%] w-screen h-screen items-center justify-center" data-item="begin">
                <div className={`relative flex flex-col items-center justify-center w-[90%] h-[90%] left-[5%] top[5%] [filter:brightness(20%)`}
                    style={{ backgroundColor: color }}
                >
                    <h1 className="mb-20 text-6xl text-white">{title}</h1>
                    <div className="mx-[10%] flex-col gap-4 flex">
                        <p className="text-2xl text-center text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        <ul>
                            <li className="text-lg text-white ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</li>
                            <li className="text-lg text-white ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</li>
                            <li className="text-lg text-white ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</li>
                        </ul>
                    </div>
                </div>
            </div>)})}


        </div>

        <div data-ui="next"
            className="absolute -translate-y-1/2 top-1/2 right-10"
            >
            <Icon icon="wpf:next" className="text-4xl text-yellow-200 cursor-pointer hover:text-sky-400" />
        </div>
        <div data-ui="prev"
            className="absolute rotate-180 -translate-y-1/2 top-1/2 left-10"
            >
            <Icon icon="wpf:next" className="text-4xl text-yellow-200 cursor-pointer hover:text-sky-400" />
        </div>

        <div  className="items-center justify-center w-10/12 flex flex-row bg-pink-900 left-1/2 h-[96px] -translate-x-1/2 gap-4 mx-auto absolute bottom-10 z-30 border-4 border-red-300>">
        { theData.map( ( e,i )=>{return(
                <button
                    key={i}
                    className="w-[42px] h-[42px] grid place-content-center border-2 border-pink-300"
                    onClick={()=>{ slider.current.goto( i ) }}
                    >
                    { i }
                    </button>
        )})}
        </div>

    </div>

    )
}

class ScrollLayer {
      constructor( container, display, duration, startItem ) {

        const ctx = gsap.context( () => {
            this.items = gsap.utils.toArray( "[data-item]" );
            this.layers = gsap.utils.toArray( "[data-layer]" );
            this.uiNext = gsap.utils.toArray( "[data-ui=next]" )[0];
            this.uiPrev = gsap.utils.toArray( "[data-ui=prev]" )[0];
            this.layer = 0;
            this.index = 0;
            this.display = display || 1;
            this.duration = duration || 0.5;
            this.container = container;
            this.index = startItem || this.display;
            this.inc = 1 / this.display;

            this.itemsCoords = this.items.map( (el) => ({
                y:el.getBoundingClientRect().y,
                x:el.getBoundingClientRect().x,
                w:el.getBoundingClientRect().width,
                h:el.getBoundingClientRect().height,
                width: el.offsetWidth,
                height: el.offsetHeight,
                top: el.offsetTop,
                left: el.offsetLeft,
                duration: el.getAttribute("data-duration") || this.duration,
                ease: el.getAttribute("data-ease") || "power2.inOut"
            }) )

            this.createTimeline();

            this.uiNext.addEventListener( "click", () => {
                this.next();
            })

            this.uiPrev.addEventListener( "click", () => {
                this.prev();
            })

            this.timeline.tweenTo(`item-1`, { duration: 0 } );
            this.index = 1

        }, container );
    }

/**
 * Creates a timeline using the items coordinates
 * @function
 * @name createTimeline
 * @returns {void}
 */
    createTimeline() {
        const items = this.itemsCoords;
        const layer = this.layers[this.layer];
        const timeline = gsap.timeline( { defaults: { duration: this.duration, ease: this.ease }, paused: true } );

        function newTween( tox ){
            var tl = gsap.timeline();
                    tl.to( layer, { x: -tox }, {} ,">"  );
                    return tl;
        }

        items.forEach( ( item, index ) => {
            const tl = newTween( `item-${index}`, item.x, item.duration );
            timeline.add( [ `item-${index}`, tl, ">" ] )
        })

        this.timeline = timeline;
        timeline.tweenFromTo(0, `item-${this.index}` );
    }

    itemsCoords = [];
    timeline = null;
    items = [];
    layers = [];
    uiNext = null;
    uiPrev = null;
    layer = 0;
    index = 0;
    inc = 1 / this.display;
    inext = () => this.index + 1;
    iprev = () => this.index - 1;
    display = 0;
    duration = 1;
    container = null;
    panning = ()=>(( this.container.scrollWidth / this.display ) * this.duration);
    ease = "power2.inOut";
    group = [];
    #clones = this.display;
    max = ()=>this.items.length - this.#clones;
    min = ()=>this.#clones;


    next() {
        const nextLabel = `item-${this.inext()}`;
        const currentLabel = `item-${this.index}`;
        const minLabel = `item-${this.min()}`;
        const maxLabel = `item-${this.max()}`;
        console.log( nextLabel, currentLabel, minLabel, maxLabel)

        console.log( this.inext(), this.max() )
        if( this.inext() >= this.max() ) {
            this.timeline.tweenFromTo( currentLabel, maxLabel ).then( () => {
                setInterval( ()=>{ console.log( "checguei" ) }, 1000 )})
        } else {
            console.log("slide")
            this.timeline.tweenFromTo( currentLabel, maxLabel ).then( () => {
                setInterval( ()=>{ console.log( "cheguei" ) }, 500 )})
        }
    }

    prev() {
        const prevLabel = `item-${this.iprev()}`;
        const currentLabel = `item-${this.index}`;
        const minLabel = `item-${this.min()}`;
        const maxLabel = `item-${this.max()}`;

        if( this.iprev() <= this.min() ) {
            this.timeline.seek( maxLabel ).then( () => { this.timeline.tweenFromTo( maxLabel, `item-${this.max()-1}`) } );
            this.index = this.max();
        } else {
            this.timeline.tweenFromTo( currentLabel, prevLabel );
            this.index = this.iprev();
        }
    }

    goto( to ) {
        const currentLabel = `item-${this.index}`;
        const toLabel = `item-${to}`;
        this.timeline.tweenFromTo( currentLabel, toLabel )
        this.index = to;
    }

    static addClones( items, display ) {
        const first = items.slice( 0, display );
        const last = items.slice( -display );
        return [ ...last, ...items, ...first ];
    }
}
