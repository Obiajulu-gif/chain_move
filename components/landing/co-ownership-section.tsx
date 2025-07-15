"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Coins, 
  Shield, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Layers,
  BarChart3,
  Share2,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const coOwnershipBenefits = [
  {
    icon: Coins,
    title: "Fractional Ownership",
    description: "Own a piece of multiple vehicles instead of buying one entirely. Start with any investment amount.",
    category: "Investment",
    features: ["Low entry barrier", "Diversified portfolio", "Flexible investment"]
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Transparent, immutable ownership records secured by blockchain technology with smart contract automation.",
    category: "Security",
    features: ["Immutable records", "Smart contracts", "Transparent transactions"]
  },
  {
    icon: Users,
    title: "Shared Returns",
    description: "Earn proportional returns from vehicle operations distributed automatically through smart contracts.",
    category: "Returns",
    features: ["Automated distribution", "Proportional earnings", "Real-time tracking"]
  },
  {
    icon: TrendingUp,
    title: "Liquid Assets",
    description: "Trade your vehicle tokens on our marketplace for instant liquidity and portfolio rebalancing.",
    category: "Trading",
    features: ["Instant liquidity", "Market trading", "Portfolio management"]
  }
]

export function CoOwnershipSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % coOwnershipBenefits.length)
  }

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + coOwnershipBenefits.length) % coOwnershipBenefits.length)
  }

  const handleCardClick = (index: number) => {
    setActiveCard(index)
  }

  // Auto-rotate cards every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextCard()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX
    
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      if (Math.abs(diff) > 50) {
        setDragDirection(diff > 0 ? 'right' : 'left')
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      const diff = e.clientX - startX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          prevCard()
        } else {
          nextCard()
        }
      }
      setIsDragging(false)
      setDragDirection(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const startX = e.touches[0].clientX
    
    const handleTouchMove = (e: TouchEvent) => {
      const diff = e.touches[0].clientX - startX
      if (Math.abs(diff) > 50) {
        setDragDirection(diff > 0 ? 'right' : 'left')
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].clientX - startX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          prevCard()
        } else {
          nextCard()
        }
      }
      setIsDragging(false)
      setDragDirection(null)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <section className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Panel - Content */}
          <div className="lg:pr-8">
            <div className="inline-flex items-center gap-2 bg-[#E57700]/10 text-[#E57700] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Coins className="w-4 h-4" />
              Co-Ownership Platform
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
            Revolutionary Vehicle Co-Ownership
          </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience the future of mobility investment through blockchain-powered fractional ownership and asset tokenization. 
              Join thousands of investors building wealth through shared vehicle ownership.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Fractional Investment</h4>
                  <p className="text-muted-foreground">Start with any amount and own shares in multiple vehicles</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Blockchain Security</h4>
                  <p className="text-muted-foreground">Transparent, immutable ownership records and smart contracts</p>
                </div>
        </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Automated Returns</h4>
                  <p className="text-muted-foreground">Earn proportional returns distributed automatically</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                <Coins className="h-5 w-5 mr-2" />
                Start Co-Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-[#E57700] text-[#E57700] hover:bg-[#E57700]/10 flex items-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          {/* Right Panel - Interactive Card Stack */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Card Stack Container */}
              <div className="relative h-96 perspective-1000">
                {coOwnershipBenefits.map((benefit, index) => {
                  const isActive = index === activeCard
                  const isNext = index === (activeCard + 1) % coOwnershipBenefits.length
                  const isPrev = index === (activeCard - 1 + coOwnershipBenefits.length) % coOwnershipBenefits.length
                  
                  let zIndex = 0
                  let transform = ''
                  let opacity = 0.3
                  
                  if (isActive) {
                    zIndex = 3
                    transform = 'translateY(0) scale(1)'
                    opacity = 1
                  } else if (isNext) {
                    zIndex = 2
                    transform = 'translateY(20px) scale(0.95)'
                    opacity = 0.7
                  } else if (isPrev) {
                    zIndex = 1
                    transform = 'translateY(40px) scale(0.9)'
                    opacity = 0.5
                  } else {
                    zIndex = 0
                    transform = 'translateY(60px) scale(0.85)'
                    opacity = 0.3
                  }

                  if (isDragging && isActive) {
                    if (dragDirection === 'left') {
                      transform += ' translateX(-20px)'
                    } else if (dragDirection === 'right') {
                      transform += ' translateX(20px)'
                    }
                  }

                  return (
            <Card
              key={index}
                      className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-all duration-500 ease-out border-2 hover:border-[#E57700]/50 ${
                        isActive ? 'shadow-2xl' : 'shadow-lg'
                      }`}
                      style={{
                        zIndex,
                        transform,
                        opacity,
                      }}
                      onMouseDown={isActive ? handleMouseDown : undefined}
                      onTouchStart={isActive ? handleTouchStart : undefined}
                      onClick={() => !isActive && handleCardClick(index)}
            >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#E57700]/10 rounded-xl flex items-center justify-center">
                              <benefit.icon className="h-6 w-6 text-[#E57700]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-foreground">
                                {benefit.title}
                              </CardTitle>
                              <Badge variant="secondary" className="text-xs">
                                {benefit.category}
                              </Badge>
                            </div>
                          </div>
                          {isActive && (
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-[#E57700] rounded-full"></div>
                              <div className="w-1 h-1 bg-[#E57700] rounded-full"></div>
                              <div className="w-1 h-1 bg-[#E57700] rounded-full"></div>
                            </div>
                          )}
                </div>
              </CardHeader>
                      
                      <CardContent className="pt-0">
                        <CardDescription className="text-base leading-relaxed mb-6">
                  {benefit.description}
                </CardDescription>
                        
                        <div className="border-t border-border pt-4">
                          <div className="flex flex-wrap gap-2">
                            {benefit.features.map((feature, featureIndex) => (
                              <Badge
                                key={featureIndex}
                                variant="outline"
                                className="text-xs px-2 py-1 border-[#E57700]/30 text-[#E57700]"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
              </CardContent>
            </Card>
                  )
                })}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {coOwnershipBenefits.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCard(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeCard 
                        ? 'bg-[#E57700] w-6' 
                        : 'bg-border hover:bg-[#E57700]/50'
                    }`}
                  />
                ))}
              </div>

              {/* Swipe Hint */}
              <div className="text-center mt-4 text-sm text-muted-foreground opacity-80">
                <div className="flex items-center justify-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Drag cards to navigate</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
