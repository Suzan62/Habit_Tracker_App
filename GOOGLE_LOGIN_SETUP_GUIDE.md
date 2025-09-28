# 🚀 Google Login & Forgot Password Setup Guide

## ✅ What's Already Implemented

### Backend Features:
- ✅ **Google OAuth Service** - Validates Google ID tokens
- ✅ **Email Service** - Sends password reset emails with 6-digit codes
- ✅ **Auth Endpoints** - `/google-login`, `/forgot-password`, `/reset-password`
- ✅ **Database Schema** - User fields for Google ID, password reset tokens
- ✅ **Security** - Secure token generation and validation

### Frontend Features:
- ✅ **Forgot Password Screen** - Complete 2-step reset flow
- ✅ **Enhanced Login Screen** - Google login button + forgot password link
- ✅ **API Integration** - Services for all auth endpoints
- ✅ **Navigation** - Proper routing between screens

---

## 🔧 Setup Requirements

### 1. **Google Cloud Console Setup**

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google Sign-In API**

#### Step 2: Configure OAuth 2.0
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Select **Web application** for backend
4. Add authorized origins: `http://localhost:5000` (your backend URL)
5. Copy **Client ID** and **Client Secret**

#### Step 3: Update Backend Configuration
Update your `appsettings.json`:
```json
{
  "GoogleAuth": {
    "ClientId": "YOUR_ACTUAL_GOOGLE_CLIENT_ID",
    "ClientSecret": "YOUR_ACTUAL_GOOGLE_CLIENT_SECRET"
  }
}
```

### 2. **Email Configuration Setup**

#### For Gmail (Recommended for Development):
1. Enable **2-Factor Authentication** on your Gmail account
2. Generate an **App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `appsettings.json`:
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-16-digit-app-password",
    "FromEmail": "your-email@gmail.com",
    "FromName": "HabitTracker Support"
  }
}
```

#### Alternative Email Providers:
**SendGrid:**
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.sendgrid.net",
    "SmtpPort": 587,
    "SmtpUsername": "apikey",
    "SmtpPassword": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "noreply@yourapp.com",
    "FromName": "HabitTracker Support"
  }
}
```

**Outlook:**
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp-mail.outlook.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@outlook.com",
    "SmtpPassword": "your-password",
    "FromEmail": "your-email@outlook.com",
    "FromName": "HabitTracker Support"
  }
}
```

### 3. **Mobile App Google Sign-In (Optional)**

For full Google Sign-In integration in React Native:

#### Install Dependencies:
```bash
cd mobile
npm install @react-native-google-signin/google-signin
```

#### iOS Setup:
1. Add `GoogleService-Info.plist` to iOS project
2. Configure URL schemes in `Info.plist`

#### Android Setup:
1. Add `google-services.json` to Android project
2. Configure SHA-1 fingerprints in Google Console

---

## 🧪 Testing the Features

### 1. **Test Forgot Password Flow**

#### Backend Test (using curl or Postman):
```bash
# Send reset code
curl -X POST http://localhost:5000/api/Auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Reset password
curl -X POST http://localhost:5000/api/Auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "resetToken": "123456",
    "newPassword": "newpassword123"
  }'
```

#### Mobile App Test:
1. Start your backend API
2. Run the mobile app
3. Go to Login → "Forgot Password?"
4. Enter email and check your inbox
5. Complete password reset with 6-digit code

### 2. **Test Google Login Flow**

#### Backend Test:
```bash
# Test Google token validation
curl -X POST http://localhost:5000/api/Auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"idToken": "GOOGLE_ID_TOKEN_HERE"}'
```

---

## 📧 Email Template Preview

The password reset email includes:
- **Professional branding** with app icon and colors
- **6-digit security code** prominently displayed
- **Expiration warning** (30 minutes)
- **Security notice** for unauthorized requests
- **Responsive HTML** design for all email clients

---

## 🔐 Security Features

### Password Reset Security:
- ✅ **6-digit random codes** (harder to guess than 4-digit)
- ✅ **30-minute expiration** on reset tokens
- ✅ **Single-use tokens** (cleared after successful reset)
- ✅ **No email enumeration** (same response for valid/invalid emails)
- ✅ **Google account protection** (prevents password reset for OAuth accounts)

### Google OAuth Security:
- ✅ **Server-side token validation** using Google's official library
- ✅ **Audience verification** (tokens must be for your app)
- ✅ **Account linking** (connects existing accounts with Google ID)
- ✅ **Secure user creation** for new Google users

---

## 🚀 Production Deployment

### Environment Variables:
Create production environment variables:
```bash
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
SMTP_HOST=your_email_provider
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_email_password
```

### HTTPS Requirements:
- Google OAuth requires HTTPS in production
- Email services require secure connections
- Update `appsettings.Production.json` accordingly

---

## 🛠️ Troubleshooting

### Common Issues:

#### "Failed to send reset email"
- ✅ Check SMTP credentials
- ✅ Verify app password (for Gmail)
- ✅ Ensure less secure app access (if applicable)
- ✅ Check firewall/network restrictions

#### "Invalid Google token"
- ✅ Verify Client ID in configuration
- ✅ Ensure token is fresh (not expired)
- ✅ Check Google Cloud Console API enablement
- ✅ Verify authorized origins

#### Database connection issues
- ✅ Ensure PostgreSQL is running
- ✅ Verify connection string
- ✅ Check if migrations were applied

---

## 🎯 Next Steps

1. **Set up email configuration** (Gmail recommended for development)
2. **Test forgot password flow** end-to-end
3. **Configure Google OAuth** (optional, for full Google Sign-In)
4. **Test both features** thoroughly
5. **Deploy to production** with proper environment variables

Your authentication system is now enterprise-ready with modern features! 🎉
