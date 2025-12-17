import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Globe,
  ShoppingCart,
  Calendar,
  BarChart,
  Smartphone,
  Search,
  Zap,
  Lock
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Diseño Web',
    description: 'Webs modernas y elegantes que representan tu marca con profesionalidad'
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce',
    description: 'Tiendas online con Shopify para vender tus productos sin límites'
  },
  {
    icon: Calendar,
    title: 'Sistema de Citas',
    description: 'Agenda online integrada para que tus clientes reserven fácilmente'
  },
  {
    icon: BarChart,
    title: 'Analytics',
    description: 'Seguimiento de métricas para entender y mejorar tu negocio'
  },
  {
    icon: Smartphone,
    title: 'Diseño Responsive',
    description: 'Tu web perfecta en móvil, tablet y escritorio'
  },
  {
    icon: Search,
    title: 'SEO Optimizado',
    description: 'Posicionamiento en Google para que te encuentren'
  },
  {
    icon: Zap,
    title: 'Alta Velocidad',
    description: 'Carga ultra rápida para mejor experiencia de usuario'
  },
  {
    icon: Lock,
    title: 'SSL Seguro',
    description: 'Certificado de seguridad para proteger tu web y clientes'
  }
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable 3D tilt on mobile for performance
    if (window.innerWidth < 768 || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  useEffect(() => {
    const handleReset = () => {
      if (isHovered) {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('scroll', handleReset, { passive: true });
    window.addEventListener('touchstart', handleReset, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleReset);
      window.removeEventListener('touchstart', handleReset);
    };
  }, [isHovered, x, y]);

  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsHovered(!isHovered)} // Toggle on click for mobile
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className="flex-shrink-0 w-72"
    >
      <Card className="relative p-6 h-56 bg-gradient-to-br from-navy-900 to-navy-950 border-blue-500/10 overflow-visible">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-md opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
        </div>
        <motion.div
          className="absolute -bottom-1 left-4 right-4 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}

// Add detailed logic for responsive speed
// Add detailed logic for responsive speed
export function ServicesCarousel() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // initial
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle interaction to resume animation
  useEffect(() => {
    const resumeAnimation = () => setIsPaused(false);

    if (isPaused) {
      window.addEventListener('click', resumeAnimation);
      window.addEventListener('scroll', resumeAnimation, { passive: true });
      window.addEventListener('touchstart', resumeAnimation, { passive: true });
    }

    return () => {
      window.removeEventListener('click', resumeAnimation);
      window.removeEventListener('scroll', resumeAnimation);
      window.removeEventListener('touchstart', resumeAnimation);
    };
  }, [isPaused]);

  return (
    <section id="section-services" className="py-20 bg-black overflow-hidden" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Servicios que Impulsan tu Negocio
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Todo lo que necesitas para una presencia digital profesional y efectiva
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Inject dynamic styles for keyframes */}
        <style>{`
          @keyframes scroll-infinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .paused {
            animation-play-state: paused !important;
          }
        `}</style>

        <div
          className="flex py-4 w-max hover:cursor-pointer"
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIsPaused((prev) => (isMobile ? !prev : true));
          }}
          style={{
            animation: `scroll-infinite ${isMobile ? 20 : 30}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange: 'transform'
          }}
        >
          {/* Duplicate items for seamless infinite scroll */}
          {[...services, ...services].map((service, index) => (
            <div key={index} className="pr-6">
              <ServiceCard service={service} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
