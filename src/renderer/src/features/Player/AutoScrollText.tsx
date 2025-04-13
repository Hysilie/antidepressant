import { FC, useEffect, useRef, useState } from 'react'

type AutoScrollTextProps = {
  children: string
}

const AutoScrollText: FC<AutoScrollTextProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current

    if (container && text) {
      const delta = text.scrollWidth - container.offsetWidth
      if (delta > 0) {
        setShouldScroll(true)
        setScrollDistance(delta)
      } else {
        setShouldScroll(false)
        setScrollDistance(0)
      }
    }
  }, [children])

  const animationStyle = shouldScroll
    ? {
        animation: `scroll-delta 20s ease-in-out infinite`
      }
    : {}

  return (
    <div>
      <style>
        {shouldScroll &&
          `
          @keyframes scroll-delta {
            0%, 10% {
              transform: translateX(0);
            }
            45%, 55% {
              transform: translateX(-${scrollDistance + 16}px);
            }
            90%, 100% {
              transform: translateX(0);
            }
          }
        `}
      </style>

      <div ref={containerRef} className="relative h-6 overflow-hidden font-title whitespace-nowrap">
        <div ref={textRef} className="absolute" style={animationStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AutoScrollText
