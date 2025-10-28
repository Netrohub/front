# NXOLand Frontend

A modern React application built with Vite, TypeScript, and Tailwind CSS for the NXOLand marketplace platform.

## 🚀 Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **i18next** - Internationalization (English/Arabic)

## 📁 Project Structure

```
nxoland-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   └── features/         # Feature-specific components
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the frontend directory (use `.env.example` as a template):

```bash
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000

# Analytics & Tracking
# Google Tag Manager Container ID (format: GTM-XXXXXXX)
VITE_GTM_ID=GTM-XXXXXXX

# Legacy Google Analytics (optional if using GTM)
VITE_GA_TRACKING_ID=
VITE_ENABLE_ANALYTICS=true

# Cloudflare Turnstile (CAPTCHA)
VITE_TURNSTILE_SITE_KEY=

# Payment Gateway
VITE_TAP_PAYMENT_PUBLIC_KEY=

# Feature Flags
VITE_ENABLE_KYC=true
VITE_ENABLE_DISPUTES=true
VITE_ENABLE_SOCIAL_LOGIN=false

# Environment
VITE_APP_ENV=development
```

**Important:** Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

## 🚀 Deployment

### Hostinger Static Hosting

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your Hostinger public_html directory

3. **Configure domain** to point to your Hostinger account

### Docker Deployment

```bash
# Build Docker image
docker build -t nxoland-frontend .

# Run container
docker run -p 80:80 nxoland-frontend
```

### Nginx Configuration

The included `nginx.conf` provides:
- SSL/HTTPS support
- Gzip compression
- Static asset caching
- React Router support
- Security headers

## 🎨 Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching
- **Internationalization** - English/Arabic support
- **Modern UI** - Glass morphism design
- **Performance** - Optimized bundle size
- **Accessibility** - WCAG compliant components
- **Analytics** - GTM + GA4 integration with comprehensive event tracking

## 📱 Pages

- **Homepage** - Landing page with hero section
- **Products** - Product catalog and filtering
- **Authentication** - Login/Register forms
- **User Dashboard** - Account management
- **Seller Dashboard** - Product management
- **Admin Panel** - Platform administration
- **Cart & Checkout** - Shopping experience
- **Orders** - Order tracking
- **Disputes** - Dispute resolution

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🌐 API Integration

The frontend connects to the NestJS backend API:
- **Development**: `https://api.nxoland.com/api`
- **Production**: `https://api.nxoland.com/api`

## 📊 Analytics & Tracking

NXOLand uses **Google Tag Manager (GTM)** for flexible analytics and marketing tag management. GA4 is configured through GTM.

### Quick Setup

1. Get your GTM Container ID from [Google Tag Manager](https://tagmanager.google.com/)
2. Add it to your `.env` file:
   ```bash
   VITE_GTM_ID=GTM-XXXXXXX
   ```
3. Configure GA4 in GTM console (see [GTM_SETUP_GUIDE.md](../GTM_SETUP_GUIDE.md) for detailed instructions)

### Features

- **Automatic Page View Tracking** - Tracks React Router navigation
- **E-commerce Events** - Product views, cart actions, purchases
- **User Events** - Login, registration, profile views
- **Seller Events** - Product listings, seller onboarding
- **KYC Tracking** - Verification flow tracking
- **Device Detection** - Mobile vs desktop tracking
- **Privacy-Compliant** - Cookie consent friendly
- **Dev Mode Disabled** - Only tracks in production

### Using Analytics in Your Code

```typescript
import { useGTM } from '@/hooks/useGTM';

function MyComponent() {
  const { trackCustomEvent } = useGTM();
  
  const handleAction = () => {
    trackCustomEvent('custom_action', {
      category: 'engagement',
      value: 123
    });
  };
}
```

For complete documentation, see [GTM_SETUP_GUIDE.md](../GTM_SETUP_GUIDE.md)

## 📄 License

MIT License - see LICENSE file for details.
