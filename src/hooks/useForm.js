"use client"

import { useState } from "react"

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field]
      const value = values[field]

      if (rules.required && !value?.trim()) {
        newErrors[field] = `${field} is required`
      } else if (rules.minLength && value?.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`
      } else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field] = "Please enter a valid email"
      } else if (rules.match && value !== values[rules.match]) {
        newErrors[field] = "Passwords do not match"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (onSubmit) => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = Object.values(values).every((value) => value?.toString().trim() !== "")

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    setValues,
    setIsSubmitting,
  }
}
