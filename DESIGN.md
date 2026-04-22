# Design Brief: Solemar

**Tone & Differentiation**: Warm seaside luxury with editorial depth. Every section intentionally layered—floating cards, semi-transparent overlays, color progression. Inspires travel through immersive composition and tactile hover states.

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary (Ocean) | `0.45 0.18 230` | `0.65 0.16 220` | Deep teal-blue, calming, main CTA |
| Secondary (Coral) | `0.72 0.19 35` | `0.75 0.18 40` | Warm peachy accent, energy zones |
| Accent (Sand) | `0.85 0.11 70` | `0.82 0.1 80` | Golden highlights, delicate CTAs |
| Background | `0.98 0.01 70` | `0.12 0.01 230` | Cream/off-white, dark navy |
| Foreground | `0.12 0.02 220` | `0.95 0.01 70` | Dark blue-tinted text, light cream |

**Typography**: Lora (display/editorial), Nunito (body/humanist), GeistMono (functional). 4-tier hierarchy: display 48px, heading 28px, body 16px, caption 12px.

| Zone | Light Treatment | Dark Treatment | Details |
|------|-----------------|-----------------|---------|
| Header | `bg-card border-b border-primary/20` | `bg-card border-b border-primary/30` | Anchored, navigation, logo |
| Hero | Full-width image + title overlay | Semi-transparent dark card `bg-foreground/10` | Immersive lead, property showcase |
| Property Cards | `bg-card rounded-xl shadow-ambient border-primary/10` | `bg-card rounded-xl shadow-lifted border-primary/30` | Lifted depth, hover-lift animation |
| Gallery Grid | 3-col responsive, `hover-lift` class | Same grid, darker card bg | Interactive hover states |
| Amenities | Grid 3x2, `bg-card` + `border-l-4 border-primary` | Dark card variant | Icon + label per amenity |
| About Section | `bg-secondary/10` backdrop | `bg-secondary/20 backdrop` | Warm accent zone |
| Booking Form | Coral secondary bg, accent CTA | Warm secondary, golden accent CTA | Action-focused zone |
| Footer | `bg-muted text-muted-foreground border-t-2 border-primary/20` | Dark muted bg, light text | Grounded, links + contact |

**Shape & Motion**: 16px base radius (rounded-xl). Shadows: `shadow-ambient` (cards), `shadow-lifted` (hover). Motion: `transition-smooth` (0.3s cubic), `-translate-y-1` on hover. No bouncing. One decoration: subtle hover lift.

**Component Patterns**: Card-centric (property, amenities). Gallery grid with image fade-in. Form fields use `input` token (light sand). Buttons: primary blue for main, accent sand for secondary. Borders minimal—use shadows + subtle `primary/10` accents.

**Accessibility**: WCAG AA+ contrast enforced in both modes. Text 12–48px range. Buttons 44px+ touch target. Focus rings use `ring` token. Interactive feedback via lift + shadow, not color alone.

**Responsive**: Mobile-first. `sm:` 640px, `md:` 768px, `lg:` 1024px. Hero scales, gallery 1-col→2-col→3-col. Form stacks mobile, 2-col on tablet+. Footer single column always.

**Constraints**: No generic blues. No full-page gradients—depth via layered cards + shadows. One serif (display only), one warm sans (body). No animations on interaction below 300ms. CSP hardening for hotlinked images.

**Signature Detail**: Warm coral secondary zone around booking section creates visual hierarchy and warmth. All cards cast consistent `shadow-ambient` giving impression of floating surfaces. Borders are always primary/10 or muted—never harsh black.
