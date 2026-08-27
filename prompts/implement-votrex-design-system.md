# Implementation Prompt: Vertex Design System

## Goal
Implement the comprehensive **Vertex Design System** in the Next.js application based on the reference design specification at `/home/omara/Downloads/votrex/design/vertex-designsystem.png`. This includes design tokens, typography, colors, spacing, radius, shadows, SVG icons (outline and filled), base UI components (buttons, badges, inputs, selects, status indicators, progress bars, breadcrumbs, pagination), composite cards (course card, video lesson card, topic lesson card, resource card), navigation bar, design principles, and an interactive design system showcase.

---

## Skills and Reference Documentation Read
- `agents.md`: Core project principles, strict prompt-approval workflow, tech stack standards, and exact UI reproduction rules.
- `modern-web-guidance`: Best practices for modern CSS, semantic HTML, accessibility (ARIA, focus management, color contrast).
- `/home/omara/Downloads/votrex/design/vertex-designsystem.png`: Single source of truth for the Vertex design system (14 sections).

---

## Code and Config Inspected
- `package.json`: Next.js 16.3.3, React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss`).
- `app/layout.tsx`: Root layout currently loading `Geist` fonts. Needs `Inter` and `Playfair_Display` from `next/font/google`.
- `app/globals.css`: Tailwind v4 stylesheet. Needs `@theme` custom properties for colors, typography, border radius, and box shadows.
- `app/page.tsx`: Default Next.js boilerplate. Will be transformed into the Vertex Design System showcase page.

---

## Decisions & Assumptions
1. **Typography**: Load `Inter` (sans) and `Playfair_Display` (serif) via `next/font/google` with CSS variables `--font-inter` and `--font-playfair`.
2. **Color Palette**:
   - **Primary**:
     - `primary-500`: `#F97316` (Brand orange)
     - `primary-400`: `#FB923C`
     - `primary-300`: `#FDBA74`
     - `primary-200`: `#FED7AA`
     - `primary-100`: `#FFEEE5`
   - **Neutral**:
     - `neutral-900`: `#0F172A`
     - `neutral-700`: `#334155`
     - `neutral-500`: `#64748B`
     - `neutral-300`: `#CBD5E1`
     - `neutral-200`: `#E2E8F0`
     - `neutral-100`: `#F1F5F9`
     - `neutral-50`: `#FAFAFC`
     - `white`: `#FFFFFF`
3. **Shadows**:
   - `shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
   - `shadow-md`: `0 4px 12px -2px rgba(15, 23, 42, 0.08)`
   - `shadow-lg`: `0 12px 24px -4px rgba(15, 23, 42, 0.10)`
   - `shadow-xl`: `0 20px 40px -8px rgba(15, 23, 42, 0.12)`
4. **Border Radius**:
   - `radius-xs`: `4px`
   - `radius-sm`: `8px`
   - `radius-md`: `12px` (default component radius)
   - `radius-lg`: `16px`
   - `radius-xl`: `24px`
   - `radius-full`: `9999px`
5. **Component Architecture**:
   - Build clean, reusable, fully typed TypeScript React components matching the exact specs in the design system image.
   - Modular file organization under `components/ui/`, `components/cards/`, `components/navigation/`, and `components/icons/`.

---

## Files to Create / Modify
- `app/globals.css`: Define Tailwind CSS v4 `@theme` tokens (colors, fonts, radius, shadows, utilities).
- `app/layout.tsx`: Configure `Inter` and `Playfair_Display` font loaders and apply font classes.
- `components/icons/index.tsx`: SVG icons for Outline and Filled variants (Bell, Search, Play, Document, Bookmark, Stats/Chart, Clock, User, ChevronRight, ChevronDown, ChevronLeft, ExternalLink, Lock, CheckCircle, Eye, Grid/Squares, Target/Compass, Accessibility/Person, VertexLogo).
- `components/ui/button.tsx`: Button component with `primary`, `secondary`, `tertiary`, `text` variants and sizes/states.
- `components/ui/badge.tsx`: Badge / Tag component for `video`, `lesson`, `popular`.
- `components/ui/input.tsx`: Search and text inputs with icon and `⌘K` badge support.
- `components/ui/select.tsx`: Styled select / dropdown menu.
- `components/ui/status-indicator.tsx`: Status indicator for `in-progress`, `completed`, `now-playing`, `locked`.
- `components/ui/progress-bar.tsx`: Progress bar with track, orange fill, and percentage label.
- `components/ui/breadcrumbs.tsx`: Hierarchical breadcrumbs component.
- `components/ui/pagination.tsx`: Pagination component with active/inactive page states.
- `components/cards/course-card.tsx`: Course card with course icon, title, description, level, duration, and module count.
- `components/cards/lesson-video-card.tsx`: Lesson video card with badge, title, description, timestamp, and "Watch from [time]" action.
- `components/cards/lesson-topic-card.tsx`: Lesson topic card with badge, title, description, module indicator, and "View lesson ↗" action.
- `components/cards/resource-card.tsx`: Resource download card with icon, title, description, file format & size, and external link action.
- `components/navigation/navbar.tsx`: Platform top navigation header with logo, navigation links, search trigger, notification bell, and user avatar.
- `components/design-system/principles.tsx`: Core design principles component (Clarity First, Consistency, Focus & Calm, Accessible).
- `app/page.tsx`: Interactive, complete showcase rendering all 14 sections of the Vertex Design System faithfully.

---

## Requirements & Design Specs
1. **01 Colors**: Exact hex values and swatches for Primary 500-100 and Neutral 900-White.
2. **02 Typography & 03 Type Scale**:
   - Display 1: Playfair Display Bold 48/56 (3rem/3.5rem)
   - Display 2: Playfair Display Bold 36/44 (2.25rem/2.75rem)
   - Heading 1: Inter Semi Bold 28/36 (1.75rem/2.25rem)
   - Heading 2: Inter Semi Bold 22/30 (1.375rem/1.875rem)
   - Heading 3: Inter Medium 18/26 (1.125rem/1.625rem)
   - Body Large: Inter Regular 16/24 (1rem/1.5rem)
   - Body: Inter Regular 14/20 (0.875rem/1.25rem)
   - Small: Inter Regular 12/16 (0.75rem/1rem)
3. **04 Spacing**: Base unit 4px (4, 8, 12, 16, 24, 32, 40, 48, 64).
4. **05 Radius & Shadows**: Exact values for 4px to Full radius, and sm to xl box shadows.
5. **06 Icons**: 24x24 grid, 2px stroke width outline, rounded line caps, and filled counterparts.
6. **07 Buttons**: Height 44px, padding 0 16px (lg) / 0 12px (md), radius 12px, Inter Medium font.
7. **08 Inputs**: Height 44px, radius 12px, border 1px solid `#E2E8F0`, padding 0 16px, focus border `#FB923C`.
8. **09 Badges / Tags**: Video (`#FFEEE5` bg, `#F97316` text), Lesson (`#EFF6FF` / `#E0E7FF` bg, `#2563EB` text), Popular (`#FFF7ED` bg, `#EA580C` text).
9. **10 Status / Indicators**: In Progress (orange spinner icon), Completed (green check icon), Now Playing (orange play icon), Locked (slate lock icon).
10. **11 Progress Bar**: Height 8px, rounded full, slate-100/200 track, orange fill, percentage label.
11. **12 Cards**: Pixel-accurate layout and typography for Course Card, Lesson Card (Video), Lesson Card (Lesson), Resource Card.
12. **13 Navigation**: Vertex navbar, Breadcrumbs hierarchy, Pagination control.
13. **14 Principles**: 4 principle cards with icons, titles, and descriptions.

---

## Security Considerations
- Purely frontend presentation and design tokens; no unsafe `dangerouslySetInnerHTML`.
- All icons and SVGs use sanitized internal SVG vector paths.
- No client-side exposure of private secrets.

---

## Acceptance Criteria
- [x] All 14 sections from `vertex-designsystem.png` are faithfully implemented and showcased.
- [x] Design tokens configured in Tailwind v4 `@theme` (`app/globals.css`).
- [x] Google fonts `Inter` and `Playfair Display` correctly loaded and integrated in `app/layout.tsx`.
- [x] Reusable component library created with TypeScript props and accessibility best practices.
- [x] Design showcase page at `app/page.tsx` renders all components, scales, swatches, and states accurately.
- [x] `npm run build` and `npm run lint` pass without errors or type warnings.

---

## Checks to Run
- `npm run lint`: Lint check across all files.
- `npm run build`: Production build check for TypeScript compilation and Next.js page generation.
