import { Code, Palette, Rocket, Shield, Clock, Award } from 'lucide-react';

const items = [
  { icon: Code, text: 'Código Limpio' },
  { icon: Palette, text: 'Diseño Premium' },
  { icon: Rocket, text: 'Alto Rendimiento' },
  { icon: Shield, text: 'Seguridad Total' },
  { icon: Clock, text: 'Entrega Rápida' },
  { icon: Award, text: 'Calidad Garantizada' },
  { icon: Code, text: 'SEO Optimizado' },
  { icon: Palette, text: 'Responsive Design' },
];

export function InfiniteBanner() {
  return (
    <section className="relative py-6 bg-navy-900 border-y border-blue-500/10 overflow-hidden" data-testid="section-banner">
      <style>{`
        @keyframes banner-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="flex">
        <div
          className="flex gap-12 items-center whitespace-nowrap"
          style={{
            animation: 'banner-scroll 30s linear infinite',
            willChange: 'transform',
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium tracking-wide uppercase">{item.text}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 ml-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
