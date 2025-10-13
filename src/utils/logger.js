/**
 * Production-Ready Logger
 * Conditionally logs based on environment
 * In production, logs are disabled for console but can be sent to external services
 */

const isDevelopment = __DEV__;

class Logger {
  constructor() {
    this.isEnabled = isDevelopment;
    this.logLevel = isDevelopment ? 'debug' : 'error';
  }

  /**
   * Log informational messages (development only)
   */
  log(...args) {
    if (this.isEnabled) {
      console.log('[INFO]', ...args);
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(...args) {
    if (this.isEnabled && this.logLevel === 'debug') {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Log warnings (always logged)
   */
  warn(...args) {
    console.warn('[WARN]', ...args);
    // In production, send to error tracking service
    if (!isDevelopment) {
      this.sendToErrorService('warn', args);
    }
  }

  /**
   * Log errors (always logged)
   */
  error(...args) {
    console.error('[ERROR]', ...args);
    // In production, send to error tracking service
    if (!isDevelopment) {
      this.sendToErrorService('error', args);
    }
  }

  /**
   * Send logs to external error tracking service
   * TODO: Integrate with Sentry, Bugsnag, or your preferred service
   */
  sendToErrorService(level, args) {
    // Implement your error tracking service here
    // Example: Sentry.captureMessage(JSON.stringify(args), level);
  }

  /**
   * Log API calls (development only)
   */
  api(method, url, data) {
    if (this.isEnabled) {
      console.log(`[API] ${method} ${url}`, data ? data : '');
    }
  }

  /**
   * Log API responses (development only)
   */
  apiResponse(status, url, data) {
    if (this.isEnabled) {
      console.log(`[API RESPONSE] ${status} ${url}`, data ? data : '');
    }
  }

  /**
   * Log performance metrics (development only)
   */
  performance(label, duration) {
    if (this.isEnabled) {
      console.log(`[PERFORMANCE] ${label}: ${duration}ms`);
    }
  }
}

// Export singleton instance
export default new Logger();

