import { useRef, useCallback, Suspense, lazy } from 'react';
// Componentes de UI (Critical Path)
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Loader2 } from 'lucide-react'; // Fallback spinner

// Lazy Loaded Components
const InfiniteBanner = lazy(() => import('@/components/landing/InfiniteBanner').then(module => ({ default: module.InfiniteBanner })));
const ServicesCarousel = lazy(() => import('@/components/landing/ServicesCarousel').then(module => ({ default: module.ServicesCarousel })));
const PlansSection = lazy(() => import('@/components/landing/PlansSection').then(module => ({ default: module.PlansSection })));
const BenefitsSection = lazy(() => import('@/components/landing/BenefitsSection').then(module => ({ default: module.BenefitsSection })));
const Gallery = lazy(() => import('@/components/landing/Gallery').then(module => ({ default: module.Gallery })));
const Testimonials = lazy(() => import('@/components/landing/Testimonials').then(module => ({ default: module.Testimonials })));
const FinalCTA = lazy(() => import('@/components/landing/FinalCTA').then(module => ({ default: module.FinalCTA })));
const Footer = lazy(() => import('@/components/landing/Footer').then(module => ({ default: module.Footer })));

export default function Home() {
  // Referencias para el Scroll Suave
  const plansRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Lógica de Scroll
  const scrollToPlans = useCallback(() => {
    if (plansRef.current) {
      plansRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToContact = useCallback(() => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">

      {/* 1. Header Fijo */}
      <Header onScrollToPlans={scrollToPlans} />

      <main>
        {/* 2. Hero Section - Eager Loaded */}
        <Hero
          onScrollToPlans={scrollToPlans}
          onScrollToContact={scrollToContact}
        />

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh] bg-black text-blue-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        }>
          {/* 3. Banner Infinito (Clientes/Tecnologías) */}
          <div style={{ contentVisibility: 'auto' }}>
            <InfiniteBanner />
          </div>

          {/* 4. Carrusel de Servicios */}
          <div style={{ contentVisibility: 'auto' }}>
            <ServicesCarousel />
          </div>

          {/* 5. SECCIÓN DE PRECIOS (Con Ref para el scroll) */}
          <PlansSection ref={plansRef} />

          {/* 6. Beneficios y Características */}
          <div style={{ contentVisibility: 'auto' }}>
            <BenefitsSection />
          </div>

          {/* 7. Galería de Trabajos */}
          <div style={{ contentVisibility: 'auto' }}>
            <Gallery />
          </div>

          {/* 8. Testimonios */}
          <div style={{ contentVisibility: 'auto' }}>
            <Testimonials />
          </div>

          {/* 9. Llamada a la Acción Final (Con Ref) */}
          <FinalCTA
            ref={contactRef}
            onScrollToPlans={scrollToPlans}
          />
        </Suspense>
      </main>

      {/* 10. Footer */}
      <Suspense><Footer /></Suspense>

    </div>
  );
}