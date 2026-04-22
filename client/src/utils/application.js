import { getDaysUntil, getTodayDate } from './date'

function cleanText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

export function buildEmptyApplicationForm() {
  return {
    companyName: '',
    roleTitle: '',
    applicationLink: '',
    dateApplied: getTodayDate(),
    status: 'Applied',
    nextAction: '',
    followUpDate: '',
    notes: '',
    recruiter: {
      name: '',
      email: '',
      outreachDate: '',
      method: 'Email',
      responseStatus: 'No reply'
    }
  }
}

export function buildFormStateFromApplication(application) {
  if (!application) {
    return buildEmptyApplicationForm()
  }

  const emptyForm = buildEmptyApplicationForm()

  return {
    ...emptyForm,
    ...application,
    recruiter: {
      ...emptyForm.recruiter,
      ...application.recruiter
    }
  }
}

export function buildSubmissionPayload(formData) {
  return {
    companyName: cleanText(formData.companyName),
    roleTitle: cleanText(formData.roleTitle),
    applicationLink: cleanText(formData.applicationLink),
    dateApplied: cleanText(formData.dateApplied),
    status: cleanText(formData.status) || 'Applied',
    nextAction: cleanText(formData.nextAction),
    followUpDate: cleanText(formData.followUpDate),
    notes: cleanText(formData.notes),
    recruiter: {
      name: cleanText(formData.recruiter?.name),
      email: cleanText(formData.recruiter?.email),
      outreachDate: cleanText(formData.recruiter?.outreachDate),
      method: cleanText(formData.recruiter?.method) || 'Email',
      responseStatus: cleanText(formData.recruiter?.responseStatus) || 'No reply'
    }
  }
}

export function getFilteredApplications(applications, statusFilter, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return [...applications]
    .filter((application) => {
      if (statusFilter === 'All') {
        return true
      }

      return application.status === statusFilter
    })
    .filter((application) => {
      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        application.companyName,
        application.roleTitle,
        application.nextAction,
        application.notes,
        application.recruiter?.name,
        application.recruiter?.email
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
    .sort((firstApplication, secondApplication) => {
      const dateComparison = (secondApplication.dateApplied || '').localeCompare(firstApplication.dateApplied || '')

      if (dateComparison !== 0) {
        return dateComparison
      }

      return (secondApplication.updatedAt || '').localeCompare(firstApplication.updatedAt || '')
    })
}

export function getApplicationStats(applications) {
  const interviews = applications.filter((application) => application.status === 'Interviewing').length
  const offers = applications.filter((application) => application.status === 'Offer').length
  const followUpsNeeded = applications.filter((application) => {
    if (application.status === 'Rejected') {
      return false
    }

    const daysUntil = getDaysUntil(application.followUpDate)

    return application.recruiter?.responseStatus === 'Follow-up needed' || (daysUntil !== null && daysUntil <= 2)
  }).length

  return [
    {
      label: 'Total applications',
      value: applications.length,
      helper: 'Everything in the tracker'
    },
    {
      label: 'Interviews',
      value: interviews,
      helper: 'Roles moving forward'
    },
    {
      label: 'Offers',
      value: offers,
      helper: 'Best outcomes so far'
    },
    {
      label: 'Follow-ups needed',
      value: followUpsNeeded,
      helper: 'Things to revisit soon'
    }
  ]
}

export function getReminderItems(applications) {
  return applications
    .filter((application) => {
      if (!application.followUpDate || application.status === 'Rejected') {
        return false
      }

      return true
    })
    .map((application) => {
      const daysUntil = getDaysUntil(application.followUpDate)

      return {
        id: application.id,
        companyName: application.companyName,
        roleTitle: application.roleTitle,
        followUpDate: application.followUpDate,
        recruiterName: application.recruiter?.name || 'No recruiter logged',
        nextAction: application.nextAction || 'Follow up on this application.',
        daysUntil,
        isOverdue: daysUntil !== null && daysUntil < 0
      }
    })
    .sort((firstReminder, secondReminder) => {
      return (firstReminder.followUpDate || '').localeCompare(secondReminder.followUpDate || '')
    })
}

export function getFollowUpLabel(followUpDate) {
  if (!followUpDate) {
    return 'No reminder set'
  }

  const daysUntil = getDaysUntil(followUpDate)

  if (daysUntil === null) {
    return 'Reminder date unavailable'
  }

  if (daysUntil < 0) {
    return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} overdue`
  }

  if (daysUntil === 0) {
    return 'Due today'
  }

  if (daysUntil === 1) {
    return 'Due tomorrow'
  }

  return `Due in ${daysUntil} days`
}

export function getStatusTone(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

export function getResponseTone(responseStatus) {
  return responseStatus.toLowerCase().replace(/\s+/g, '-')
}
