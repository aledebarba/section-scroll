"use client"
import FullScreenScroll, { Section } from "@/components/fullscreen-scroll";
import { useRef } from "react";

export default function Home() {

  const el = useRef(new Array());

  const newRef = (e) => {
    el.current.push(e);
  }

  return (
    <FullScreenScroll className="w-screen overflow-x-hidden" >
      <Section className="grid w-screen h-screen bg-slate-400 place-content-center" snapconfig={{ wait: 1, waitOnce: true, ease:"power2.*", duration: 2 }} >
        <h1 className="text-4xl text-black">Start</h1>
      </Section>

      <Section
        className="w-screen h-[100vh] p-10 bg-gradient-to-b from-red-400 to-lime-500"
        >
        <div className="grid h-full place-content-center">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, quibusdam ad et porro vitae dolorum odio illum a quae voluptatem, hic tempore quasi repellat dignissimos itaque illo reiciendis sed minus earum! Et corrupti eum omnis facilis accusantium in praesentium eius nemo veritatis laudantium dolorem, animi, consequatur cum assumenda ut error.</p>
        </div>
      </Section>

      <Section
        className="grid w-screen h-screen bg-pink-300 place-content-center" snapconfig={{}}>
        <h1 className="text-2xl text-black">End</h1>
      </Section>
    </FullScreenScroll>
  )
}
