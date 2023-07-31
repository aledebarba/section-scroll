"use client"
import Header from '../components/SectionsContent/Header';
import { Icon } from '@iconify/react';
import { useCounter } from "../components/usecounter";
import { getItemsFromAPI } from "../components/SectionsContent/getItemsFromAPI";
import { FullScreenScroll, Section, Link } from "../components/fullscreen-scroll";
import { SlideDefault as Slide } from "../components/carousel";
import { Scroller, state } from "../components/carousel";
//import { slideTest } from '../components/carousel/slideslayouts';




export default function Home() {

  const k1 = useCounter({
    from: 0,
    to: 5,
    interval: 1000
  });
  const k2 = useCounter();

   return (
    <FullScreenScroll className="w-screen overflow-x-hidden" >

      <Section className="relative grid w-screen h-screen place-content-center">
        <Header />
      </Section>

      <Section className="relative grid w-screen h-screen bg-stone-900 place-conten-center shadow-[inset_0vw_0vw_150px_-10px_#0004]">
          <Scroller
            className="absolute w-screen h-screen md:w-[85vw] md:h-[85vh] md:rounded-3xl overflow-hidden transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 shadow-2xl shadow-black/50"
            autoplay={true} interval={6000} loop={true} pauseOnHover={false} items={ getItemsFromAPI() }
            Next={()=><button className="absolute z-10 text-4xl text-white transform md:-translate-y-1/2 lg:text-5xl top-[90vh] md:top-1/2 right-2 md:right-8 hover:text-amber-500">
                        <Icon icon="typcn:chevron-right" />
                      </button>}
            Prev={()=><button className="absolute z-10 text-4xl text-white transform md:-translate-y-1/2 lg:text-5xl top-[90vh] md:top-1/2 left-2 md:left-8 hover:text-amber-500">
                        <Icon icon="typcn:chevron-left" />
                      </button>}
            Nav={( { items, goto } )=>{
              return(
              <div className="absolute z-10 flex h-20 gap-2 -translate-x-1/2 bottom-2 left-1/2">
                  { items.map( ( item, index ) =>
                  <div key={`dot-navigation-item-${index}`}
                    data-active={index===state.index.get()}
                    className="grid flex-grow-0 flex-shrink-0 w-6 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-pink-200 place-content-center data-[active]:bg-sky-800"
                    onClick={()=>{ goto(index+1) }}
                  >
                    {index+1}
                  </div>)}
              </div> )}}
          >

              { getItemsFromAPI().map( (item, index) => { return(
                  <Slide
                      key={`item-key-${index}`}
                      item={item}
                      onStart={ function( ref ) {
                        const animation = gsap.context( ()=>{
                          const tl = gsap.timeline();
                          tl.fromTo( "[data-title]", { opacity: 0}, {opacity: 1, delay: 0.5, duration: 0.5 } )
                        }, ref )
                      }}
                      onComplete={ () => { console.log("on complete from slide default") }}
                      onLeave={  () =>  { console.log( "on leave form slide default")  }}
                      transition = { { animateInParams: { }, onGoto:{} } }
                      index= {index}
                  /> )})}
          </Scroller>
      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 bg-blue-700 place-content-center"
        snapconfig={{
          duration: 1.5,
          ease: "circ.*",
          Next: ()=><span className="absolute grid w-auto h-8 px-10 py-5 transform -translate-x-1/2 border border-white rounded-lg cursor-pointer left-1/2 place-content-center bottom-24 md:bottom-16 hover:bg-black">NEXT</span>,
          Prev: ()=><span className="absolute grid w-auto h-8 px-10 py-5 transform -translate-x-1/2 border border-white rounded-lg cursor-pointer left-1/2 place-content-center top-10 hover:bg-black">PREV</span>
        }}

        >
        <h1 className="font-serif text-4xl text-white lg:text-6xl">Nav components (Next / Prev)</h1>
        <div className="flex flex-row justify-between w-full mt-8 md:w-10/12">
          <p className="flex-shrink-0 w-1/2 px-8 py-4 text-left text-white rounded-md bg-black/20">
            options: {"{"}<br/>...<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;Next: ()=&gt;&lt;span&gt;Next&lt;/span&gt;,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;Prev: ()=&gt;&lt;span&gt;Prev&lt;/span&gt;<br/>
            {"}"}
          </p>
          <p className="flex-shrink-0 w-1/2 px-8 py-4 text-left text-white">If the section define it's own navigation components, they take place instead of global nav components.</p>
        </div>
        <Configuration>
          <Info title="Duration" value="1.5" />
          <Info title="Ease" value="circ.*" />
          <Info title="Pause/Wait" value="default" />
          <Info title="Next / Prev" value="optional components" />
        </Configuration>

      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{
          duration: 1,
          ease: "bounce.out",
          target: "section3"
        }}
        >

        <h1 className="text-black text-8xl">Section 3</h1>

        <Link
          to="section-indigo"
          className="grid px-4 py-2 mt-5 rounded-full cursor-pointer place-content-center hover:bg-indigo-500">
            Click here to scroll down straight to section indigo
        </Link>

        <Configuration>
          <Info title="Duration" value="2.5" />
          <Info title="Ease" value="expo.inOut" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>

      </Section>

      <Section
        className="relative grid w-screen h-screen p-10 place-content-center bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ duration: 1, ease: "power2.inOut" }}
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
          Next: ()=>{ return <>
            { k2.ended &&
                <h1 className="absolute grid w-48 h-48 p-5 m-auto mt-8 text-6xl font-bold text-center text-white transform -translate-x-1/2 bg-green-500 rounded-full cursor-pointer left-1/2 bottom-32 place-content-center">
                  GO
                </h1> }
            </> }
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
        className="relative grid w-screen h-screen bg-indigo-500 place-content-center"
        snapconfig={{
          target: "section-indigo",
        }}
        >
        <div className="flex flex-col items-center justify-center px-10 py-5 border-4 border-yellow-500 border-dashed rounded-lg">
          <p className="mx-auto text-2xl text-center text-black">WELLCOME TO SECTION</p>
          <p className="mx-auto text-4xl font-bold text-center text-indigo-900 drop-shadow-md shadow-black lg:text-8xl" >INDIGO</p>
        </div>
        <Link
          to="section3"
          ease="power4.inOut"
          duration={0.3}
          className="grid px-4 py-2 mt-5 border border-yellow-500 border-solid rounded-full cursor-pointer place-content-center hover:bg-yellow-500 hover:text-black"

          >
            <span className="text-center">Click here to scroll down straight to Section 3</span>
        </Link>

        <Configuration>
          <Info title="Duration" value="deafult" />
          <Info title="Ease" value="default" />
          <Info title="Pause/Wait" value="default" />
        </Configuration>
      </Section>

      <Section
        className="relative grid w-screen h-screen bg-pink-300 place-content-center"
        snapconfig={{}}
        >
        <h1 className="text-2xl text-black">End</h1>
        <Link
            className="absolute grid px-8 py-4 text-black transition-all duration-300 transform -translate-x-1/2 rounded-lg cursor-pointer place-content-center bottom-16 left-1/2 hover:bg-black/80 hover:text-white"
            to="top"
            duration={0.2} // per screen duration
            ease={"power4.inOut"}
            >
          <IconToTop className="relative mx-auto transition-transform duration-300 transform hover:-translate-y-2"/>
          <div>Scroll To Top</div>
        </Link>
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

function IconToTop(props) {
  return (
    <svg
      width={76}
      height={50}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity={0.3}>
        <path
          d="M18.98 16.036L37.964 1.702 39 4.052 18.98 18.997v-2.96z"
          fill="url(#prefix__paint0_linear_111_29)"
        />
        <path
          d="M37.94 1.702l18.984 14.334v3.25L37.94 4.834v-3.13z"
          fill="#737373"
        />
      </g>
      <g opacity={0.6}>
        <path
          d="M15.176 22.846l22.78-17.2 1.245 2.82-24.025 17.932v-3.552z"
          fill="url(#prefix__paint1_linear_111_29)"
        />
        <path
          d="M37.928 5.645l22.78 17.201v3.901L37.929 9.402V5.645z"
          fill="#737373"
        />
      </g>
      <g opacity={0.85}>
        <path
          d="M7.568 33.188l30.374-22.935 1.66 3.76-32.034 23.91v-4.735z"
          fill="url(#prefix__paint2_linear_111_29)"
        />
        <path
          d="M37.904 10.253l30.374 22.935v5.2L37.904 15.262v-5.009z"
          fill="#737373"
        />
      </g>
      <path
        d="M3.764 42.447l34.17-25.802 1.868 4.231L3.764 47.775v-5.328z"
        fill="url(#prefix__paint3_linear_111_29)"
      />
      <path
        d="M37.892 16.645l34.17 25.802v5.85L37.893 22.28v-5.635z"
        fill="#737373"
      />
      <defs>
        <linearGradient
          id="prefix__paint0_linear_111_29"
          x1={19.207}
          y1={16.751}
          x2={33.062}
          y2={0.519}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#848484" />
          <stop offset={1} stopColor="#B7B7B7" />
        </linearGradient>
        <linearGradient
          id="prefix__paint1_linear_111_29"
          x1={15.448}
          y1={23.704}
          x2={32.075}
          y2={4.225}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#848484" />
          <stop offset={1} stopColor="#B7B7B7" />
        </linearGradient>
        <linearGradient
          id="prefix__paint2_linear_111_29"
          x1={7.931}
          y1={34.331}
          x2={30.099}
          y2={8.359}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#848484" />
          <stop offset={1} stopColor="#B7B7B7" />
        </linearGradient>
        <linearGradient
          id="prefix__paint3_linear_111_29"
          x1={4.172}
          y1={43.733}
          x2={29.112}
          y2={14.515}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#848484" />
          <stop offset={1} stopColor="#B7B7B7" />
        </linearGradient>
      </defs>
    </svg>
  );
}


