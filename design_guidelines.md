# Design Guidelines: Premium Web Services Landing Page

## Design Approach
**Selected Approach:** Custom premium corporate design with heavy emphasis on dynamic interactions and modern aesthetics. This is a high-impact, conversion-focused landing page for selling professional web development services.

## Brand & Aesthetic Direction

**Strict Color Palette:**
- Primary: Deep Navy Blue (#001a33)
- Secondary: Pure Black (#000000)
- Accent: Pure White (#FFFFFF)
- **FORBIDDEN:** Yellow or any warm tones

**Design Philosophy:**
- Premium corporate elegance
- Serious, professional, trustworthy
- Modern and sophisticated
- Zero playful/gaming aesthetics
- Zero religious/church vibes
- Business owner-focused credibility

## Typography System

**Hierarchy:**
- Hero Headlines: Bold, commanding, large-scale (60-80px desktop)
- Section Headers: Strong, clear (36-48px)
- Subheadings: Professional weight (24-32px)
- Body Text: Clean, readable (16-18px)
- CTAs: Bold, prominent (18-20px)

**Tone:** Professional copywriting targeting business owners - benefits over features

## Layout & Spacing

**Spacing Units:** Consistent use of 4, 8, 16, 24, 32px increments for professional rhythm

**Container Strategy:**
- Full-width sections with contained content (max-w-7xl)
- Strategic use of whitespace for premium feel
- Asymmetric layouts for visual interest

## Core Sections (In Order)

### 1. Hero Section
- **NO slider** - single powerful static hero
- Stunning visual centerpiece with parallax effects
- Cursor-interactive elements (animated blobs, shapes, flowing lines, depth layers - NOT particles)
- Powerful headline with commanding presence
- Two prominent CTAs: "Ver Planes" and "Contratar Ya"
- Dark background (navy/black) with white typography
- Immersive, engaging, memorable first impression

### 2. Infinite Loop Banner
- Horizontal scrolling marquee with continuous animation
- Display benefits, trust signals, or key messages
- Elegant, premium styling
- Seamless loop without breaks

### 3. Animated Services Carousel
- Infinite horizontal loop of service cards
- Modern, futuristic corporate design (NOT gaming aesthetic)
- Each card features:
  - Smooth hover effects (subtle tilt/scale)
  - Clean iconography
  - Concise service description
  - Premium card treatment with subtle shadows/borders

### 4. Three Plans Section
**Plan Cards (Básico, Profesional, E-commerce):**

Each card includes:
- Premium card design with depth
- Smooth entry/scroll animations
- Hover micro-interactions
- Clear pricing display
- CTA button connected to Shopify
- Exact descriptions:
  - **Plan Básico:** Web simple de 3 secciones, ideal para negocios que quieren presencia básica sin invertir demasiado
  - **Plan Profesional:** Web moderna, actualizada, optimizada, con sistema de citas integrado. Pensada para negocios que quieren dar un salto real
  - **Plan E-commerce:** Web conectada totalmente a Shopify para tener la potencia y legalidad de una tienda profesional con motor propio

### 5. "¿Por qué te conviene cada plan?" Section
- Persuasive comparison of Profesional vs E-commerce plans
- Bullet points focused on BENEFITS not features
- Professional business-oriented language
- Visual hierarchy emphasizing value propositions

### 6. Modern Gallery
- Masonry/collage layout (NOT grid)
- Smooth animations on scroll
- Showcase portfolio work or service examples
- Elegant transitions between states

### 7. Trust & Social Proof
- Testimonials with authentic formatting
- Real metrics and authority indicators
- Client logos or success numbers
- Professional credibility markers

### 8. Final CTA Section
- Direct, powerful call-to-action
- Urgency without being pushy
- Clear path to conversion
- Prominent contrast against background

## Animation & Interaction Guidelines

**Required Dynamic Elements:**
- Framer Motion for all animations
- Parallax scrolling effects (professional, not excessive)
- Cursor interaction in hero (reactive shapes/blobs/lines)
- Infinite loop animations for banners and carousels
- Smooth fade-ins and transitions on scroll
- Micro-interactions on buttons and interactive elements
- Hover states with subtle tilt, scale, or glow effects
- Depth layering for 3D-feel without being gimmicky

**Animation Principles:**
- Smooth and elegant (300-500ms timing)
- Professional easing curves
- Never jarring or distracting
- Enhance credibility, not detract from it

## Component Specifications

**Buttons:**
- Primary: Bold navy or white with strong contrast
- Hover: Subtle scale/glow effect
- Active states with micro-feedback
- Clear hierarchy between primary and secondary

**Cards:**
- Subtle shadows for depth
- Border treatments in navy/white
- Hover elevation changes
- Smooth transitions

**Forms (if needed):**
- Clean, minimal input fields
- Professional validation
- Clear error states

## Images

**Hero Section:**
- Abstract geometric shapes, flowing lines, or professional tech-focused visuals
- Dark navy/black base with white/light accents
- Dynamic, modern, corporate aesthetic
- Can be generated patterns, gradients, or abstract compositions

**Gallery:**
- Portfolio pieces, website mockups, or service demonstrations
- Professional photography or high-quality renders
- Consistent treatment across all images

## Responsive Behavior

**Breakpoints:**
- Mobile: 320-768px (stack everything single column)
- Tablet: 768-1024px (2 columns where appropriate)
- Desktop: 1024px+ (full multi-column layouts)

**Mobile Priorities:**
- Maintain animations but optimize performance
- Simplify parallax effects
- Ensure CTAs remain prominent
- Stack plan cards vertically

## Marketing Psychology Integration

- Social proof throughout (testimonials, numbers, logos)
- Authority building (experience, expertise indicators)
- Soft urgency (limited spots, popular plans highlighted)
- Benefit-focused copywriting for business owners
- Trust signals (guarantees, security, professional credentials)
- Clear value propositions at every section

## Technical Considerations

- Optimized for Netlify deployment
- All animations performance-optimized
- Lazy loading for images
- Smooth 60fps animations
- Fast initial load despite rich interactions