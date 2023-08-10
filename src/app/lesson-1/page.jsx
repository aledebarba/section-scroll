"use client"
import { useEffect, useRef } from 'react';

export default function Page() {
    const redBox1 = useRef(null);
    const wrapper = useRef(null);
    const elWidth = 320;
    const elHeight = 240;

    useEffect(() => {
        let speed = 0;
        let position = 0;
        let rounded = 0;
        let obj = Array(10).fill({dist:0});
        const elems = document.querySelectorAll('.marquer');

        const eventWheelId = window.addEventListener('wheel', (e) => {
            speed += e.deltaY * 0.0003;
        })

        function raf() {
            position += speed;
            speed *= 0.8;
            obj.forEach((o,i) => {
                o.dist = Math.min( Math.abs( position - i ),1);
                o.dist = 1 - o.dist ** 2;
                elems[i].style.transform = `scale(${ 1 + 0.8 * o.dist })`;

            })

            rounded = Math.round( position ) ;
            let diff = ( rounded - position )
            position += Math.sign( diff ) * Math.pow( Math.abs( diff ), 0.7 ) * 0.015;
            wrapper.current.style.transform = `translateY(${ -position * elHeight + elHeight/2 }px )`;
            window.requestAnimationFrame(raf);
        }

        raf();

        return () => {
            window.removeEventListener("wheel", eventWheelId);
        }

    },[]);
    return <>
        <div id="main-container"
            className="relative w-screen h-screen overflow-hidden bg-zinc-100"
            >
            <div ref={ redBox1 }
                 className="absolute top-0 left-0 w-[100px] h-[100px] bg-transparent "
                >
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen bg-transparent"
                ref = { wrapper }
            >
                {[...Array(10).keys()].map((i) => {
                    return <div key={i} className="absolute left-0 marquer" style={{top: i * elHeight * 1.1, height: elHeight}}>
                        <div className="absolute top-0 overflow-hidden rounded-md left-4"
                            style={{
                                width: elWidth,
                                height: elHeight * 0.8,
                                backgroundImage: `url(JPEG/slide-${i+1}.jpg)`,
                                backgroundSize: `cover`,
                                backgroundPosition: `center`,
                                backgroundRepeat: `no-repeat`,
                                zIndex: 1000-i
                            }}
                        />
                    </div>
                })}
            </div>
        </div>
    </>
}