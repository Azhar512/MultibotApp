// Environment configuration
const isDevelopment = __DEV__

// API Configuration
const API_CONFIG = {
  development: {
    API_BASE_URL: 'http://168.231.114.68:5000/api',
    TWILIO_API_URL: 'http://168.231.114.68:5000/api',
    API_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  production: {
    API_BASE_URL: 'http://168.231.114.68:5000/api',
    TWILIO_API_URL: 'http://168.231.114.68:5000/api',
    API_TIMEOUT: 15000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
  }
}

// Get current environment config
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production

// API Endpoints - Updated to match backend routes
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE: '/auth/me',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  BOT: {
    CHAT: '/bot/chat',
    DEEPSEEK: '/deepseek/response',
    OPENAI: '/openai/response',
    BERT: '/bert/response',
    PERSONALITY: '/bot/personality',
  },
  TWILIO: {
    TOKEN: '/twilio/token',
    CALL_START: '/twilio/initiate-call',
    CALL_END: '/twilio/end-call',
    CALL_STATUS: '/twilio/call-status',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    TRENDS: '/dashboard/interaction-trends',
    PERSONALITY: '/dashboard/personality-effectiveness',
    INTERACTIONS: '/dashboard/interactions',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users',
    PROFILE: '/users/profile',
  },
  HEALTH: '/health',
}

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'TempAppWorking',
  APP_VERSION: '1.0.0',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de'],
  DEFAULT_LANGUAGE: 'en',
  THEME: {
    PRIMARY_COLOR: '#667eea',
    SECONDARY_COLOR: '#764ba2',
    SUCCESS_COLOR: '#4CAF50',
    ERROR_COLOR: '#F44336',
    WARNING_COLOR: '#FF9800',
    INFO_COLOR: '#2196F3',
  },
  FEATURES: {
    VOICE_CALLS: true,
    CHAT_BOT: true,
    ANALYTICS: true,
    MULTI_LANGUAGE: true,
    DARK_MODE: true,
  },
  LIMITS: {
    MAX_MESSAGE_LENGTH: 500,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_AUDIO_DURATION: 300, // 5 minutes
    MAX_CALL_DURATION: 3600, // 1 hour
  },
  CACHE: {
    DEFAULT_TTL: 3600000, // 1 hour
    USER_DATA_TTL: 86400000, // 24 hours
    SETTINGS_TTL: 604800000, // 1 week
  },
  SECURITY: {
    TOKEN_EXPIRY: 86400000, // 24 hours
    REFRESH_TOKEN_EXPIRY: 604800000, // 1 week
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900000, // 15 minutes
  },
}

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: !isDevelopment,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_DEEP_LINKING: true,
  ENABLE_BIOMETRIC_AUTH: false, // Set to true when implemented
  ENABLE_THEME_CUSTOMIZATION: true,
}

// Development Tools
export const DEV_TOOLS = {
  ENABLE_LOGGING: isDevelopment,
  ENABLE_REDUX_DEVTOOLS: isDevelopment,
  ENABLE_NETWORK_INSPECTOR: isDevelopment,
  ENABLE_PERFORMANCE_OVERLAY: isDevelopment,
  MOCK_API_RESPONSES: false, // Set to true for testing
}

// Error Reporting
export const ERROR_REPORTING = {
  ENABLED: !isDevelopment,
  SAMPLE_RATE: 0.1, // 10% of errors
  MAX_QUEUE_SIZE: 100,
  FLUSH_INTERVAL: 30000, // 30 seconds
}

// Performance Monitoring
export const PERFORMANCE_CONFIG = {
  ENABLED: true,
  SAMPLE_RATE: 0.1,
  MAX_METRICS: 1000,
  FLUSH_INTERVAL: 60000, // 1 minute
}

// Network Configuration
export const NETWORK_CONFIG = {
  TIMEOUT: config.API_TIMEOUT,
  RETRY_ATTEMPTS: config.RETRY_ATTEMPTS,
  RETRY_DELAY: config.RETRY_DELAY,
  MAX_CONCURRENT_REQUESTS: 5,
  REQUEST_QUEUE_SIZE: 100,
}

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_STORAGE_SIZE: 50 * 1024 * 1024, // 50MB
  CLEANUP_THRESHOLD: 0.8, // Clean up when 80% full
  ENCRYPTION_ENABLED: true,
  COMPRESSION_ENABLED: true,
}

// Validation Configuration
export const VALIDATION_CONFIG = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  MESSAGE_MAX_LENGTH: 500,
  PHONE_MAX_LENGTH: 15,
}

// Export configuration
export { config }

// Default export
export default {
  config,
  API_ENDPOINTS,
  APP_CONFIG,
  FEATURE_FLAGS,
  DEV_TOOLS,
  ERROR_REPORTING,
  PERFORMANCE_CONFIG,
  NETWORK_CONFIG,
  STORAGE_CONFIG,
  VALIDATION_CONFIG,
}
