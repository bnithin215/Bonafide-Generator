# 🚀 Deployment Guide - Bonafide Certificate Generator

This guide provides detailed instructions for deploying the Bonafide Certificate Generator to Firebase Hosting and Cloud Functions.

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] Firebase account
- [x] Node.js (v14+) and npm installed
- [x] Firebase CLI installed globally (`npm install -g firebase-tools`)
- [x] Git installed
- [x] Project configured with Firebase credentials

## 🔧 Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `bonafide-tkr` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Required Services

#### Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Select **Start in production mode**
4. Choose your preferred location (e.g., `asia-south1` for India)
5. Click "Enable"

#### Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

#### Enable Firebase Hosting

1. Go to **Hosting**
2. Click "Get Started"
3. Follow the setup wizard

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "Bonafide Web App")
5. Copy the Firebase configuration object
6. Update your `.env` file with these credentials

## 🔐 Set Up Service Account (For Server-Side)

### Option 1: For Production Deployment

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate New Private Key"
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in your project root (it's already in `.gitignore`)
6. Update `.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```

### Option 2: For Development (Using Environment Variables)

For local development, you can skip the service account and use the project ID directly. The app will automatically handle this.

## 📦 Local Testing Before Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Test Locally**
   ```bash
   npm start
   ```
   Visit `http://localhost:5000` to verify everything works

3. **Test Firebase Functions Locally** (Optional)
   ```bash
   firebase emulators:start
   ```

## 🌐 Deployment Steps

### Step 1: Login to Firebase

```bash
firebase login
```

This will open a browser for authentication. Login with your Google account.

### Step 2: Initialize Firebase (First Time Only)

If you haven't initialized Firebase in your project:

```bash
firebase init
```

Follow these steps:
1. Select **Hosting** and **Firestore**
2. Use an existing project: Select `bonafide-tkr`
3. Firestore Rules: Use `firestore.rules`
4. Firestore Indexes: Use `firestore.indexes.json`
5. Public directory: Enter `public`
6. Configure as SPA: **No**
7. Automatic builds: **No**
8. Overwrite index.html: **No**

### Step 3: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

This deploys your database security rules and indexes.

### Step 4: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or deploy everything at once:

```bash
firebase deploy
```

### Step 5: Verify Deployment

After deployment, Firebase CLI will provide a hosting URL:
```
Hosting URL: https://bonafide-tkr.web.app
```

Visit this URL to verify your deployment.

## 🖥️ Deploying the Backend (Node.js Server)

Since Firebase Hosting only serves static files, you need to deploy your Node.js backend separately.

### Option 1: Firebase Cloud Functions (Recommended)

1. **Install Functions Dependencies**
   ```bash
   npm install firebase-functions
   ```

2. **Create Cloud Function**

   Create `functions/index.js`:
   ```javascript
   const functions = require('firebase-functions');
   const express = require('express');
   const app = require('../server');

   exports.api = functions.https.onRequest(app);
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

### Option 2: Deploy to Heroku, Railway, or Render

#### Heroku Deployment

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create bonafide-generator`
4. Set environment variables:
   ```bash
   heroku config:set FIREBASE_PROJECT_ID=bonafide-tkr
   heroku config:set JWT_SECRET=your-secret-key
   # Add all other .env variables
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

#### Railway Deployment

1. Go to [Railway.app](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables from `.env`
4. Deploy automatically

## 🔒 Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong, random string
- [ ] Review and update Firestore security rules
- [ ] Enable HTTPS only
- [ ] Set up Firebase App Check (optional)
- [ ] Configure CORS properly
- [ ] Review and limit API rate limits
- [ ] Set up monitoring and alerts

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Dependencies
        run: npm ci

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: bonafide-tkr
```

## 📊 Monitoring and Maintenance

### Firebase Console Monitoring

1. **Firestore Usage**: Monitor read/write operations
2. **Authentication**: Track user signups and logins
3. **Hosting**: View bandwidth and storage usage
4. **Performance**: Use Firebase Performance Monitoring

### Error Tracking

Consider integrating:
- Firebase Crashlytics
- Sentry
- LogRocket

## 🔧 Environment-Specific Configurations

### Development
```env
NODE_ENV=development
PORT=5000
```

### Staging
```env
NODE_ENV=staging
PORT=5000
```

### Production
```env
NODE_ENV=production
PORT=8080
```

## 📝 Post-Deployment Tasks

1. **Test All Features**
   - User registration and login
   - Certificate request submission
   - Admin approval workflow
   - PDF generation

2. **Update DNS** (if using custom domain)
   - Add custom domain in Firebase Hosting
   - Update DNS records

3. **Set Up Backups**
   - Enable Firestore automated backups
   - Export data periodically

4. **Monitor Performance**
   - Set up alerts for errors
   - Monitor response times
   - Track user activity

## 🐛 Troubleshooting

### Common Issues

**Issue 1: Firebase Admin SDK initialization fails**
```
Solution: Ensure GOOGLE_APPLICATION_CREDENTIALS points to valid service account key
```

**Issue 2: CORS errors**
```
Solution: Configure CORS in server.js and Firebase hosting
```

**Issue 3: Firestore permission denied**
```
Solution: Review and update firestore.rules
```

**Issue 4: Functions timeout**
```
Solution: Increase timeout in firebase.json or optimize function code
```

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Review GitHub Issues
3. Contact: admin@tkrcollege.edu

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

Last Updated: November 2025
