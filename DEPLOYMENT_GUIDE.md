# URBAN-RISE Water Delivery - Deployment Guide

## 🚀 Deployment to Vercel

This guide explains how to deploy the URBAN-RISE Water Delivery application to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free tier available)
- Firebase project configured

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - URBAN-RISE Water Delivery"

# Add GitHub remote
git remote add origin https://github.com/yourusername/urban-rise.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 3: Import Project to Vercel

1. On Vercel dashboard, click "New Project"
2. Select your GitHub repository
3. Configure project:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: ./ (or your project directory)
   - Click "Deploy"

### Step 4: Add Environment Variables

1. In Vercel dashboard, go to Project Settings
2. Click "Environment Variables"
3. Add all variables from your `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_SOCIETY_NAME
NEXT_PUBLIC_APP_URL
```

4. Click "Save"

### Step 5: Verify Deployment

1. Vercel will automatically build and deploy
2. You'll see deployment progress in the dashboard
3. Once complete, you get a URL like: `https://urban-rise.vercel.app`
4. Click the URL to test your live application

## 📊 Monitoring Deployment

### Check Deployment Status
- Vercel Dashboard → Your Project
- See real-time build logs
- Check for any build errors

### View Application Logs
- Vercel Dashboard → Deployments
- Click on a deployment
- View logs and performance metrics

### Analytics
- Vercel Dashboard → Analytics
- See performance metrics
- Monitor uptime
- Check error rates

## 🔐 Production Security Checklist

Before going live, ensure:

- [ ] `.env.local` is in `.gitignore`
- [ ] Firebase security rules are configured properly
- [ ] CORS is properly configured
- [ ] Environment variables are set in Vercel
- [ ] API endpoints are authenticated
- [ ] Database backups are configured

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main branch
- Pull request (preview deployment)
- Merge into main (production)

### Disable/Enable Auto-Deployment

In Project Settings → Git:
- Uncheck "Deploy on push" to disable auto-deployment
- Check to enable

## 🚫 Rollback (If Something Goes Wrong)

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click the three dots (...)
5. Select "Promote to Production"

## 🎯 Custom Domain Setup

1. In Vercel Dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update your domain's nameservers

## 📈 Optimize for Production

### 1. Enable Caching
```javascript
// next.config.js
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

### 2. Image Optimization
- Next.js automatically optimizes images
- Serve images from CDN
- Use `next/image` component

### 3. Code Splitting
- Next.js automatically does this
- Monitor bundle size
- Remove unused dependencies

## 🔧 Performance Optimization

### Monitoring with Vercel Analytics
- Enable Web Vitals monitoring
- Monitor page load times
- Identify slow pages
- Track core metrics

### Firebase Optimization
- Enable Firebase caching
- Use indexes for frequent queries
- Monitor read/write operations
- Optimize Firestore rules

## 🚨 Troubleshooting Deployment

### Build Fails
```
Solution:
1. Check build logs in Vercel
2. Fix any TypeScript errors
3. Ensure all dependencies installed
4. Run locally: npm run build
```

### Environment Variables Not Working
```
Solution:
1. Verify variables are set in Vercel
2. Restart build (Redeploy)
3. Check variable names exactly (case-sensitive)
4. Ensure variables start with NEXT_PUBLIC_ for client
```

### Firebase Connection Errors
```
Solution:
1. Verify Firebase credentials in Vercel
2. Check Firebase project is created
3. Enable required services in Firebase
4. Check security rules
```

### Slow Performance
```
Solution:
1. Check Vercel Analytics
2. Optimize database queries
3. Enable caching
4. Use CDN for images
5. Monitor Firebase usage
```

## 📊 Monitoring in Production

### Set Up Alerts

1. **Vercel Alerts**
   - Monitor build failures
   - Track deployment status
   - Check uptime

2. **Firebase Monitoring**
   - Monitor read/write operations
   - Track authentication issues
   - Check storage usage

### Regular Maintenance

- Review logs weekly
- Monitor database performance
- Check user feedback
- Update dependencies monthly
- Backup data regularly

## 📈 Scaling as You Grow

### When Traffic Increases

1. **Database Optimization**
   - Add indexes to frequently queried fields
   - Archive old data
   - Optimize queries

2. **Caching Strategy**
   - Cache static content
   - Use Redis for session management
   - Cache API responses

3. **Frontend Performance**
   - Lazy load images
   - Code splitting
   - Service workers

## 💰 Cost Optimization

### Vercel
- Free tier: 100GB bandwidth/month
- Pro tier: ₹760/month (approx)
- Monitor usage in dashboard

### Firebase
- Free tier: 1GB storage, 50K reads/writes
- Pay-as-you-go: Structure queries wisely
- Monitor usage in Firebase console

### Optimization Tips
- Optimize database queries
- Implement caching
- Compress images
- Use serverless functions wisely

## 🔄 A/B Testing

### With Vercel Edge Functions
```javascript
// Deploy different versions
export const config = {
  regions: ['syd'],
  runtime: 'nodejs',
}
```

## 🔐 Security in Production

### Enable Security Headers
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
]
```

### API Protection
- Implement rate limiting
- Validate all inputs
- Use authentication
- Log security events

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Application loads at deployed URL
- [ ] Firebase configured correctly
- [ ] Current domain working
- [ ] Performance acceptable
- [ ] Security headers set

**Your application is now live! 🎉**
