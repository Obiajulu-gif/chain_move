'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  DollarSign, 
  CheckCircle, 
  Users, 
  Coins, 
  TrendingUp, 
  FileText, 
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Wallet,
  Target
} from 'lucide-react'

interface SectionContent {
  id: string
  title: string
  subtitle: string
  description: string
  features: Array<{
    icon: any
    title: string
    description: string
  }>
  cta: {
    text: string
    href: string
    icon: any
  }
  visual: {
    type: 'image'
    src: string
  }
}

const sections: SectionContent[] = [
  {
    id: 'drivers',
    title: 'For Drivers & Entrepreneurs',
    subtitle: 'Co-ownership Revolution',
    description: 'Access vehicle co-ownership opportunities and build your mobility business with shared investment and reduced risk. Partner with investors to grow your fleet.',
    features: [
      {
        icon: Users,
        title: 'Shared Investment',
        description: 'Co-ownership reduces individual investment burden'
      },
      {
        icon: Coins,
        title: 'Tokenized Ownership',
        description: 'Transparent profit sharing through blockchain'
      },
      {
        icon: TrendingUp,
        title: 'Scale Your Business',
        description: 'Grow your fleet with shared capital'
      },
      {
        icon: Shield,
        title: 'Risk Mitigation',
        description: 'Distributed risk across multiple investors'
      }
    ],
    cta: {
      text: 'Start Co-Ownership',
      href: '/auth?role=driver',
      icon: FileText
    },
    visual: {
      type: 'image',
      src: '/images/driver-hero.jpg'
    }
  },
  {
    id: 'investors',
    title: 'For Investors & DAOs',
    subtitle: 'Tokenized Mobility Assets',
    description: 'Diversify your portfolio with tokenized mobility assets. Co-own vehicles, participate in DAO governance, and earn returns from the growing shared mobility economy.',
    features: [
      {
        icon: Coins,
        title: 'Fractional Ownership',
        description: 'Tokenized vehicle ownership with trading capability'
      },
      {
        icon: BarChart3,
        title: 'Portfolio Diversification',
        description: 'Access to diverse mobility asset classes'
      },
      {
        icon: Globe,
        title: 'DAO Governance',
        description: 'Participate in decentralized decision making'
      },
      {
        icon: Wallet,
        title: 'Liquid Assets',
        description: 'Trade tokenized ownership stakes anytime'
      }
    ],
    cta: {
      text: 'Start Co-Investing',
      href: '/auth?role=investor',
      icon: TrendingUp
    },
    visual: {
      type: 'image',
      src: '/images/investor-dashboard.jpg'
    }
  }
]

const InteractiveCard = ({ section, isActive }: { section: SectionContent; isActive: boolean }) => {
  const CTAIcon = section.cta.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.85,
        y: isActive ? 0 : 20
      }}
      transition={{ 
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={`relative h-[300px] lg:h-[480px] w-full rounded-2xl lg:rounded-3xl overflow-hidden ${
        isActive ? 'z-10' : 'z-0'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={section.visual.src || '/placeholder.jpg'}
          alt={section.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Interactive Elements Grid */}
      <div className="absolute inset-0 p-4 lg:p-8">
        <div className="grid grid-cols-2 gap-2 lg:gap-4 h-full">
          {section.features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.5,
                  x: isActive ? 0 : -10
                }}
                transition={{ 
                  delay: isActive ? index * 0.1 : 0,
                  duration: 0.6,
                  ease: [0.43, 0.195, 0.02, 1]
                }}
                className={`relative p-2 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-md border border-white/20 ${
                  isActive 
                    ? 'bg-white/10 hover:bg-white/15' 
                    : 'bg-white/5'
                } transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                  <div className="p-1 lg:p-2 rounded-lg bg-[#E57700]/20">
                    <IconComponent className="h-3 w-3 lg:h-5 lg:w-5 text-[#E57700]" />
                  </div>
                  <h4 className="text-white font-semibold text-xs lg:text-sm">{feature.title}</h4>
                </div>
                <p className="text-gray-300 text-xs lg:text-xs leading-relaxed hidden lg:block">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 20
          }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-3 right-3 lg:bottom-6 lg:right-6"
        >
          <Button
            asChild
            size="sm"
            className="bg-[#E57700] hover:bg-[#E57700]/90 backdrop-blur-md border border-white/20 transform hover:scale-105 transition-all duration-200 text-xs lg:text-sm"
          >
            <Link href={section.cta.href} className="flex items-center space-x-1 lg:space-x-2">
              <CTAIcon className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="text-xs lg:text-sm font-medium">{section.cta.text}</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function InteractiveSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null)
  const isInView = useInView(containerRef, { amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const ActiveCTAIcon = sections[activeSection].cta.icon
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const leftPanelY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-cycle sections on mobile
  useEffect(() => {
    if (!isMobile || !isInView || isUserInteracting) return

    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % sections.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isMobile, isInView, isUserInteracting, sections.length])

  // Handle touch interactions
  const handleTouchStart = () => {
    if (!isMobile) return
    setIsUserInteracting(true)
    if (touchTimeout) {
      clearTimeout(touchTimeout)
    }
  }

  const handleTouchEnd = () => {
    if (!isMobile) return
    // Resume auto-cycling after 3 seconds of no interaction
    const timeout = setTimeout(() => {
      setIsUserInteracting(false)
    }, 3000)
    setTouchTimeout(timeout)
  }

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      // Don't update from scroll on mobile during auto-cycle
      if (isMobile && isInView) return
      
      const sectionIndex = Math.min(Math.floor(progress * sections.length * 1.2), sections.length - 1)
      setActiveSection(sectionIndex)
    })

    return unsubscribe
  }, [scrollYProgress, isMobile, isInView])

  // Manual section change for mobile
  const handleSectionChange = (index: number) => {
    setActiveSection(index)
    setIsUserInteracting(true)
    if (touchTimeout) {
      clearTimeout(touchTimeout)
    }
    // Resume auto-cycling after 5 seconds of manual selection
    const timeout = setTimeout(() => {
      setIsUserInteracting(false)
    }, 5000)
    setTouchTimeout(timeout)
  }

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen lg:h-screen bg-background overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#E57700]/20 via-transparent to-[#142841]/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E57700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#142841]/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Main Container */}
      <div className="min-h-screen lg:h-full flex items-center py-12 lg:py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:h-full items-center">
            
            {/* Left Panel - Content */}
            <motion.div 
              style={{ y: leftPanelY }}
              className="space-y-4 lg:space-y-6 lg:w-1/2 w-full"
            >
              {/* Section Indicator */}
              <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6 justify-center lg:justify-start">
                {sections.map((_, index) => (
                  <motion.div
                    key={index}
                    onClick={() => isMobile && handleSectionChange(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === activeSection 
                        ? 'w-8 lg:w-12 bg-[#E57700]' 
                        : 'w-4 lg:w-6 bg-gray-600'
                    } ${isMobile ? 'cursor-pointer' : ''}`}
                    animate={{
                      backgroundColor: index === activeSection ? '#E57700' : '#4b5563'
                    }}
                  />
                ))}
              </div>

              {/* Mobile: Auto-cycle indicator */}
              {isMobile && (
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  {isUserInteracting ? (
                    <span>Tap indicators to switch • Auto-cycle paused</span>
                  ) : (
                    <span>Auto-cycling every 5s • Tap to pause</span>
                  )}
                </div>
              )}

              {/* Dynamic Content */}
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                className="space-y-3 lg:space-y-4 text-center lg:text-left"
              >
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  {activeSection === 0 ? (
                    <Car className="h-6 w-6 lg:h-8 lg:w-8 text-[#E57700]" />
                  ) : (
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-[#E57700]" />
                  )}
                  <span className="text-[#a594fd] font-medium tracking-wide text-sm lg:text-base">
                    {sections[activeSection].subtitle}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {sections[activeSection].title}
                </h2>

                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {sections[activeSection].description}
                </p>

                {/* Feature List */}
                <div className="space-y-2 lg:space-y-3 pt-2 lg:pt-3">
                  {sections[activeSection].features.slice(0, 3).map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-start space-x-3 justify-center lg:justify-start"
                      >
                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#E57700] rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                        </div>
                        <span className="flex items-center text-foreground text-sm lg:text-base">
                          <IconComponent className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-[#a594fd]" />
                          {feature.title}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="pt-3 lg:pt-4 flex justify-center lg:justify-start"
                >
                  <Button
                    size="lg"
                    className="bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-300 text-white font-semibold text-sm lg:text-base"
                    asChild
                  >
                    <Link href={sections[activeSection].cta.href} className="flex items-center space-x-2">
                      <ActiveCTAIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span>{sections[activeSection].cta.text}</span>
                      <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-1 lg:ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Panel - Visuals */}
            <div className="relative h-full flex items-center justify-center lg:w-1/2 w-full mt-8 lg:mt-0">
              <div className="w-full max-w-[320px] lg:max-w-[400px] h-[300px] lg:h-[480px] relative">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: index === activeSection ? 1 : 0,
                      scale: index === activeSection ? 1 : 0.8,
                      zIndex: index === activeSection ? 10 : 0
                    }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0"
                  >
                    <InteractiveCard section={section} isActive={index === activeSection} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 