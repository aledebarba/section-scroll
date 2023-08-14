"use client"
import { SliderMarquee, SlideItem } from "../../components/slider-marquee";

export default function Page() {
    const items = [
        "JPEG/slide-0.jpg",
        "JPEG/slide-1.jpg",
        "JPEG/slide-2.jpg",
        "JPEG/slide-3.jpg",
        "JPEG/slide-4.jpg",
        "JPEG/slide-5.jpg",
        "JPEG/slide-6.jpg",
        "JPEG/slide-7.jpg",
        "JPEG/slide-8.jpg",
        "JPEG/slide-9.jpg",
        "JPEG/slide-10.jpg",
    ]

    return(
    <SliderMarquee slider showLogger={true}>
        {items.map((item, i) => (
            <SlideItem key={i} className="grid scroll-item place-content-center">
                <img src={item} className="absolute inset-0 z-0 object-cover w-full h-full" />
                <h1 className="z-10 grid w-32 h-32 p-8 bg-black rounded-full text-8xl place-content-center">{i}</h1>
            </SlideItem>
        ))}
    </SliderMarquee>)
}