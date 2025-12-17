declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initializeAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    console.log('Google Analytics not configured - VITE_GA_MEASUREMENT_ID missing');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date().toISOString());
  window.gtag('config', GA_MEASUREMENT_ID);
}

export function trackPageView(pagePath?: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'page_view', {
    page_path: pagePath || window.location.pathname,
    page_title: document.title,
  });
}

function parsePrice(priceStr: string): number {
  const cleanPrice = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleanPrice) || 0;
}

export function trackPlanClick(planId: string, planName: string, planPrice: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'select_item', {
      item_list_id: 'plans',
      item_list_name: 'Service Plans',
      items: [{
        item_id: planId,
        item_name: planName,
        price: parsePrice(planPrice),
        currency: 'EUR',
      }],
    });
  }
  
  console.log(`[Analytics] Plan clicked: ${planName} (${planId}) - ${planPrice} EUR`);
}

export function trackAddToCart(productId: string, productName: string, price?: string) {
  const parsedPrice = price ? parsePrice(price) : 0;
  
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: parsedPrice,
      items: [{
        item_id: productId,
        item_name: productName,
        price: parsedPrice,
        quantity: 1,
      }],
    });
  }
  
  console.log(`[Analytics] Added to cart: ${productName} (${productId})`);
}

export function trackCheckoutStart(cartValue: string, currency: string, itemCount: number) {
  const parsedValue = parsePrice(cartValue);
  
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: parsedValue,
      items_count: itemCount,
    });
  }
  
  console.log(`[Analytics] Checkout started: ${cartValue} ${currency} (${itemCount} items)`);
}

export function trackFormSubmit(formName: string, success: boolean) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
      form_name: formName,
    });
  }
  
  console.log(`[Analytics] Form ${formName}: ${success ? 'submitted' : 'error'}`);
}

export function trackScrollDepth(section: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'scroll_depth', {
      section_name: section,
    });
  }
}

export function trackCTAClick(ctaName: string, location: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', {
      cta_name: ctaName,
      cta_location: location,
    });
  }
  
  console.log(`[Analytics] CTA clicked: ${ctaName} at ${location}`);
}
