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

Create `.env.development` for local development:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Create `.env.production` for production:
```env
VITE_API_BASE_URL=https://api.nxoland.com/api
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
- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.nxoland.com/api`

## 📄 License

MIT License - see LICENSE file for details.
