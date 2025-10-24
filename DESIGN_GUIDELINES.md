# NXOLand Design Guidelines

## Mobile & Desktop Design Standards

### Breakpoints (Tailwind defaults)
- **Mobile**: < 768px (default/no prefix)
- **Tablet**: 768px - 1023px (`md:`)
- **Desktop**: 1024px+ (`lg:`)
- **Large Desktop**: 1280px+ (`xl:`)

### Spacing & Padding
- **Mobile**: `p-4` to `p-6` (16px-24px containers)
- **Desktop**: `p-6` to `p-8` (24px-32px containers)
- **Section gaps**: `gap-4` mobile, `gap-6` desktop
- **Grid gaps**: `gap-4` mobile, `gap-6` desktop

### Typography
- **Mobile body text**: `text-sm` to `text-base` (14px-16px)
- **Desktop body text**: `text-base` (16px)
- **Mobile headings**: `text-xl` to `text-2xl`
- **Desktop headings**: `text-2xl` to `text-4xl`
- **Line height**: `leading-relaxed` (1.625)

### Touch Targets (Mobile)
- **Minimum button height**: `h-10` to `h-12` (40px-48px)
- **Minimum touch area**: 44x44px
- **Icon buttons**: `h-10 w-10` minimum

### Grid Layouts
- **Mobile**: `grid-cols-1` (single column)
- **Tablet**: `md:grid-cols-2` (two columns)
- **Desktop**: `lg:grid-cols-3` or `lg:grid-cols-4`

### Navigation
- **Mobile**: Fixed bottom nav (MobileNav component)
- **Desktop**: Top navbar visible at `md:` breakpoint
- **Hide desktop nav on mobile**: `hidden md:flex`
- **Hide mobile nav on desktop**: `md:hidden`

### Cards & Components
- **Mobile**: Full width with `p-4`
- **Desktop**: Fixed width with `p-6`
- **Border radius**: `rounded-lg` (8px)
- **Shadows**: Use design system tokens

### Images & Media
- **Mobile**: `aspect-square` or `aspect-video`
- **Responsive**: `w-full h-auto`
- **Object-fit**: `object-cover`

### Common Patterns
```css
/* Mobile-first responsive classes */
className="text-sm md:text-base lg:text-lg"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="p-4 md:p-6 lg:p-8"
className="gap-4 md:gap-6"
```

### Critical Rules
1. **Always use Tailwind responsive prefixes** (`md:`, `lg:`)
2. **Design mobile-first**, then add desktop breakpoints
3. **Test at key breakpoints**: 375px (mobile), 768px (tablet), 1440px (desktop)
4. **Use semantic color tokens** from design system (never `text-white`, `bg-black` directly)
5. **Ensure bottom padding on mobile pages**: `pb-20` (for MobileNav clearance)

### Color System
- **Primary**: `text-primary`, `bg-primary`
- **Accent**: `text-accent`, `bg-accent`
- **Foreground**: `text-foreground`, `bg-foreground`
- **Muted**: `text-muted-foreground`, `bg-muted`
- **Border**: `border-border`
- **Background**: `bg-background`

### Component Examples

#### Responsive Button
```tsx
<Button className="h-10 md:h-12 px-4 md:px-6 text-sm md:text-base">
  Button Text
</Button>
```

#### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Grid items */}
</div>
```

#### Responsive Container
```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* Content */}
</div>
```

#### Mobile Navigation Layout
```tsx
<div className="min-h-screen pb-20 md:pb-0">
  {/* Main content */}
  <MobileNav className="md:hidden" />
</div>
```

### Testing Checklist
- [ ] Mobile (375px): All text readable, no horizontal scroll
- [ ] Tablet (768px): Layout adapts properly
- [ ] Desktop (1440px): Full layout with proper spacing
- [ ] Touch targets minimum 44px on mobile
- [ ] Navigation works on all screen sizes
- [ ] Images scale properly
- [ ] Text doesn't overflow containers
