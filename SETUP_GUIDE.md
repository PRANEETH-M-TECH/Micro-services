# URBAN-RISE Water Delivery - Setup & Development Guide

## 📋 Quick Start

Welcome to the URBAN-RISE Water Delivery System! This guide will help you set up and run the application locally.

## ✅ Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ Firebase account and project created
- ✅ VS Code (optional but recommended)

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
cd c:\Users\home\Desktop\Micro\Micro-services
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React & React-DOM
- Firebase
- Tailwind CSS
- Lucide React Icons
- And more...

### Step 3: Configure Firebase

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a new project"
   - Name: "Urban Rise Water Delivery"
   - Follow the wizard to create

2. **Get Firebase Credentials**
   - Go to Project Settings
   - Copy **Web App** credentials
   - Note down these values:
     - API Key
     - Auth Domain
     - Project ID
     - Storage Bucket
     - Messaging Sender ID
     - App ID

3. **Create `.env.local` File**

In the project root, create a `.env.local` file:

```env
# Firebase Configuration - Copy from your Firebase project
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxx...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=urbanrise-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=urbanrise-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=urbanrise-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# App Configuration
NEXT_PUBLIC_SOCIETY_NAME=URBAN-RISE-City of Joy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Setup Firebase Firestore

1. **Enable Authentication**
   - Firebase Console → Authentication
   - Click "Get Started"
   - Enable "Email/Password" provider

2. **Create Firestore Database**
   - Firebase Console → Firestore Database
   - Click "Create Database"
   - Start in **test mode** (for development)
   - Choose region closest to you

3. **Create Collections**

In Firestore, manually create these collections (they'll auto-populate as data is added):
- `users` - Customer and vendor profiles
- `orders` - Water delivery orders
- `conversations` - Chat conversations
- `messages` - Chat messages
- `bills` - Invoice records

### Step 5: Run Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## 🧪 Test the Application

### Create Test Accounts

1. **Register a Customer**
   - Go to `/register`
   - Fill in details:
     - Name: Test Customer
     - Email: customer@test.com
     - Phone: 9876543210
     - Block: A
     - Flat: 101
     - Password: Test123456

2. **Login as Customer**
   - Go to `/login`
   - Use credentials from above
   - Explore the dashboard

3. **Place a Test Order**
   - Click "New Order"
   - Select quantity (1-5 cans)
   - Add delivery notes
   - Click "Place Order"

### Test Vendor Dashboard

- Go to `/vendor/login`
- Enter credentials (setup vendor account in Firebase)
- Explore vendor features

## 📁 Project Structure

```
Micro-services/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API routes
│   │   ├── customer/          # Customer pages & layout
│   │   ├── vendor/            # Vendor pages & layout
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable React components
│   ├── context/              # React Context (Auth, etc.)
│   ├── lib/                  # Utilities & Firebase config
│   ├── types/                # TypeScript type definitions
│   └── public/               # Static assets
├── package.json              # Dependencies & scripts
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
└── .env.local                # Environment variables (DO NOT COMMIT)
```

## 📝 Available Scripts

```bash
# Development server (watch mode)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🔑 Key Pages

### For Customers
- `/` - Landing page
- `/login` - Customer login
- `/register` - Register new account
- `/customer/dashboard` - Main dashboard
- `/customer/order/new` - Place order
- `/customer/orders` - Order history
- `/customer/calendar` - Order calendar
- `/customer/messages` - Chat with vendor
- `/customer/bills` - Bill management
- `/customer/profile` - Profile settings

### For Vendors
- `/vendor/login` - Vendor login
- `/vendor/dashboard` - Vendor dashboard
- `/vendor/orders` - Order management
- `/vendor/customers` - Customer management
- `/vendor/messages` - Chat with customers
- `/vendor/analytics` - Analytics & reports

## 🔐 Firebase Security Rules

For development (NOT PRODUCTION):

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes in development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, implement proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Orders accessible by customer or vendor
    match /orders/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: "Firebase Config Error"
**Solution:**
- Check `.env.local` file exists
- Verify all Firebase credentials are correct
- Restart dev server after changing env file

### Issue: "Port 3000 Already in Use"
**Solution:**
```bash
PORT=3001 npm run dev
```

### Issue: "Module Not Found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Firebase Firestore Not Working"
**Solution:**
- Check Firestore is created in Firebase Console
- Verify Firebase rules allow read/write
- Check network tab in browser devtools

## 🚢 Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 💡 Tips for Development

1. **Use React DevTools** - Browser extension for debugging React
2. **Use Firebase Emulator** - For local testing without internet
3. **Check Console** - Browser console shows helpful errors
4. **Read Error Messages** - They usually explain what's wrong
5. **Use TypeScript** - Get better IDE suggestions and type safety

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify `.env.local` configuration
3. Check Firebase is properly configured
4. Read the README.md file
5. Check issue tracker on GitHub

## 📈 Next Steps

After setup is complete:

1. Explore the codebase
2. Understand the folder structure
3. Read through the component code
4. Test all features
5. Customize for your needs

---

**Happy Coding! 🚀**
