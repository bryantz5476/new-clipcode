import { useEffect, useRef, forwardRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 }); // Smooth 2s duration

  // Parse number and suffix
  const numberMatch = value.match(/\d+/);
  const number = numberMatch ? parseInt(numberMatch[0]) : 0;
  const suffix = value.replace(/\d+/, '');

  useEffect(() => {
    if (isInView) {
      motionValue.set(number);
    }
  }, [isInView, number, motionValue]);

  return (
    <span ref={ref} className="inline-block">
      {/* 
         Note: generic framer-motion approach for text content is tricky with simple nodes. 
         Better approach: use a specialized hook or 'display' generic.
         However, for simplicity in React 19/Framer Motion, let's use a simpler text update or separate display. 
         Let's stick to a reliable approach: formatted display via child Render 
      */}
      <DisplayValue value={springValue} suffix={suffix} />
    </span>
  );
}

// Helper to render the MotionValue as text
function DisplayValue({ value, suffix }: { value: any, suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return value.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix;
      }
    });
  }, [value, suffix]);

  return <span ref={ref} />;
}



export const FinalCTA = forwardRef<HTMLElement, { onScrollToPlans: () => void }>(({ onScrollToPlans }, ref) => {
  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      id="contact"
      data-testid="section-cta"
    >
      {/* Background: starts BLACK (matching Testimonials), transitions to navy, ends black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-navy-900 to-black" />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display leading-tight">
            ¿Listo Para Transformar
            <br />
            Tu Presencia Digital?
          </h2>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Da el paso hacia una web que realmente trabaje para tu negocio.
            Sin compromisos, sin letra pequeña.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            onClick={onScrollToPlans}
            className="bg-white text-navy-900 font-semibold px-8 py-6 text-lg group"
            data-testid="button-cta-empezar"
          >
            Empezar Mi Proyecto
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => window.open('https://wa.me/34607328443?text=%C2%A1Hola!%20Quiero%20dar%20el%20paso%20al%20futuro', '_blank')}
            className="relative bg-transparent border border-blue-500/50 text-white px-8 py-6 text-lg rounded-lg tracking-wide backdrop-blur-sm transition-all duration-300 overflow-hidden group hover:border-white hover:text-[#020617]"
            data-testid="button-cta-contactar"
          >
            <div className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0" />
            <span className="relative flex items-center z-10">
              <MessageCircle className="mr-2 w-5 h-5" />
              Contactar Primero
            </span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { icon: '30', label: 'Días de Garantía', sublabel: 'Satisfacción total o devolución' },
            { icon: '24h', label: 'Primer Boceto', sublabel: 'Comenzamos tu proyecto rápido' },
            { icon: '100%', label: 'Código Tuyo', sublabel: 'Propiedad total del proyecto' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">
                <AnimatedCounter value={item.icon} />
              </div>
              <div className="text-white font-medium mb-1">{item.label}</div>
              <div className="text-sm text-gray-400">{item.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-blue-500/10"
        >
          <p className="text-gray-400 text-sm mb-4">
            ¿Prefieres hablar directamente? Estamos aquí para ayudarte.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Phone className="w-4 h-4" />
            <span className="font-medium"><a href="https://wa.me/34607328443" target="_blank">Consulta sin compromiso</a></span>

          </div>
        </motion.div>
      </div>
    </section>
  );
});
FinalCTA.displayName = 'FinalCTA';
