// contact-api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api"

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message?: string
  data?: any
  statusCode?: number
}

// Submit contact form with timeout and abort support
export async function submitContactForm(
  contactData: ContactFormData,
  timeoutMs: number = 30000
): Promise<ContactResponse> {
  // Validate input before sending
  if (!contactData.name?.trim()) {
    return {
      success: false,
      message: "Name is required",
      statusCode: 400
    }
  }
  
  if (!contactData.email?.trim() || !isValidEmail(contactData.email)) {
    return {
      success: false,
      message: "Valid email is required",
      statusCode: 400
    }
  }
  
  if (!contactData.message?.trim()) {
    return {
      success: false,
      message: "Message is required",
      statusCode: 400
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch {
        try {
          const textError = await response.text()
          if (textError) {
            errorMessage = textError
          }
        } catch {
          // Use default error message
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        statusCode: response.status
      }
    }

    let data
    try {
      data = await response.json()
    } catch {
      return {
        success: false,
        message: "Invalid response from server",
        statusCode: 500
      }
    }

    return {
      success: true,
      data: data,
      message: data?.message || "Form submitted successfully",
      statusCode: response.status
    }
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: `Request timed out after ${timeoutMs/1000} seconds. Please try again.`,
        statusCode: 408
      }
    }
    
    return {
      success: false,
      message: "Network error: Unable to reach the server. Please check your internet connection.",
      statusCode: 500
    }
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function submitContactFormWithRetry(
  contactData: ContactFormData,
  maxRetries: number = 3
): Promise<ContactResponse> {
  let lastError: ContactResponse | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await submitContactForm(contactData)
    
    if (result.success) {
      return result
    }
    
    lastError = result
    
    if (result.statusCode === 400) {
      return result
    }
    
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return lastError || {
    success: false,
    message: "Failed after multiple attempts",
    statusCode: 500
  }
}