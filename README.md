# Urban Rise - Water Delivery Management System

A modern, responsive web application for managing water delivery in residential societies. Built for **URBAN-RISE-City of Joy**.

## 🌟 Features

### Customer Features
- **Easy Ordering**: Order water cans with transparent pricing
- **Order Tracking**: Real-time order status updates
- **Order Calendar**: Visual calendar to track order patterns
- **Order History**: View all past and current orders
- **Direct Messaging**: Chat with vendors in real-time
- **Bill Management**: View and download bills
- **Profile Management**: Manage your account details

### Vendor Features
- **Order Management**: View and manage incoming orders
- **Order Scheduling**: Set delivery time slots
- **Customer Management**: View all customers and their details
- **Order Status Updates**: Update customers with delivery status
- **Calendar Analytics**: View daily/monthly order patterns
- **Direct Messaging**: Chat with customers
- **Bill Generation**: Create and send bills

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time**: Firebase Realtime Database / Firestore Listeners
- **Chat**: Socket.io / Firestore
- **Deployment**: Vercel
- **UI Components**: Lucide React Icons

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase Project

### Setup Steps

1. **Clone and navigate to the project**
```bash
cd Micro-services
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Copy your Firebase configuration
   - Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_SOCIETY_NAME=URBAN-RISE-City of Joy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── customer/          # Customer pages
│   ├── vendor/            # Vendor pages
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── context/              # React contexts (Auth, etc.)
├── lib/                  # Utilities and Firebase config
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🚀 Key Pages

### Customer
- `/` - Landing page
- `/login` - Customer login
- `/register` - New account registration
- `/customer/dashboard` - Main dashboard
- `/customer/order/new` - Place new order
- `/customer/orders` - Order history
- `/customer/calendar` - Order calendar
- `/customer/messages` - Chat with vendor
- `/customer/bills` - Bill management

### Vendor
- `/vendor/login` - Vendor login
- `/vendor/dashboard` - Vendor orders and analytics

## 🔐 Authentication

- Firebase Authentication (Email/Password)
- Customer and Vendor roles
- Protected routes with auth checks
- Session management

## 💾 Database Schema

### Collections:
- **users** - Customer and vendor profiles
- **orders** - Order details
- **conversations** - Chat conversations
- **messages** - Chat messages
- **bills** - Invoice records
- **societyConfig** - Society-specific settings
- **priceConfig** - Pricing configuration

## 🎨 Design Features

- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark/Light Theme Ready**: Tailwind CSS configured
- **Accessible**: WCAG 2.1 compliant
- **Fast**: Optimized images and code splitting
- **SEO Ready**: Meta tags and structured data

## 📱 Mobile Optimization

- Responsive grid layouts
- Mobile-first navigation
- Touch-friendly buttons
- Optimized for small screens

## 🔄 Real-time Features

- Order status updates
- Live chat messaging
- Notification system
- Real-time availability

## 📊 Analytics (Future)

- Order trends
- Customer patterns
- Vendor performance metrics
- Revenue tracking

## 🚢 Deployment

### Deploy to Vercel
```bash
npm run build
# Push to GitHub and connect to Vercel for auto-deployment
```

The application is optimized for Vercel deployment with:
- Zero-config Next.js deployment
- Automatic CI/CD
- Preview deployments
- Analytics

## 🔐 Security

- Firebase Security Rules configured
- Data validation on backend
- Secure authentication
- CORS protection
- Environment variables for sensitive data

## 🐛 Common Setup Issues

### Firebase Connection Error
- Check `.env.local` configuration
- Ensure Firebase project is created
- Verify API keys are correct

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Yes |
| `NEXT_PUBLIC_SOCIETY_NAME` | Society Name | No (default provided) |
| `NEXT_PUBLIC_APP_URL` | App URL | No (default: http://localhost:3000) |

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact: support@urbanrise.local

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] SMS/Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-society management
- [ ] Mobile app (React Native)
- [ ] Subscription plans
- [ ] Loyalty rewards program
- [ ] Admin panel

---

**Built with ❤️ for URBAN-RISE-City of Joy**
