"use client"
import FullScreenScroll, { Section } from "@/components/fullscreen-scroll";
import React, { useRef, useEffect } from "react";
import Countdown, { CoundownApi } from 'react-countdown';
import { useIntersectionObserver } from "@uidotdev/usehooks";


export default function Home() {

  const [ observerRef, entry ] = useIntersectionObserver({
    threshold: 0.85,
    root: null,
    rootMargin: "0px",
  });

  const countdownRef = useRef(null);
  const [ timer, setTimer ] = React.useState( null );


  return (
    <FullScreenScroll className="w-screen overflow-x-hidden" >
      <Section className="relative grid w-screen h-screen bg-slate-400 place-content-center">
        <h1 className="text-4xl text-black">Start Page</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 1, ease: "circ.*" }}
        >
        <h1 className="text-black text-8xl">Page 2wo</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 2.5, ease: "expo.inOut" }}
        >
        <h1 className="text-black text-8xl">Page 3thee</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 1, ease: "bounce.out" }}
        >
        <h1 className="text-black text-8xl">BOUNCE</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen bg-gradient-to-b from-red-400 to-lime-500 place-content-center"
        snapconfig={{
          duration: 2,
          ease: "back.inOut(1.7)",
          wait: 10,
          onEnter:()=>{
              countdownRef.current.api.start( Date.now() + 10000 );
            },
          onComplete:()=>{ console.log( "transition complete" )},
          onLeave: ()=>{ countdownRef.current.api.start() },
        }}

        >

        <h1 className="text-4xl text-black">This section will pause scrolling for 10 seconds</h1>
        <Countdown
          ref={ countdownRef }
          date={ Date.now() + 10000 }
          controlled={false}
          autoStart={false}
          renderer = {
            ({ hours, minutes, seconds, completed }) => {
              if (completed) {
                  return <h2 className="grid p-10 text-4xl place-content-center">Go!</h2>
                } else {
                  return <h2 className="grid p-10 text-4xl place-content-center">{hours}:{minutes}:{seconds}</h2>;
              }
           }
          }
        />

        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen bg-pink-300 place-content-center" snapconfig={{}}>
        <h1 className="text-2xl text-black">End</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

    </FullScreenScroll>
  )
}

const Configuration = ({ children }) => {
  return (
    <div className="absolute top-10 right-10">
      {children}
    </div>
  )
}

const Info = ({ title, value }) => {
  return (
    <div className="flex flex-row flex-no-wrap w-min-[300px] w-max-[560px] w-[30vw]">
      <p className="w-4/12 grid items-center px-1 border-solid border-black border-2 h-[32px] overflow-hidden text-red-800">{title}</p>
      <p className="w-8/12 grid items-center px-1 border-solid border-black border-2 h-[32px] overflow-hidden text-black">{value}</p>
    </div>
  )
}
