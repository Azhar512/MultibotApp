// Input validation utilities
export const ValidationRules = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  MESSAGE_MAX_LENGTH: 500,
  PHONE_MAX_LENGTH: 15,
}

export const ValidationMessages = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${ValidationRules.PASSWORD_MIN_LENGTH} characters long`,
  NAME_TOO_SHORT: `Name must be at least ${ValidationRules.NAME_MIN_LENGTH} characters long`,
  MESSAGE_TOO_LONG: `Message must be less than ${ValidationRules.MESSAGE_MAX_LENGTH} characters`,
  PHONE_TOO_LONG: `Phone number must be less than ${ValidationRules.PHONE_MAX_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validate email
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  const sanitizedEmail = sanitizeInput(email)
  if (!ValidationRules.EMAIL.test(sanitizedEmail)) {
    return { isValid: false, message: ValidationMessages.INVALID_EMAIL }
  }
  
  return { isValid: true, message: null, value: sanitizedEmail }
}

// Validate password
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  if (password.length < ValidationRules.PASSWORD_MIN_LENGTH) {
    return { isValid: false, message: ValidationMessages.PASSWORD_TOO_SHORT }
  }
  
  return { isValid: true, message: null, value: password }
}

// Validate name
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  const sanitizedName = sanitizeInput(name)
  if (sanitizedName.length < ValidationRules.NAME_MIN_LENGTH) {
    return { isValid: false, message: ValidationMessages.NAME_TOO_SHORT }
  }
  
  return { isValid: true, message: null, value: sanitizedName }
}

// Validate phone number
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  const sanitizedPhone = sanitizeInput(phone).replace(/\D/g, '') // Remove non-digits
  if (sanitizedPhone.length > ValidationRules.PHONE_MAX_LENGTH) {
    return { isValid: false, message: ValidationMessages.PHONE_TOO_LONG }
  }
  
  if (!ValidationRules.PHONE.test(sanitizedPhone)) {
    return { isValid: false, message: ValidationMessages.INVALID_PHONE }
  }
  
  return { isValid: true, message: null, value: sanitizedPhone }
}

// Validate message
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  const sanitizedMessage = sanitizeInput(message)
  if (sanitizedMessage.length > ValidationRules.MESSAGE_MAX_LENGTH) {
    return { isValid: false, message: ValidationMessages.MESSAGE_TOO_LONG }
  }
  
  return { isValid: true, message: null, value: sanitizedMessage }
}

// Validate URL
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, message: ValidationMessages.REQUIRED }
  }
  
  try {
    const sanitizedUrl = sanitizeInput(url)
    new URL(sanitizedUrl)
    return { isValid: true, message: null, value: sanitizedUrl }
  } catch {
    return { isValid: false, message: ValidationMessages.INVALID_URL }
  }
}

// Validate password confirmation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: ValidationMessages.PASSWORDS_DONT_MATCH }
  }
  
  return { isValid: true, message: null, value: password }
}

// Validate form data
export const validateForm = (formData, rules) => {
  const errors = {}
  const sanitizedData = {}
  
  for (const [field, value] of Object.entries(formData)) {
    const rule = rules[field]
    if (!rule) continue
    
    const validation = rule(value, formData)
    if (!validation.isValid) {
      errors[field] = validation.message
    } else {
      sanitizedData[field] = validation.value
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitizedData,
  }
}

// Common validation rules
export const CommonRules = {
  email: validateEmail,
  password: validatePassword,
  name: validateName,
  phone: validatePhone,
  message: validateMessage,
  url: validateURL,
}

// Login form validation
export const validateLoginForm = (formData) => {
  return validateForm(formData, {
    email: validateEmail,
    password: validatePassword,
  })
}

// Registration form validation
export const validateRegistrationForm = (formData) => {
  return validateForm(formData, {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: (value, data) => validatePasswordConfirmation(data.password, value),
  })
}

// Bot message validation
export const validateBotMessage = (formData) => {
  return validateForm(formData, {
    message: validateMessage,
  })
}

// Phone call validation
export const validatePhoneCall = (formData) => {
  return validateForm(formData, {
    phoneNumber: validatePhone,
  })
}

export default {
  ValidationRules,
  ValidationMessages,
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateMessage,
  validateURL,
  validatePasswordConfirmation,
  validateForm,
  CommonRules,
  validateLoginForm,
  validateRegistrationForm,
  validateBotMessage,
  validatePhoneCall,
}
