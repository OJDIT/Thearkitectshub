"use client"

import { useEffect, useState } from "react"

interface HeroImageCarouselProps {
  images: string[]
}

export function HeroImageCarousel({ images }: HeroImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-[2rem] bg-muted sm:h-80 lg:h-96">
        <img
          src="/hero-architecture.jpg"
          alt="Contemporary architectural masterpiece"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-[2rem] bg-muted sm:h-80 lg:h-96">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt="Featured architecture"
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[2200ms] ease-in-out ${
            index === activeIndex ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10" />
    </div>
  )
}
