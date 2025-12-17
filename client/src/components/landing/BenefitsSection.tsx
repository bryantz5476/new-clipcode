import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Clock, Shield, Zap, Award } from 'lucide-react';

const professionalBenefits = [
  {
    icon: TrendingUp,
    title: 'Crecimiento Real',
    description: 'Con sistema de citas integrado, tus clientes reservan 24/7 sin llamadas.'
  },
  {
    icon: Users,
    title: 'Más Conversiones',
    description: 'Diseño optimizado para convertir visitantes en clientes reales.'
  },
  {
    icon: Clock,
    title: 'Ahorra Tiempo',
    description: 'Automatiza reservas y consultas mientras tú te centras en tu negocio.'
  }
];

const ecommerceBenefits = [
  {
    icon: Shield,
    title: 'Legal y Seguro',
    description: 'Shopify cumple todas las normativas de e-commerce y protección de datos.'
  },
  {
    icon: Zap,
    title: 'Ventas Sin Límites',
    description: 'Vende a cualquier hora, cualquier día, en cualquier parte del mundo.'
  },
  {
    icon: Award,
    title: 'Gestión Profesional',
    description: 'Inventario, envíos y pagos en un solo lugar, fácil de manejar.'
  }
];

function HoloCard({
  benefit,
  index,
  delay
}: {
  benefit: typeof professionalBenefits[0];
  index: number;
  delay: number;
}) {
  const Icon = benefit.icon;
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 50, delay: delay + index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative group perspective-1000"
    >
      <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

      <Card className="relative p-6 h-full bg-[#0a0f1e]/80 backdrop-blur-md border border-white/10 overflow-hidden transform-style-3d group-hover:border-blue-500/50 transition-colors duration-300">

        {/* Holographic Gradient Sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon Container */}
        <div className="relative z-10 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20 group-hover:border-blue-500/50">
          <Icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors duration-300 transform group-hover:rotate-12" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 transform translate-z-12">
          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{benefit.title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
            {benefit.description}
          </p>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-blue-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      </Card>
    </motion.div>
  );
}

export function BenefitsSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden" data-testid="section-benefits">

      {/* Smooth Transition from previous section (Navy -> Black) */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#020617] to-transparent pointer-events-none z-10" />

      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
            ¿Por Qué Te Conviene <span className="text-blue-500">Cada Plan?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Desglosamos el valor real para tu negocio. Sin tecnicismos, solo resultados.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Col 1: Professional */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8 pl-4 border-l-4 border-blue-500"
            >
              <h3 className="text-2xl font-bold text-white mb-2 font-display">
                Plan Profesional
              </h3>
              <p className="text-blue-400 font-medium uppercase tracking-wider text-sm">
                Escalabilidad & Servicios
              </p>
            </motion.div>

            <div className="space-y-6">
              {professionalBenefits.map((benefit, index) => (
                <HoloCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                  delay={0.2}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border-l border-blue-500/30 backdrop-blur-sm"
            >
              <p className="text-gray-300 italic text-sm">
                "Esta es la opción perfecta si tu objetivo es dejar de depender del 'boca a boca' y empezar a captar clientes en piloto automático."
              </p>
            </motion.div>
          </div>

          {/* Col 2: E-commerce */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8 pl-4 border-l-4 border-indigo-500"
            >
              <h3 className="text-2xl font-bold text-white mb-2 font-display">
                Plan E-commerce
              </h3>
              <p className="text-indigo-400 font-medium uppercase tracking-wider text-sm">
                Ventas Globales & Automatización
              </p>
            </motion.div>

            <div className="space-y-6">
              {ecommerceBenefits.map((benefit, index) => (
                <HoloCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                  delay={0.4}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="mt-8 p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-transparent border-l border-indigo-500/30 backdrop-blur-sm"
            >
              <p className="text-gray-300 italic text-sm">
                "Diseñado para quienes no juegan a vender, sino a construir un imperio online. Potencia bruta de Shopify + Diseño de élite."
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
