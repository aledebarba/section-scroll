"use client"
import { useEffect, useRef } from 'react';
import { SliderMarquee } from "../../components/slider-marquee";

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

    return <SliderMarquee items={items} />
}