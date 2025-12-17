import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header({ onScrollToPlans }: { onScrollToPlans: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Servicios', id: 'section-services' },
    { label: 'Planes', id: 'planes' },
    { label: 'Portfolio', id: 'section-gallery' },
    { label: 'Contacto', id: 'contact' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-6 left-0 right-0 z-50 pointer-events-none"
      >
        <div
          className={`max-w-5xl mx-auto rounded-full border transition-all duration-300 pointer-events-auto ${isScrolled
            ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl shadow-blue-900/10'
            : 'bg-black/40 backdrop-blur-md border-transparent'
            }`}
        >
          <div className="px-6 h-16 flex items-center justify-between">
            <motion.a
              href="#"
              className="text-xl font-bold text-white font-display"
              whileHover={{ scale: 1.02 }}
              data-testid="link-logo"
            >
              <span className="text-blue-400">Clip</span>Code
            </motion.a>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-gray-300 hover:text-white transition-colors font-medium relative group"
                  data-testid={`link-nav-${item.id}`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">


              <Button
                onClick={onScrollToPlans}
                className="hidden sm:flex bg-white hover:bg-blue-50 text-navy-900 font-medium rounded-full px-6"
                data-testid="button-header-contratar"
              >
                Contratar
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="md:hidden text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsMobileMenuOpen(true)}
                data-testid="button-mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-navy-950 border-l border-blue-500/10"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-white font-display">
                    <span className="text-blue-400">Clip</span>Code
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="button-close-mobile-menu"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left text-lg text-gray-300 py-3 border-b border-blue-500/10"
                      data-testid={`link-mobile-nav-${item.id}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <Button
                  onClick={() => {
                    onScrollToPlans();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-8 bg-white text-navy-900 font-medium"
                  data-testid="button-mobile-contratar"
                >
                  Contratar Ahora
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
