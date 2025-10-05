// Accessibility utilities for better screen reader support

export const AccessibilityLabels = {
  // Navigation
  MENU_BUTTON: 'Open navigation menu',
  CLOSE_BUTTON: 'Close',
  BACK_BUTTON: 'Go back',
  HOME_BUTTON: 'Go to home screen',
  
  // Authentication
  EMAIL_INPUT: 'Email address',
  PASSWORD_INPUT: 'Password',
  LOGIN_BUTTON: 'Sign in to your account',
  REGISTER_BUTTON: 'Create new account',
  
  // Bot Interaction
  MESSAGE_INPUT: 'Type your message',
  SEND_BUTTON: 'Send message',
  VOICE_BUTTON: 'Record voice message',
  CALL_BUTTON: 'Make phone call',
  END_CALL_BUTTON: 'End phone call',
  
  // Settings
  SAVE_BUTTON: 'Save settings',
  RESET_BUTTON: 'Reset to default values',
  UPLOAD_BUTTON: 'Upload file',
  
  // Status indicators
  LOADING: 'Loading, please wait',
  ERROR: 'Error occurred',
  SUCCESS: 'Operation successful',
  CONNECTED: 'Connected to server',
  DISCONNECTED: 'Disconnected from server',
}

export const AccessibilityHints = {
  // Form inputs
  EMAIL_REQUIRED: 'Email address is required',
  PASSWORD_REQUIRED: 'Password is required',
  PHONE_FORMAT: 'Enter phone number in international format',
  
  // Actions
  DOUBLE_TAP: 'Double tap to activate',
  LONG_PRESS: 'Long press for more options',
  SWIPE: 'Swipe to navigate',
  
  // Status
  LOADING_MESSAGE: 'Please wait while the operation completes',
  ERROR_RETRY: 'An error occurred. Try again or contact support',
  SUCCESS_MESSAGE: 'Operation completed successfully',
}

// Generate accessibility props for common components
export const getAccessibilityProps = (type, customProps = {}) => {
  const baseProps = {
    accessible: true,
    ...customProps,
  }

  switch (type) {
    case 'button':
      return {
        ...baseProps,
        accessibilityRole: 'button',
        accessibilityHint: AccessibilityHints.DOUBLE_TAP,
      }
    
    case 'textInput':
      return {
        ...baseProps,
        accessibilityRole: 'text',
        accessibilityHint: AccessibilityHints.DOUBLE_TAP,
      }
    
    case 'image':
      return {
        ...baseProps,
        accessibilityRole: 'image',
      }
    
    case 'header':
      return {
        ...baseProps,
        accessibilityRole: 'header',
      }
    
    case 'link':
      return {
        ...baseProps,
        accessibilityRole: 'link',
        accessibilityHint: AccessibilityHints.DOUBLE_TAP,
      }
    
    case 'switch':
      return {
        ...baseProps,
        accessibilityRole: 'switch',
        accessibilityHint: AccessibilityHints.DOUBLE_TAP,
      }
    
    case 'slider':
      return {
        ...baseProps,
        accessibilityRole: 'adjustable',
        accessibilityHint: 'Swipe up or down to adjust value',
      }
    
    case 'tab':
      return {
        ...baseProps,
        accessibilityRole: 'tab',
        accessibilityHint: AccessibilityHints.DOUBLE_TAP,
      }
    
    default:
      return baseProps
  }
}

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  // In a real implementation, you'd use a library like react-native-accessibility
  // or implement platform-specific screen reader announcements
  if (__DEV__) {
    console.log(`Screen reader announcement (${priority}): ${message}`)
  }
}

// Focus management
export const focusManagement = {
  // Focus on element
  focus: (ref) => {
    if (ref && ref.current && ref.current.focus) {
      ref.current.focus()
    }
  },
  
  // Focus on first focusable element
  focusFirst: (containerRef) => {
    if (containerRef && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  },
  
  // Focus on last focusable element
  focusLast: (containerRef) => {
    if (containerRef && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus()
      }
    }
  }
}

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },
  
  // Calculate contrast ratio
  getContrastRatio: (color1, color2) => {
    const lum1 = colorContrast.getLuminance(...color1)
    const lum2 = colorContrast.getLuminance(...color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  },
  
  // Check if contrast meets WCAG standards
  meetsWCAG: (color1, color2, level = 'AA') => {
    const ratio = colorContrast.getContrastRatio(color1, color2)
    const requirements = {
      AA: 4.5,
      AAA: 7.0,
      'AA-large': 3.0,
      'AAA-large': 4.5
    }
    return ratio >= requirements[level]
  }
}

// Keyboard navigation
export const keyboardNavigation = {
  // Handle keyboard events
  handleKeyPress: (event, onEnter, onEscape, onArrowUp, onArrowDown) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        onEnter && onEnter()
        break
      case 'Escape':
        onEscape && onEscape()
        break
      case 'ArrowUp':
        onArrowUp && onArrowUp()
        break
      case 'ArrowDown':
        onArrowDown && onArrowDown()
        break
    }
  },
  
  // Generate keyboard navigation props
  getKeyboardProps: (onEnter, onEscape) => ({
    onKeyPress: (event) => keyboardNavigation.handleKeyPress(event, onEnter, onEscape),
    tabIndex: 0,
  })
}

// ARIA attributes for React Native
export const ariaAttributes = {
  // Generate ARIA props
  generateAriaProps: (label, hint, state) => ({
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: state,
  }),
  
  // Common ARIA states
  states: {
    selected: (isSelected) => ({ selected: isSelected }),
    disabled: (isDisabled) => ({ disabled: isDisabled }),
    expanded: (isExpanded) => ({ expanded: isExpanded }),
    checked: (isChecked) => ({ checked: isChecked }),
  }
}

export default {
  AccessibilityLabels,
  AccessibilityHints,
  getAccessibilityProps,
  announceToScreenReader,
  focusManagement,
  colorContrast,
  keyboardNavigation,
  ariaAttributes,
}
