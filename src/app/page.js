"use client"
import FullScreenScroll, { Section } from "@/components/fullscreen-scroll";
import { useRef, useEffect, useState } from "react";
import { useCounter } from "../components/useCounter";

export default function Home() {

  const countFrom = 5;

  const [ t, startTimer ] = useState( false );
  const timer = useRef(countFrom);
  const [ countdown, setCountdown ] = useState();

  const k1 = useCounter({
    from: 0,
    to: 5,
    interval: 1000
  });

  const k2 = useCounter();

  useEffect(() => {
    if( t ) {
      const countdown = setInterval(() => {
        if( timer.current <= 0 ) {
          clearInterval(countdown);
          startTimer(false);
          timer.current = countFrom;
          return;
        }
        timer.current--
        setCountdown(timer.current)
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [t] )

  return (
    <FullScreenScroll className="w-screen overflow-x-hidden" >
      <Section className="relative grid w-screen h-screen bg-slate-400 place-content-center">
        <h1 className="text-4xl text-black">Start Page</h1>
        <Configuration>
          <Info title="Duration" value="default" />
          <Info title="Ease" value="default" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 bg-blue-700 place-content-center"
        snapconfig={{
          duration: 1.5,
          ease: "circ.*",
          Next: ()=><span className="absolute grid w-auto h-8 px-10 py-5 transform -translate-x-1/2 rounded-lg cursor-pointer left-1/2 place-content-center bottom-10 hover:bg-black">NEXT</span>,
          Prev: ()=><span className="absolute grid w-auto h-8 px-10 py-5 transform -translate-x-1/2 rounded-lg cursor-pointer left-1/2 place-content-center top-10 hover:bg-black">PREV</span>
        }}

        >
        <h1 className="font-serif text-4xl text-white lg:text-6xl">Section <span className="text-8xl">2</span></h1>
        <h2 className="text-center text-white">Show next and previous links</h2>
        <Configuration>
          <Info title="Duration" value="1.5" />
          <Info title="Ease" value="circ.*" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 2.5, ease: "expo.inOut" }}
        >
        <h1 className="text-black text-8xl">Section 3</h1>

        <Configuration>
          <Info title="Duration" value="2.5" />
          <Info title="Ease" value="expo.inOut" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 1, ease: "bounce.out" }}
        >
        <h1 className="text-6xl text-black">BOUNCE</h1>
        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="bounce.out" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className={ k2.isCounting
            && "relative grid w-screen h-screen transition-colors duration-500 bg-red-400 place-content-center "
            || "relative grid w-screen h-screen transition-colors duration-500 bg-green-300 place-content-center "
          }

        snapconfig={{
          duration: 1,
          ease: "back.inOut(1.7)",
          wait: 5,
          onEnter: function(){ k2.start(5) },
        }}
        >
        <h1 className="transform -translate-y-20 text-2xl text-center text-black md:text-3xl lg:text-6xl w-10/12 w-max-[640px] m-auto">
          This section will <strong>always</strong> pause scrolling for 5 seconds
        </h1>

        {
          k2.isCounting &&
          <div className="absolute transform -translate-x-1/2 left-1/2 bottom-32">
            <h1 className="font-mono text-2xl text-center text-black md:text-4xl lg:text-8xl">
              00:{ k2.value>10 ? k2.value : "0"+k2.value  }
            </h1>
            <div className="h-5 m-auto bg-pink-300 rounded-full" style={{ width: `${k2.value*8}vw` }}></div>
          </div>
        }
        {
          k2.ended &&
          <h1 className="absolute grid w-48 h-48 p-5 m-auto mt-8 text-6xl font-bold text-center text-white transform -translate-x-1/2 bg-green-500 rounded-full left-1/2 bottom-32 place-content-center">
              GO
          </h1>
        }

        <Configuration>
          <Info title="Duration" value="1" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="5" />
          <Info title="onEnter" value="function(){ startTimer( true ); }" />
        </Configuration>
      </Section>

      <Section
        className={ k1.isCounting
            && "relative grid w-screen h-screen transition-colors duration-500 bg-red-500 place-content-center "
            || "relative grid w-screen h-screen transition-colors duration-500 bg-blue-300 place-content-center "
          }

        snapconfig={{
          duration: 1,
          ease: "back.inOut(1.7)",
          wait: 5,
          once: true,
          onEnter: function(){ k1.start() },
        }}
        >
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            {
              k1.isCounting || !k1.ended
                ? <div className="w-auto max-w-2xl">
                  <h1 className="m-auto text-lg text-center text-black md:text-2xl lg:text-6xl">
                    This section will pause scrolling for 5 seconds
                  </h1>
                  <h1 className="font-mono text-2xl text-center text-black md:text-4xl lg:text-8xl">
                    00:{ k1.value>10 ? k1.value : "0"+k1.value  }
                  </h1>

                </div>
                : k1.ended
                  ? <div className="w-auto max-w-2xl">
                    <h1 className="m-auto text-lg text-center text-black md:text-2xl lg:text-4xl">
                      This section was stopped for 5 seconds at first render, but now it will not stop anymore.
                    </h1>
                  </div>
                  : <></>
            }
          </div>
        <Configuration>
          <Info title="Duration" value="2" />
          <Info title="Ease" value="back.inOut(1.7)" />
          <Info title="Pause/Wait" value="5" />
          <Info title="onEnter" value="function(){ startTimer( true ); }" />
        </Configuration>

      </Section>

      <Section
        className="relative grid w-screen h-screen bg-pink-300 place-content-center" snapconfig={{}}>
        <h1 className="text-2xl text-black">End</h1>
        <Configuration>
          <Info title="Duration" value="deafult" />
          <Info title="Ease" value="default" />
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

