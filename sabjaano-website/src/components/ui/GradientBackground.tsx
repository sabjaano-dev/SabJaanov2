'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export function GradientBackground({
  children,
  className = '',
  containerClassName = '',
  interactive = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  interactive?: boolean
}) {
  const interactiveRef = useRef<HTMLDivElement>(null)

  const [curX, setCurX] = useState(0)
  const [curY, setCurY] = useState(0)
  const [tgX, setTgX] = useState(0)
  const [tgY, setTgY] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurX((prev) => prev + (tgX - prev) / 20)
      setCurY((prev) => prev + (tgY - prev) / 20)
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(
          curX
        )}px, ${Math.round(curY)}px)`
      }
    }, 16)
    return () => clearInterval(interval)
  }, [tgX, tgY])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTgX(event.clientX - rect.left)
    setTgY(event.clientY - rect.top)
  }

  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'relative h-[75vh] w-full overflow-hidden bg-[linear-gradient(40deg,#6c00a2,#001152)]',
        containerClassName
      )}
    >
      {/* SVG filter for gooey blur effect */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradient blobs container */}
      <div
        className={cn(
          'absolute inset-0 h-full w-full blur-lg',
          isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(40px)]'
        )}
      >
        {/* Five animated blobs */}
        <div className="absolute bg-[radial-gradient(circle_at_center,_rgba(18,113,255,0.8)_0,_rgba(18,113,255,0)_50%)] mix-blend-hard-light w-[80%] h-[80%] top-[10%] left-[10%] animate-first" />
        <div className="absolute bg-[radial-gradient(circle_at_center,_rgba(221,74,255,0.8)_0,_rgba(221,74,255,0)_50%)] mix-blend-hard-light w-[80%] h-[80%] top-[10%] left-[10%] animate-second" />
        <div className="absolute bg-[radial-gradient(circle_at_center,_rgba(100,220,255,0.8)_0,_rgba(100,220,255,0)_50%)] mix-blend-hard-light w-[80%] h-[80%] top-[10%] left-[10%] animate-third" />
        <div className="absolute bg-[radial-gradient(circle_at_center,_rgba(200,50,50,0.8)_0,_rgba(200,50,50,0)_50%)] mix-blend-hard-light w-[80%] h-[80%] top-[10%] left-[10%] animate-fourth" />
        <div className="absolute bg-[radial-gradient(circle_at_center,_rgba(180,180,50,0.8)_0,_rgba(180,180,50,0)_50%)] mix-blend-hard-light w-[80%] h-[80%] top-[10%] left-[10%] animate-fifth" />

        {/* Pointer interaction effect */}
        {interactive && (
          <div
            ref={interactiveRef}
            className="absolute bg-[radial-gradient(circle_at_center,_rgba(140,100,255,0.8)_0,_rgba(140,100,255,0)_50%)] mix-blend-hard-light w-full h-full -top-1/2 -left-1/2 opacity-70"
          />
        )}
      </div>

      {/* Content inside the gradient background */}
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  )
}
