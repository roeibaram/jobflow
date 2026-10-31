import { getTodayDate } from './date.js'

const CSV_HEADERS = [
  'Company',
  'Role',
  'Application link',
  'Date applied',
  'Status',
  'Next action',
  'Follow-up date',
  'Notes',
  'Recruiter name',
  'Recruiter email',
  'Outreach date',
  'Outreach method',
  'Response status'
]

function escapeCsvValue(value) {
  const text = value == null ? '' : String(value)
  const safeText = /^[\s]*[=+\-@]/u.test(text) ? `'${text}` : text

  return `"${safeText.replaceAll('"', '""')}"`
}

function getApplicationValues(application) {
  return [
    application.companyName,
    application.roleTitle,
    application.applicationLink,
    application.dateApplied,
    application.status,
    application.nextAction,
    application.followUpDate,
    application.notes,
    application.recruiter?.name,
    application.recruiter?.email,
    application.recruiter?.outreachDate,
    application.recruiter?.method,
    application.recruiter?.responseStatus
  ]
}

export function createApplicationsCsv(applications) {
  if (!Array.isArray(applications)) {
    throw new TypeError('Applications must be an array.')
  }

  return [
    CSV_HEADERS,
    ...applications.map(getApplicationValues)
  ]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n')
}

export function downloadApplicationsCsv(applications) {
  const csv = createApplicationsCsv(applications)
  const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = `jobflow-applications-${getTodayDate()}.csv`
  link.hidden = true

  try {
    document.body.append(link)
    link.click()
  } finally {
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
