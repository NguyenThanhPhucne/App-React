"use client"

import { useState, useEffect } from "react"

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSuggestions, setEmailSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState({})
  const [justSelectedSuggestion, setJustSelectedSuggestion] = useState({})
  const [isHoveringSuggestions, setIsHoveringSuggestions] = useState({})
  const [blurTimeout, setBlurTimeout] = useState({})
  const [justClickedSuggestion, setJustClickedSuggestion] = useState({})

  const commonEmailDomains = [
    'gmail.com',
    'hotmail.com', 
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'mail.com',
    'live.com',
    'msn.com',
    'gmx.com',
    'yandex.com',
    'zoho.com',
    'fastmail.com',
    'tutanota.com',
    'disroot.org'
  ]

  const generateEmailSuggestions = (input, fieldName) => {
    if (!input) return []
    
    let localPart, domainPart = ''
    if (input.includes('@')) {
      [localPart, domainPart] = input.split('@')
      if (!localPart) return []
    } else {
      localPart = input
    }
    
    const filteredDomains = commonEmailDomains.filter(domain => 
      domain.startsWith(domainPart.toLowerCase())
    )
    
    if (filteredDomains.length === 0) return []
    
    return filteredDomains.map(domain => `${localPart}@${domain}`)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    // Handle email suggestions
    if (name === 'email' || name === 'account') {
      const suggestions = generateEmailSuggestions(value, name)
      setEmailSuggestions(suggestions)
      setShowSuggestions(prev => ({ ...prev, [name]: suggestions.length > 0 }))
    }
    
    // Only clear error if field was previously touched and now has no errors
    // But don't validate immediately after suggestion selection
    if (errors[name] && touched[name] && !justSelectedSuggestion[name]) {
      const fieldErrors = validateField(name, value, validationRules[name])
      if (!fieldErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    // Don't process blur if suggestion was just clicked for this field
    if (justClickedSuggestion[name]) {
      return
    }
    
    // Clear any existing blur timeout for this field
    if (blurTimeout[name]) {
      clearTimeout(blurTimeout[name])
    }
    
    // Hide suggestions on blur with delay, but only if not hovering
    if (name === 'email' || name === 'account') {
      const timeout = setTimeout(() => {
        if (!isHoveringSuggestions[name]) {
          setShowSuggestions(prev => ({ ...prev, [name]: false }))
        }
      }, 150)
      setBlurTimeout(prev => ({ ...prev, [name]: timeout }))
    }
    
    // Only validate and show errors on blur if field has been touched
    // But don't validate immediately after suggestion selection
    if (touched[name] && !justSelectedSuggestion[name]) {
      const fieldErrors = validateField(name, values[name], validationRules[name])
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || "" }))
    }
  }

  const handleSuggestionClick = (fieldName, suggestion) => {
    // Clear any existing blur timeout first
    if (blurTimeout[fieldName]) {
      clearTimeout(blurTimeout[fieldName])
      setBlurTimeout(prev => ({ ...prev, [fieldName]: null }))
    }
    
    // Set flag to prevent blur logic for this field
    setJustClickedSuggestion(prev => ({ ...prev, [fieldName]: true }))
    
    // Update values and hide suggestions immediately
    setValues(prev => ({ ...prev, [fieldName]: suggestion }))
    setShowSuggestions(prev => ({ ...prev, [fieldName]: false }))
    setEmailSuggestions([])
    setIsHoveringSuggestions(prev => ({ ...prev, [fieldName]: false }))
    
    // Clear any existing errors for this field
    setErrors(prev => ({ ...prev, [fieldName]: "" }))
    
    // Mark field as touched to prevent immediate re-validation
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    // Set flag to prevent immediate validation
    setJustSelectedSuggestion(prev => ({ ...prev, [fieldName]: true }))
    
    // Clear the flags after a short delay
    setTimeout(() => {
      setJustSelectedSuggestion(prev => ({ ...prev, [fieldName]: false }))
      setJustClickedSuggestion(prev => ({ ...prev, [fieldName]: false }))
    }, 100)
  }

  const handleSuggestionsMouseEnter = (fieldName) => {
    setIsHoveringSuggestions(prev => ({ ...prev, [fieldName]: true }))
    // Cancel blur timeout when hovering suggestions
    if (blurTimeout[fieldName]) {
      clearTimeout(blurTimeout[fieldName])
      setBlurTimeout(prev => ({ ...prev, [fieldName]: null }))
    }
  }

  const handleSuggestionsMouseLeave = (fieldName) => {
    setIsHoveringSuggestions(prev => ({ ...prev, [fieldName]: false }))
    // Start a short delay before hiding to allow re-enter
    const timeout = setTimeout(() => {
      if (!isHoveringSuggestions[fieldName]) {
        setShowSuggestions(prev => ({ ...prev, [fieldName]: false }))
      }
    }, 100)
    setBlurTimeout(prev => ({ ...prev, [fieldName]: timeout }))
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(blurTimeout).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [blurTimeout])

  const validateField = (fieldName, value, rules) => {
    const fieldErrors = {}
    
    if (!rules) return fieldErrors

    if (rules.required && !value?.trim()) {
      fieldErrors[fieldName] = `${fieldName === 'account' ? 'Account' : fieldName === 'confirmPassword' ? 'Confirm Password' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    } else if (rules.minLength && value && value.length < rules.minLength) {
      if (fieldName === 'password') {
        fieldErrors[fieldName] = `Password must be at least ${rules.minLength} characters`
      } else if (fieldName === 'username') {
        fieldErrors[fieldName] = `Username must be at least ${rules.minLength} characters`
      } else if (fieldName === 'account') {
        fieldErrors[fieldName] = `Account must be at least ${rules.minLength} characters`
      } else {
        fieldErrors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`
      }
    } else if (rules.username && value) {
      if (value.length < 3) {
        fieldErrors[fieldName] = "Username must be at least 3 characters"
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        fieldErrors[fieldName] = "Username can only contain letters, numbers, and underscores"
      }
    } else if (rules.password && value) {
      if (value.length < 6) {
        fieldErrors[fieldName] = "Password must be at least 6 characters"
      } else if (!/[A-Z]/.test(value)) {
        fieldErrors[fieldName] = "Password must contain at least one uppercase letter"
      } else if (!/[a-z]/.test(value)) {
        fieldErrors[fieldName] = "Password must contain at least one lowercase letter"
      } else if (!/[0-9]/.test(value)) {
        fieldErrors[fieldName] = "Password must contain at least one number"
      }
    } else if (rules.email && value) {
      // For account field, check if it's an email format
      if (fieldName === 'account' && value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          fieldErrors[fieldName] = "Please enter a valid email address"
        }
      }
      // For email field, always check email format
      else if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          fieldErrors[fieldName] = "Please enter a valid email address"
        }
      }
    } else if (rules.match && value && value !== values[rules.match]) {
      if (fieldName === 'confirmPassword') {
        fieldErrors[fieldName] = "Passwords do not match"
      } else {
        fieldErrors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} does not match`
      }
    }

    return fieldErrors
  }

  const validate = () => {
    const newErrors = {}

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field]
      const value = values[field]
      const fieldErrors = validateField(field, value, rules)
      
      if (fieldErrors[field]) {
        newErrors[field] = fieldErrors[field]
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (onSubmit) => {
    // Mark all fields as touched when submitting
    const allTouched = {}
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Only show errors for touched fields
  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : ""
  }

  const isValid = Object.keys(validationRules).every((field) => {
    const value = values[field]
    const rules = validationRules[field]
    
    if (rules.required && !value?.trim()) return false
    if (rules.minLength && value && value.length < rules.minLength) return false
    if (rules.username && value) {
      if (value.length < 3) return false
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return false
    }
    if (rules.password && value) {
      if (value.length < 6) return false
      if (!/[A-Z]/.test(value)) return false
      if (!/[a-z]/.test(value)) return false
      if (!/[0-9]/.test(value)) return false
    }
    if (rules.email && value) {
      // For account field, check if it's an email format
      if (field === 'account' && value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return false
      }
      // For email field, always check email format
      else if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return false
      }
    }
    if (rules.match && value && value !== values[rules.match]) return false
    
    return true
  })

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setIsSubmitting,
    getFieldError,
    emailSuggestions,
    showSuggestions,
    handleSuggestionClick,
    handleSuggestionsMouseEnter,
    handleSuggestionsMouseLeave,
  }
}