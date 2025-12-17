import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SiInstagram, SiLinkedin, SiWhatsapp } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-black border-t border-blue-500/10" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-bold text-white font-display inline-block mb-4">
              <span className="text-blue-400">Clip</span>Code
            </a>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              ClipCode: Tu equipo de estrategia digital. Implementamos soluciones web ultrarrápidas y seguras, diseñadas quirúrgicamente para el nicho de Citas/Servicios (Estética, Bienestar). Dejamos de lado los CMS lentos. Nuestra única misión es que tu negocio lidere localmente y facture más rápido.
            </p>
            <div className="flex gap-4">
              {[
                { icon: SiInstagram, label: 'Instagram', href: 'https://www.instagram.com/clip.code.studio/' },
                { icon: SiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/clipcode/' },
                { icon: SiWhatsapp, label: 'WhatsApp', href: 'https://wa.me/34607328443' }
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-navy-900 border border-blue-500/10 flex items-center justify-center text-gray-400 transition-colors"
                    aria-label={social.label}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-3">
              {[
                { label: 'Servicios', href: '#section-services' },
                { label: 'Planes', href: '#planes' },
                { label: 'Portfolio', href: '#section-gallery' },
                { label: 'Contacto', href: '#contact' }
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">

              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+34 607 328 443</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>España</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            2025 ClipCode. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 text-sm" data-testid="link-privacy">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-500 text-sm" data-testid="link-terms">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-500 text-sm" data-testid="link-cookies">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
