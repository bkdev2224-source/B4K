'use client'

import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TextData {
  label: string
  url: string
  body: Matter.Body | null
  position: { x: number; y: number }
  angle: number
}

interface ShapeData {
  type: 'donut' | 'blob1' | 'blob2' | 'notchedRect' | 'wedge' | 'pebble'
  body: Matter.Body | null
  position: { x: number; y: number }
  angle: number
  size: number
  svgPath: string
  viewBox: string
}

export default function LandingPage() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const textsRef = useRef<TextData[]>([])
  const shapesRef = useRef<ShapeData[]>([])
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [textPositions, setTextPositions] = useState<
    Array<{ x: number; y: number; angle: number }>
  >([])
  const [shapePositions, setShapePositions] = useState<
    Array<{ x: number; y: number; angle: number; type: string; size: number }>
  >([])
  const animationFrameRef = useRef<number | null>(null)
  const touchHandlerRef = useRef<((e: TouchEvent) => void) | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !sceneRef.current) return

    const engine = Matter.Engine.create()
    engine.world.gravity.y = 0.8
    engine.timing.timeScale = 1
    engineRef.current = engine

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        showAngleIndicator: false,
        showVelocity: false,
      },
    })
    Matter.Render.run(render)
    renderRef.current = render

    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 50,
      window.innerWidth,
      100,
      { isStatic: true, render: { fillStyle: 'transparent' } }
    )
    const leftWall = Matter.Bodies.rectangle(
      -50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: 'transparent' } }
    )
    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: 'transparent' } }
    )

    // 커스텀 도형 정의
    const shapeDefinitions: Record<string, { svgPath: string; viewBox: string; size: number }> = {
      donut: {
        svgPath: 'M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 M 50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30 Z',
        viewBox: '0 0 100 100',
        size: 200,
      },
      blob1: {
        svgPath: 'M 20 30 Q 10 20 20 10 Q 30 5 40 10 Q 50 8 60 15 Q 70 20 75 30 Q 80 40 75 50 Q 70 60 60 65 Q 50 70 40 65 Q 30 60 20 50 Q 15 40 20 30 Z',
        viewBox: '0 0 100 100',
        size: 180,
      },
      blob2: {
        svgPath: 'M 30 20 Q 20 15 15 25 Q 10 35 20 45 Q 30 55 45 60 Q 60 65 75 60 Q 85 55 90 45 Q 95 35 85 25 Q 75 15 60 15 Q 45 15 30 20 Z',
        viewBox: '0 0 100 100',
        size: 160,
      },
      notchedRect: {
        svgPath: 'M 10 20 L 80 20 Q 90 20 90 30 L 90 70 Q 90 80 80 80 L 20 80 Q 10 80 10 70 L 10 30 Q 10 20 10 20 Z',
        viewBox: '0 0 100 100',
        size: 200,
      },
      wedge: {
        svgPath: 'M 50 50 L 10 10 Q 5 5 10 0 L 90 0 Q 95 5 90 10 L 50 50 Z',
        viewBox: '0 0 100 100',
        size: 250,
      },
      pebble: {
        svgPath: 'M 30 10 Q 20 5 10 15 Q 5 25 10 35 Q 15 45 25 50 Q 35 55 45 50 Q 55 45 60 35 Q 65 25 60 15 Q 55 5 45 10 Q 35 10 30 10 Z',
        viewBox: '0 0 100 100',
        size: 140,
      },
    }

    const checkCollision = (x: number, y: number, size: number, existingShapes: ShapeData[]): boolean => {
      const minDistance = size + 30
      for (const shape of existingShapes) {
        if (shape.position) {
          const distance = Math.sqrt(
            Math.pow(x - shape.position.x, 2) + Math.pow(y - shape.position.y, 2)
          )
          if (distance < minDistance) {
            return true
          }
        }
      }
      return false
    }

    const createCustomShape = (
      type: keyof typeof shapeDefinitions,
      existingShapes: ShapeData[]
    ): ShapeData | null => {
      const def = shapeDefinitions[type]
      const size = def.size
      const margin = size / 2 + 30
      let attempts = 0
      let x: number, y: number
      
      do {
        x = margin + Math.random() * (window.innerWidth - margin * 2)
        y = -100 - Math.random() * 600
        attempts++
        if (attempts > 50) return null
      } while (checkCollision(x, y, size, existingShapes))
      
      const angle = Math.random() * Math.PI * 2

      const body = Matter.Bodies.circle(x, y, size / 2, {
        restitution: 0.5,
        friction: 0.3,
        density: 0.001,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0,
        },
      })

      return {
        type: type as ShapeData['type'],
        body,
        position: { x, y },
        angle,
        size,
        svgPath: def.svgPath,
        viewBox: def.viewBox,
      }
    }

    // 6개의 도형 생성
    const shapeTypes: Array<keyof typeof shapeDefinitions> = [
      'donut',
      'blob1',
      'blob2',
      'notchedRect',
      'wedge',
      'pebble',
    ]
    
    shapeTypes.forEach((type) => {
      const shape = createCustomShape(type, shapesRef.current)
      if (shape) {
        shapesRef.current.push(shape)
        Matter.World.add(engine.world, [shape.body!])
      }
    })

    // 텍스트 데이터
    const texts: TextData[] = [
      { label: 'KPOP', url: '/contents#kpop', body: null, position: { x: 0, y: 0 }, angle: 0 },
      { label: 'BTS', url: '/contents/BTS', body: null, position: { x: 0, y: 0 }, angle: 0 },
      { label: 'AESPA', url: '/contents/aespa', body: null, position: { x: 0, y: 0 }, angle: 0 },
      { label: 'COEX', url: '/contents/COEX', body: null, position: { x: 0, y: 0 }, angle: 0 },
      { label: 'KBEAUTY', url: '/contents#kbeauty', body: null, position: { x: 0, y: 0 }, angle: 0 },
      { label: 'KDRAMA', url: '/contents#kdrama', body: null, position: { x: 0, y: 0 }, angle: 0 },
    ]

    texts.forEach((text) => {
      const isMobile = window.innerWidth < 768
      const boxWidth = isMobile ? 150 : 200
      const boxHeight = isMobile ? 60 : 80
      const margin = boxWidth / 2 + 20
      const x = margin + Math.random() * (window.innerWidth - margin * 2)
      const y = -200 - Math.random() * 500
      const angle = (Math.random() - 0.5) * 0.8

      const body = Matter.Bodies.rectangle(x, y, boxWidth, boxHeight, {
        restitution: 0.6,
        friction: 0.3,
        density: 0.001,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0,
        },
      })

      text.body = body
      text.position = { x, y }
      text.angle = angle
      textsRef.current.push(text)
      Matter.World.add(engine.world, [body])
    })

    const updatePositions = () => {
      const textPos = textsRef.current.map((text) => {
        if (text.body) {
          return {
            x: text.body.position.x,
            y: text.body.position.y,
            angle: text.body.angle,
          }
        }
        return { ...text.position, angle: text.angle }
      })
      setTextPositions(textPos)

      const shapePos = shapesRef.current.map((shape) => {
        if (shape.body) {
          return {
            x: shape.body.position.x,
            y: shape.body.position.y,
            angle: shape.body.angle,
            type: shape.type,
            size: shape.size,
          }
        }
        return { ...shape.position, angle: shape.angle, type: shape.type, size: shape.size }
      })
      setShapePositions(shapePos)

      animationFrameRef.current = requestAnimationFrame(updatePositions)
    }
    animationFrameRef.current = requestAnimationFrame(updatePositions)

    Matter.World.add(engine.world, [ground, leftWall, rightWall])

    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })
    Matter.World.add(engine.world, mouseConstraint)

    const handleInteraction = (position: { x: number; y: number }) => {
      const bodies = Matter.Query.point(engine.world.bodies, position)
      if (bodies.length > 0) {
        const clickedBody = bodies[0]
        const text = textsRef.current.find((t) => t.body === clickedBody)
        const shape = shapesRef.current.find((s) => s.body === clickedBody)
        if (text && !shape) {
          router.push(text.url)
        }
      }
    }

    Matter.Events.on(mouseConstraint, 'mousedown', () => {
      handleInteraction(mouse.position)
    })

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = render.canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      const scaleX = (render.options.width || window.innerWidth) / rect.width
      const scaleY = (render.options.height || window.innerHeight) / rect.height
      handleInteraction({ x: x * scaleX, y: y * scaleY })
    }
    touchHandlerRef.current = handleTouchStart
    render.canvas.addEventListener('touchstart', handleTouchStart, { passive: false })

    const runner = Matter.Runner.create()
    runner.delta = 1000 / 60
    Matter.Runner.run(runner, engine)

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (render && sceneRef.current) {
          render.options.width = window.innerWidth
          render.options.height = window.innerHeight
          Matter.Render.setPixelRatio(render, Math.min(window.devicePixelRatio || 1, 2))
          Matter.Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight },
          })
          Matter.Body.setPosition(ground, {
            x: window.innerWidth / 2,
            y: window.innerHeight + 50,
          })
          Matter.Body.setPosition(leftWall, {
            x: -50,
            y: window.innerHeight / 2,
          })
          Matter.Body.setPosition(rightWall, {
            x: window.innerWidth + 50,
            y: window.innerHeight / 2,
          })
        }
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (touchHandlerRef.current) {
        render.canvas.removeEventListener('touchstart', touchHandlerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      render.canvas.remove()
      if (render.textures) {
        Object.keys(render.textures).forEach((texture) => {
          render.textures[texture].remove()
        })
      }
    }
  }, [mounted, router])

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#B8E6D3' }}>
      {/* 우측 상단 "go to page" 버튼 */}
      <Link
        href="/home"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 px-4 py-2 sm:px-6 sm:py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
      >
        Go to Page
      </Link>

      <div ref={sceneRef} className="absolute inset-0 z-10" />

      {/* 중앙 텍스트 "choose your k experience" */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 drop-shadow-lg whitespace-nowrap">
          Choose Your K Experience
        </h1>
      </div>

      {/* 커스텀 도형 렌더링 */}
      {mounted && shapePositions.length > 0 && (
        <div className="absolute inset-0 z-15 pointer-events-none">
          {shapesRef.current.map((shape, index) => {
            if (index >= shapePositions.length) return null
            const position = shapePositions[index]
            
            return (
              <div
                key={`shape-${index}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: `translate(-50%, -50%) rotate(${position.angle}rad)`,
                  width: `${position.size}px`,
                  height: `${position.size}px`,
                  willChange: 'transform',
                }}
              >
                <svg
                  width={position.size}
                  height={position.size}
                  viewBox={shape.viewBox}
                  style={{ opacity: 0.9 }}
                >
                  <path d={shape.svgPath} fill="#ffffff" />
                </svg>
              </div>
            )
          })}
        </div>
      )}

      {/* 텍스트 오버레이 */}
      {mounted && textPositions.length > 0 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {textsRef.current.map((text, index) => {
            if (index >= textPositions.length) return null
            const position = textPositions[index]
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
            
            return (
              <div
                key={text.label}
                className="absolute pointer-events-auto cursor-pointer touch-manipulation"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: `translate(-50%, -50%) rotate(${position.angle}rad)`,
                  willChange: 'transform',
                }}
                onClick={() => router.push(text.url)}
              >
                <div
                  className="flex items-center justify-center font-normal uppercase select-none"
                  style={{
                    color: '#000000',
                    fontSize: isMobile ? 'clamp(1.5rem, 4vw, 2rem)' : 'clamp(2rem, 5vw, 4rem)',
                    fontFamily: '"Helvetica Neue", Helvetica, "Arial Black", Arial, sans-serif',
                    letterSpacing: '0.02em',
                    textShadow: 'none',
                  }}
                >
                  {text.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
