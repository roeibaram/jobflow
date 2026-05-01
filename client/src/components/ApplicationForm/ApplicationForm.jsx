import { useEffect, useState } from 'react'
import { formStatusOptions, outreachMethodOptions, responseStatusOptions } from '../../constants/options'
import { buildEmptyApplicationForm, buildFormStateFromApplication, buildSubmissionPayload } from '../../utils/application'
import './ApplicationForm.css'

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

function getErrorKey(name, section) {
  if (section === 'recruiter' && name === 'email') {
    return 'recruiterEmail'
  }

  return name
}

function getFieldErrorMessage(fieldKey, payload) {
  if (fieldKey === 'companyName' && !payload.companyName) {
    return 'Company name is required.'
  }

  if (fieldKey === 'roleTitle' && !payload.roleTitle) {
    return 'Role title is required.'
  }

  if (fieldKey === 'dateApplied' && !payload.dateApplied) {
    return 'Date applied is required.'
  }

  if (fieldKey === 'applicationLink' && !isValidUrl(payload.applicationLink)) {
    return 'Add a valid URL that starts with http:// or https://.'
  }

  if (fieldKey === 'recruiterEmail' && !isValidEmail(payload.recruiter.email)) {
    return 'Recruiter email needs a valid format.'
  }

  if (fieldKey === 'nextAction' && payload.followUpDate && !payload.nextAction) {
    return 'Add a short next step if you set a follow-up date.'
  }

  return ''
}

export function ApplicationForm({ applicationToEdit, isSubmitting, onSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState(buildEmptyApplicationForm())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(buildFormStateFromApplication(applicationToEdit))
    setErrors({})
  }, [applicationToEdit])

  function handleFieldChange(event) {
    const { name, value, dataset } = event.target
    const errorKey = getErrorKey(name, dataset.section)

    if (dataset.section === 'recruiter') {
      setFormData((currentFormData) => ({
        ...currentFormData,
        recruiter: {
          ...currentFormData.recruiter,
          [name]: value
        }
      }))
    } else {
      setFormData((currentFormData) => ({
        ...currentFormData,
        [name]: value
      }))
    }

    setErrors((currentErrors) => {
      if (!currentErrors[errorKey] && !currentErrors.nextAction) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[errorKey]

      if (name === 'followUpDate' || name === 'nextAction') {
        delete nextErrors.nextAction
      }

      return nextErrors
    })
  }

  function handleFieldBlur(event) {
    const { name, dataset } = event.target
    const errorKey = getErrorKey(name, dataset.section)
    const payload = buildSubmissionPayload(formData)
    const fieldError = getFieldErrorMessage(errorKey, payload)

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }

      if (fieldError) {
        nextErrors[errorKey] = fieldError
      } else {
        delete nextErrors[errorKey]
      }

      if (name === 'followUpDate' || name === 'nextAction') {
        const nextActionError = getFieldErrorMessage('nextAction', payload)

        if (nextActionError) {
          nextErrors.nextAction = nextActionError
        } else {
          delete nextErrors.nextAction
        }
      }

      return nextErrors
    })
  }

  function validateForm(payload) {
    const nextErrors = {}
    const fieldKeys = ['companyName', 'roleTitle', 'dateApplied', 'applicationLink', 'recruiterEmail', 'nextAction']

    fieldKeys.forEach((fieldKey) => {
      const errorMessage = getFieldErrorMessage(fieldKey, payload)

      if (errorMessage) {
        nextErrors[fieldKey] = errorMessage
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function getInputClassName(errorKey) {
    return `application-form__input${errors[errorKey] ? ' application-form__input--invalid' : ''}`
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = buildSubmissionPayload(formData)

    if (!validateForm(payload)) {
      return
    }

    try {
      await onSubmit(payload)

      if (!applicationToEdit) {
        setFormData(buildEmptyApplicationForm())
      }
    } catch (error) {
      if (error.details) {
        setErrors(error.details)
      }
    }
  }

  function handleSecondaryAction() {
    if (applicationToEdit) {
      onCancelEdit()
      return
    }

    setFormData(buildEmptyApplicationForm())
    setErrors({})
  }

  return (
    <section className="application-form">
      <div className="application-form__header">
        <div>
          <p className="application-form__eyebrow">Editor</p>
          <h2 className="application-form__title">{applicationToEdit ? 'Edit application' : 'Add a new application'}</h2>
        </div>
        {applicationToEdit ? <span className="application-form__editing-badge">Editing mode</span> : null}
      </div>

      <form className="application-form__form" onSubmit={handleSubmit}>
        <div className="application-form__section">
          <h3 className="application-form__section-title">Application details</h3>

          <div className="application-form__grid">
            <label className="application-form__field">
              <span className="application-form__label">Company name</span>
              <input
                className={getInputClassName('companyName')}
                type="text"
                name="companyName"
                value={formData.companyName}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.companyName)}
              />
              {errors.companyName ? <span className="application-form__error">{errors.companyName}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Role title</span>
              <input
                className={getInputClassName('roleTitle')}
                type="text"
                name="roleTitle"
                value={formData.roleTitle}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.roleTitle)}
              />
              {errors.roleTitle ? <span className="application-form__error">{errors.roleTitle}</span> : null}
            </label>

            <label className="application-form__field application-form__field--full">
              <span className="application-form__label">Application link</span>
              <input
                className={getInputClassName('applicationLink')}
                type="url"
                name="applicationLink"
                placeholder="https://company.com/careers/role"
                value={formData.applicationLink}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.applicationLink)}
              />
              {errors.applicationLink ? <span className="application-form__error">{errors.applicationLink}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Date applied</span>
              <input
                className={getInputClassName('dateApplied')}
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.dateApplied)}
              />
              {errors.dateApplied ? <span className="application-form__error">{errors.dateApplied}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Status</span>
              <select className={getInputClassName('status')} name="status" value={formData.status} onChange={handleFieldChange}>
                {formStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="application-form__section">
          <h3 className="application-form__section-title">Follow-up</h3>

          <div className="application-form__grid">
            <label className="application-form__field application-form__field--full">
              <span className="application-form__label">Next step</span>
              <input
                className={getInputClassName('nextAction')}
                type="text"
                name="nextAction"
                placeholder="Send follow-up email, prep for interview, or check in next week"
                value={formData.nextAction}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.nextAction)}
              />
              {errors.nextAction ? <span className="application-form__error">{errors.nextAction}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Follow-up date</span>
              <input
                className={getInputClassName('followUpDate')}
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.followUpDate || errors.nextAction)}
              />
            </label>
          </div>
        </div>

        <div className="application-form__section">
          <h3 className="application-form__section-title">Recruiter / outreach</h3>

          <div className="application-form__grid">
            <label className="application-form__field">
              <span className="application-form__label">Recruiter name</span>
              <input className={getInputClassName('name')} type="text" name="name" data-section="recruiter" value={formData.recruiter.name} onChange={handleFieldChange} />
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Recruiter email</span>
              <input
                className={getInputClassName('recruiterEmail')}
                type="email"
                name="email"
                data-section="recruiter"
                value={formData.recruiter.email}
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.recruiterEmail)}
              />
              {errors.recruiterEmail ? <span className="application-form__error">{errors.recruiterEmail}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Outreach date</span>
              <input className={getInputClassName('outreachDate')} type="date" name="outreachDate" data-section="recruiter" value={formData.recruiter.outreachDate} onChange={handleFieldChange} />
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Outreach method</span>
              <select className={getInputClassName('method')} name="method" data-section="recruiter" value={formData.recruiter.method} onChange={handleFieldChange}>
                {outreachMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>

            <label className="application-form__field application-form__field--full">
              <span className="application-form__label">Response status</span>
              <select className={getInputClassName('responseStatus')} name="responseStatus" data-section="recruiter" value={formData.recruiter.responseStatus} onChange={handleFieldChange}>
                {responseStatusOptions.map((responseStatus) => (
                  <option key={responseStatus} value={responseStatus}>
                    {responseStatus}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="application-form__section">
          <label className="application-form__field application-form__field--full">
            <span className="application-form__label">Notes</span>
            <textarea
              className="application-form__textarea"
              name="notes"
              rows="5"
              placeholder="Interview prep ideas, context about the company, or anything you want to remember later."
              value={formData.notes}
              onChange={handleFieldChange}
            />
          </label>
        </div>

        <div className="application-form__actions">
          <button className="application-form__button application-form__button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : applicationToEdit ? 'Save changes' : 'Add application'}
          </button>
          <button className="application-form__button application-form__button--secondary" type="button" onClick={handleSecondaryAction}>
            {applicationToEdit ? 'Cancel edit' : 'Clear form'}
          </button>
        </div>
      </form>
    </section>
  )
}
