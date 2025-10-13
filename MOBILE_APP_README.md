# 📱 MultiBot Platform - Mobile App

## Overview

MultiBot Platform is an AI-powered chatbot application with voice calling capabilities, personality customization, and support for multiple AI models including DeepSeek, BERT, and OpenAI.

## Features

✅ **Multi-Model AI Chat**
- DeepSeek AI (Mistral-7B-Instruct-v0.3)
- BERT Models (Meta-Llama-3-8B-Instruct)
- OpenAI with HuggingFace fallback
- Real-time intelligent responses

✅ **Personality Customization**
- Adjustable personality traits (Empathy, Assertiveness, Humor, Patience, Confidence)
- Industry-specific presets (General, Finance, Legal, Real Estate, etc.)
- Custom personality saving

✅ **Voice Calling (Twilio Integration)**
- Make calls to any phone number
- Receive inbound calls
- Real-time call status
- Voice interaction with AI

✅ **Dashboard & Analytics**
- Interaction statistics
- Response time monitoring
- Model performance tracking
- User engagement metrics

✅ **Production-Ready**
- Secure authentication
- Error handling & fallback mechanisms
- Performance optimization
- Professional logging system

---

## Prerequisites

- Node.js 16+ 
- React Native development environment
- iOS: Xcode 14+
- Android: Android Studio with SDK 31+
- Expo CLI

---

## Installation

```bash
# Clone the repository
cd TempAppWorking

# Install dependencies
npm install

# iOS only - Install pods
cd ios
pod install
cd ..
```

---

## Configuration

### 1. Backend URL

Update `src/config/environment.js` if your backend URL changes:

```javascript
API_BASE_URL: 'http://YOUR_BACKEND_IP:5000/api'
```

### 2. HuggingFace API Key (Optional)

For direct HuggingFace fallback:
1. Get API key from https://huggingface.co/settings/tokens
2. Open app → Navigate to HuggingFace Settings
3. Enter your API key

---

## Running the App

### Development Mode

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on physical device
# Scan QR code with Expo Go app
```

### Production Build

```bash
# Build Android APK
npm run build:android

# Build iOS IPA
npm run build:ios
```

---

## Project Structure

```
TempAppWorking/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # API and bot services
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── context/           # React context providers
│   ├── navigation/        # Navigation setup
│   └── styles/            # Global styles
├── ios/                   # iOS native files
├── android/               # Android native files
├── assets/                # Images, fonts, etc.
└── App.js                 # Root component
```

---

## Key Technologies

- **React Native 0.79.5** - Mobile framework
- **Expo ~53.0.0** - Development platform
- **React Navigation 7.x** - Navigation
- **AsyncStorage 2.1.2** - Local storage
- **Keychain 8.1.3** - Secure storage
- **Lucide React Native** - Icons
- **React Native SVG** - Charts and graphics

---

## API Integration

### Backend Endpoints

```javascript
// Chatbot APIs
POST /api/bot/chat          // General chat
POST /api/deepseek/response // DeepSeek AI
POST /api/bert/response     // BERT models
POST /api/openai/response   // OpenAI service

// Twilio APIs
GET  /api/twilio/token      // Get access token
POST /api/twilio/initiate-call  // Start call
POST /api/twilio/call-status    // Call status

// User APIs
POST /api/auth/login        // User login
POST /api/auth/register     // User registration
GET  /api/dashboard/stats   // Dashboard data
```

### Fallback Mechanism

The app implements a robust fallback system:
1. **Primary:** Backend API
2. **Secondary:** Direct HuggingFace API
3. **Tertiary:** Intelligent mock responses

---

## Environment Variables

The app uses environment-based configuration:

```javascript
// Development
API_BASE_URL: 'http://168.231.114.68:5000/api'
API_TIMEOUT: 15000
RETRY_ATTEMPTS: 3

// Production
API_BASE_URL: 'http://168.231.114.68:5000/api'
API_TIMEOUT: 20000
RETRY_ATTEMPTS: 3
```

---

## Logging

The app uses a professional logging system:

```javascript
import logger from './src/utils/logger';

// Development only
logger.log('Info message');
logger.debug('Debug details');

// Always logged
logger.warn('Warning message');
logger.error('Error message');

// API logging
logger.api('POST', '/api/endpoint', data);
logger.apiResponse(200, '/api/endpoint', response);
```

**In production:** Only warnings and errors are logged, and can be sent to external services (Sentry, Bugsnag).

---

## Network Security

### iOS (Info.plist)
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <key>NSExceptionDomains</key>
  <dict>
    <key>168.231.114.68</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

### Android (AndroidManifest.xml)
```xml
<application
  android:usesCleartextTraffic="true"
  android:networkSecurityConfig="@xml/network_security_config"
  ...>
```

---

## Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Bot interaction with all models (DeepSeek, BERT, OpenAI)
- [ ] Personality customization
- [ ] Dashboard statistics display
- [ ] Settings persistence
- [ ] Network error handling
- [ ] Offline mode behavior
- [ ] Twilio calling functionality

### Test Credentials
```
Email: test@example.com
Password: Test123!
```

---

## Troubleshooting

### Issue: Cannot connect to backend

**Solution:**
1. Check backend is running: `pm2 status`
2. Verify backend URL in `src/config/environment.js`
3. Check firewall allows port 5000
4. Test backend: `curl http://168.231.114.68:5000/api/health`

### Issue: Chatbot not responding

**Solution:**
1. Check backend logs: `pm2 logs multibot-backend`
2. Verify HuggingFace API key is configured
3. Check network connectivity
4. Review app logs in development console

### Issue: Build fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules
npm install

# iOS
cd ios
pod install
cd ..

# Clean build
npm run ios -- --reset-cache
```

---

## Performance Optimization

✅ **Implemented:**
- Image lazy loading
- List virtualization
- API response caching
- Debounced user input
- Performance logging
- Memory leak prevention

---

## Security

✅ **Features:**
- Secure token storage (Keychain)
- Encrypted AsyncStorage
- JWT authentication
- API request validation
- Network security configuration
- Input sanitization

---

## Deployment

### Android

```bash
# Create release APK
eas build --platform android --profile production

# Or local build
cd android
./gradlew assembleRelease
```

### iOS

```bash
# Create release IPA
eas build --platform ios --profile production

# Or via Xcode
# Open ios/TempAppWorking.xcworkspace
# Product → Archive
```

---

## Contributing

1. Follow React Native best practices
2. Use TypeScript for new features
3. Write unit tests for utilities
4. Update documentation
5. Test on both iOS and Android

---

## License

Proprietary - All rights reserved

---

## Support

For issues or questions:
- Check logs: `pm2 logs multibot-backend`
- Review documentation in `/docs`
- Contact: support@multibotplatform.com

---

## Version History

### 1.0.0 (Current)
- Initial release
- Multi-model AI chat
- Personality customization
- Twilio voice calling
- Dashboard analytics
- Production-ready logging
- Professional UI/UX

---

**Built with ❤️ using React Native and Expo**

