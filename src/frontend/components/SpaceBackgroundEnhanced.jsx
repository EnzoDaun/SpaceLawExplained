"use client"

import { useEffect, useRef } from "react"

export default function SpaceBackground() {
  const canvasRef = useRef(null)
  const mousePositionRef = useRef({ x: -1000, y: -1000 })
  const mouseRadius = 150

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = []
    const shootingStars = []
    const starCount = 3000

    const starColors = ["rgba(255, 255, 255, opacity)"]

    class StarImpl {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height

        const sizeRandom = Math.random()
        this.size =
          sizeRandom < 0.8
            ? Math.random() * 0.4 + 0.2
            : sizeRandom < 0.95
              ? Math.random() * 0.3 + 0.6
              : Math.random() * 0.2 + 0.9

        this.originalSize = this.size

        const colorIndex = Math.floor(Math.random() * starColors.length)
        this.maxOpacity = Math.random() * 0.5 + 0.5
        this.originalMaxOpacity = this.maxOpacity
        this.opacity = Math.random() * this.maxOpacity
        this.color = starColors[colorIndex].replace("opacity", this.opacity.toString())

        this.fadeSpeed = Math.random() * 0.005 + 0.001
        this.fadeDirection = Math.random() < 0.5 ? -1 : 1
        this.twinkleSpeed = Math.random() * 0.002 + 0.001
      }

      update(mouseX, mouseY, mouseRadius) {
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (Math.random() < 0.001) {
          this.x += (Math.random() - 0.5) * 0.2
          this.y += (Math.random() - 0.5) * 0.2
        }

        if (distance < mouseRadius) {
          const influence = 1 - distance / mouseRadius
          this.size = this.originalSize * (1 + influence * 0.3)
          this.maxOpacity = Math.min(1, this.originalMaxOpacity * (1 + influence * 0.8))
        } else {
          this.size = this.originalSize
          this.maxOpacity = this.originalMaxOpacity
        }

        this.opacity += this.fadeDirection * this.twinkleSpeed

        if (this.opacity <= 0.1) {
          this.opacity = 0.1
          this.fadeDirection = 1
        } else if (this.opacity >= this.maxOpacity) {
          this.opacity = this.maxOpacity
          this.fadeDirection = -1
        }

        const colorIndex = this.color.indexOf("rgba(")
        if (colorIndex !== -1) {
          const baseColor = this.color.substring(0, this.color.lastIndexOf(",") + 1)
          this.color = `${baseColor} ${this.opacity})`
        }
      }

      draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        if (this.size > 1.7) {
          const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
          glow.addColorStop(0, this.color)
          glow.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    class ShootingStarImpl {
      constructor() {
        const side = Math.floor(Math.random() * 4)
        this.trail = []
        this.isDead = false

        switch (side) {
          case 0:
            this.x = Math.random() * canvas.width
            this.y = 0
            this.angle = Math.PI / 2 + (Math.random() * 0.5 - 0.25)
            break
          case 1:
            this.x = canvas.width
            this.y = Math.random() * canvas.height
            this.angle = Math.PI + (Math.random() * 0.5 - 0.25)
            break
          case 2:
            this.x = Math.random() * canvas.width
            this.y = canvas.height
            this.angle = -Math.PI / 2 + (Math.random() * 0.5 - 0.25)
            break
          default:
            this.x = 0
            this.y = Math.random() * canvas.height
            this.angle = 0 + (Math.random() * 0.5 - 0.25)
        }

        this.length = Math.random() * 40 + 20
        this.speed = Math.random() * 5 + 15
        this.opacity = Math.random() * 0.25 + 0.15
        this.color = `rgba(255, 255, 255, 1)`
      }

      update() {
        const dx = Math.cos(this.angle) * this.speed
        const dy = Math.sin(this.angle) * this.speed
        this.x += dx
        this.y += dy

        this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity })

        if (this.trail.length > this.length) {
          this.trail.pop()
        }

        for (let i = 0; i < this.trail.length; i++) {
          this.trail[i].opacity = this.opacity * (1 - i / this.trail.length)
        }

        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
          this.isDead = true
        }
      }

      draw(ctx) {
        if (this.trail.length > 1) {
          for (let i = 0; i < this.trail.length - 1; i++) {
            const point = this.trail[i]
            const nextPoint = this.trail[i + 1]

            const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y)
            gradient.addColorStop(0, this.color.replace("1)", `${point.opacity})`))
            gradient.addColorStop(1, this.color.replace("1)", `${nextPoint.opacity})`))

            ctx.beginPath()
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5 * (1 - i / this.trail.length)
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(nextPoint.x, nextPoint.y)
            ctx.stroke()
          }
        }

        if (this.trail.length > 0) {
          const head = this.trail[0]
          ctx.beginPath()
          ctx.fillStyle = this.color.replace("1)", `${this.opacity})`)
          ctx.arc(head.x, head.y, 0.5, 0, Math.PI * 2)
          ctx.fill()

          const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 3)
          glow.addColorStop(0, this.color.replace("1)", `${this.opacity})`))
          glow.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(head.x, head.y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const createNightSkyGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(2, 2, 2, 1)")
      gradient.addColorStop(0.5, "rgba(5, 5, 5, 1)")
      gradient.addColorStop(1, "rgba(8, 8, 8, 1)")
      return gradient
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new StarImpl())
    }

    const spawnShootingStar = () => {
      if (Math.random() < 0.25) {
        shootingStars.push(new ShootingStarImpl())
      }
      const nextSpawnTime = Math.random() * 3000 + 2000
      setTimeout(spawnShootingStar, nextSpawnTime)
    }

    spawnShootingStar()

    for (let i = 0; i < 3; i++) {
      shootingStars.push(new ShootingStarImpl())
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    function animate() {
      ctx.fillStyle = createNightSkyGradient()
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        star.update(mousePositionRef.current.x, mousePositionRef.current.y, mouseRadius)
        star.draw(ctx)
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i]
        shootingStar.update()
        shootingStar.draw(ctx)

        if (shootingStar.isDead) {
          shootingStars.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}
