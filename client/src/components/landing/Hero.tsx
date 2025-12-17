import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MousePointer2, MessageCircle } from 'lucide-react';

import PlasmaBackground from './PlasmaBackground';

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export function Hero({ onScrollToPlans, onScrollToContact }: { onScrollToPlans: () => void, onScrollToContact: () => void }) {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#020617]"
      data-testid="section-hero"
    >
      {/* Plasma WebGL Background */}
      <PlasmaBackground />

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pt-32 md:pt-40 pb-12 lg:pb-0">

        {/* Left Content */}
        <div className="max-w-2xl text-left pointer-events-none">
          <div className="pointer-events-auto">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
                Disponible para nuevos proyectos
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display tracking-tight"
            >
              Creamos Experiencias <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Digitales de Élite
                </span>
                <motion.svg
                  className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-blue-500 opacity-60"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <motion.path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="text-base md:text-xl text-gray-400 mb-8 md:mb-10 leading-relaxed max-w-lg"
            >
              Transformamos tu visión en una presencia web dominante.
              Diseño premium, velocidad extrema y conversión optimizada.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5"
            >
              {/* Primary Button */}
              <Button
                size="lg"
                onClick={onScrollToPlans}
                className="relative w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-6 md:px-10 md:py-7 text-sm md:text-base rounded-lg tracking-wide backdrop-blur-sm transition-all duration-300 overflow-hidden group hover:border-white hover:text-[#020617]"
                data-testid="button-ver-planes"
              >
                <div className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0" />
                <span className="relative flex items-center justify-center z-10">
                  VER PLANES
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              {/* Secondary Button - AHORA ABRE WHATSAPP */}
              <Button
                size="lg"
                variant="outline"
                // ⚠️ AQUI ESTA EL CAMBIO: Llama directamente a tu WhatsApp
                onClick={() => window.open('https://wa.me/34607328443?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20Demo%20para%20potenciar%20mi%20negocio.', '_blank')}
                className="relative w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-6 md:px-10 md:py-7 text-sm md:text-base rounded-lg tracking-wide backdrop-blur-sm transition-all duration-300 overflow-hidden group hover:border-white hover:text-[#020617]"
                data-testid="button-contratar-ya"
              >
                <div className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0" />
                <span className="relative flex items-center justify-center z-10">
                  AGENDAR DEMO
                  <MousePointer2 className="ml-2 w-4 h-4" />
                </span>
              </Button>
            </motion.div>

            {/* Social Proof Mini */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="mt-10 md:mt-12 flex items-center gap-6 text-sm text-gray-500 font-medium"
            >
              <div className="flex -space-x-3">
                {[
                  { name: 'NexTech', src: '/logo-nextech.png' },
                  { name: 'Orbital', src: '/logo-orbital.png' },
                  { name: 'Vertex', src: '/logo-vertex.png' },
                  { name: 'Angel', src: '/angel.webp' }
                ].map((logo, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#020617] bg-white flex items-center justify-center overflow-hidden relative shadow-lg shadow-blue-900/20"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    <img src={logo.src} alt={logo.name} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-500 mb-0.5 text-xs">
                  {'★★★★★'.split('').map(s => <span key={s}>{s}</span>)}
                </div>
                <p className="text-gray-400 text-xs font-medium">Confían +100 Empresas</p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

    </section>
  );
}