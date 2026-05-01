const rawApiBaseUrl = import.meta.env.VITE_API_URL || ''
const apiBaseUrl = rawApiBaseUrl.trim().replace(/\/$/, '')

function buildApiUrl(path) {
  if (!apiBaseUrl) {
    return path
  }

  return `${apiBaseUrl}${path}`
}

const APPLICATIONS_URL = buildApiUrl('/api/applications')

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong while saving your changes.')
    error.details = data.details || null
    throw error
  }

  return data
}

export function getApplications() {
  return request(APPLICATIONS_URL)
}

export function createApplication(application) {
  return request(APPLICATIONS_URL, {
    method: 'POST',
    body: JSON.stringify(application)
  })
}

export function updateApplication(id, application) {
  return request(`${APPLICATIONS_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(application)
  })
}

export function deleteApplication(id) {
  return request(`${APPLICATIONS_URL}/${id}`, {
    method: 'DELETE'
  })
}
