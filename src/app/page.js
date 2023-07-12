"use client"
import FullScreenScroller, { SnapSection } from "@/components/gsap-fullscreen-plugin";

export default function Home() {

  return (
    <FullScreenScroller className="w-screen overflow-x-hidden" >
      <SnapSection className="grid w-screen h-screen bg-slate-400 place-content-center" snapconfig={{}}>
        <h1 className="text-4xl text-black">Start</h1>
      </SnapSection>
      <SnapSection
        className="w-screen h-[150vh] p-10 bg-gradient-to-b from-red-400 to-lime-500"
        snapconfig={{ wait: 2 }}
        >
        <div className="grid h-full place-content-center">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, quibusdam ad et porro vitae dolorum odio illum a quae voluptatem, hic tempore quasi repellat dignissimos itaque illo reiciendis sed minus earum! Et corrupti eum omnis facilis accusantium in praesentium eius nemo veritatis laudantium dolorem, animi, consequatur cum assumenda ut error.</p>
        </div>
      </SnapSection>
      <SnapSection className="grid w-screen h-screen bg-pink-300 place-content-center" snapconfig={{}}>
        <h1 className="text-2xl text-black">End</h1>
      </SnapSection>
    </FullScreenScroller>
  )
}
