export const applicationStatusOptions = ['Applied', 'Interviewing', 'Rejected', 'Offer', 'Saved']
export const outreachMethodOptions = ['Email', 'LinkedIn', 'Phone', 'Referral', 'Other']
export const responseStatusOptions = ['No reply', 'Replied', 'Follow-up needed']

function cleanString(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function isValidDate(dateString) {
  if (!dateString) {
    return true
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
}

function isValidUrl(value) {
  if (!value) {
    return true
  }

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function isValidEmail(value) {
  if (!value) {
    return true
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function normalizeApplicationPayload(payload = {}) {
  return {
    companyName: cleanString(payload.companyName),
    roleTitle: cleanString(payload.roleTitle),
    applicationLink: cleanString(payload.applicationLink),
    dateApplied: cleanString(payload.dateApplied),
    status: cleanString(payload.status) || 'Applied',
    nextAction: cleanString(payload.nextAction),
    followUpDate: cleanString(payload.followUpDate),
    notes: cleanString(payload.notes),
    recruiter: {
      name: cleanString(payload.recruiter?.name),
      email: cleanString(payload.recruiter?.email),
      outreachDate: cleanString(payload.recruiter?.outreachDate),
      method: cleanString(payload.recruiter?.method) || 'Email',
      responseStatus: cleanString(payload.recruiter?.responseStatus) || 'No reply'
    }
  }
}

export function validateApplicationPayload(application) {
  const errors = {}

  if (!application.companyName) {
    errors.companyName = 'Company name is required.'
  }

  if (!application.roleTitle) {
    errors.roleTitle = 'Role title is required.'
  }

  if (!application.dateApplied) {
    errors.dateApplied = 'Date applied is required.'
  }

  if (!applicationStatusOptions.includes(application.status)) {
    errors.status = 'Status must be one of the supported application states.'
  }

  if (!isValidDate(application.dateApplied)) {
    errors.dateApplied = 'Date applied must use the YYYY-MM-DD format.'
  }

  if (!isValidDate(application.followUpDate)) {
    errors.followUpDate = 'Follow-up date must use the YYYY-MM-DD format.'
  }

  if (!isValidDate(application.recruiter.outreachDate)) {
    errors.outreachDate = 'Outreach date must use the YYYY-MM-DD format.'
  }

  if (!outreachMethodOptions.includes(application.recruiter.method)) {
    errors.method = 'Outreach method must be one of the supported options.'
  }

  if (!responseStatusOptions.includes(application.recruiter.responseStatus)) {
    errors.responseStatus = 'Response status must be one of the supported options.'
  }

  if (!isValidUrl(application.applicationLink)) {
    errors.applicationLink = 'Application link must be a valid URL.'
  }

  if (!isValidEmail(application.recruiter.email)) {
    errors.recruiterEmail = 'Recruiter email must be valid.'
  }

  if (application.followUpDate && !application.nextAction) {
    errors.nextAction = 'Add the action you want to take on that follow-up date.'
  }

  return errors
}
