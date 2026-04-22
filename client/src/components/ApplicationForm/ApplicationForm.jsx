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

export function ApplicationForm({ applicationToEdit, isSubmitting, onSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState(buildEmptyApplicationForm())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(buildFormStateFromApplication(applicationToEdit))
    setErrors({})
  }, [applicationToEdit])

  function handleFieldChange(event) {
    const { name, value, dataset } = event.target

    if (dataset.section === 'recruiter') {
      setFormData((currentFormData) => ({
        ...currentFormData,
        recruiter: {
          ...currentFormData.recruiter,
          [name]: value
        }
      }))

      return
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }))
  }

  function validateForm(payload) {
    const nextErrors = {}

    if (!payload.companyName) {
      nextErrors.companyName = 'Company name is required.'
    }

    if (!payload.roleTitle) {
      nextErrors.roleTitle = 'Role title is required.'
    }

    if (!payload.dateApplied) {
      nextErrors.dateApplied = 'Date applied is required.'
    }

    if (!isValidUrl(payload.applicationLink)) {
      nextErrors.applicationLink = 'Add a valid URL that starts with http:// or https://.'
    }

    if (!isValidEmail(payload.recruiter.email)) {
      nextErrors.recruiterEmail = 'Recruiter email needs a valid format.'
    }

    if (payload.followUpDate && !payload.nextAction) {
      nextErrors.nextAction = 'Add a short next step if you set a follow-up date.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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
    } catch {
      // App-level errors are shown above the list.
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
              <input className="application-form__input" type="text" name="companyName" value={formData.companyName} onChange={handleFieldChange} />
              {errors.companyName ? <span className="application-form__error">{errors.companyName}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Role title</span>
              <input className="application-form__input" type="text" name="roleTitle" value={formData.roleTitle} onChange={handleFieldChange} />
              {errors.roleTitle ? <span className="application-form__error">{errors.roleTitle}</span> : null}
            </label>

            <label className="application-form__field application-form__field--full">
              <span className="application-form__label">Application link</span>
              <input className="application-form__input" type="url" name="applicationLink" placeholder="https://company.com/careers/role" value={formData.applicationLink} onChange={handleFieldChange} />
              {errors.applicationLink ? <span className="application-form__error">{errors.applicationLink}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Date applied</span>
              <input className="application-form__input" type="date" name="dateApplied" value={formData.dateApplied} onChange={handleFieldChange} />
              {errors.dateApplied ? <span className="application-form__error">{errors.dateApplied}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Status</span>
              <select className="application-form__input" name="status" value={formData.status} onChange={handleFieldChange}>
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
                className="application-form__input"
                type="text"
                name="nextAction"
                placeholder="Send follow-up email, prep for interview, or check in next week"
                value={formData.nextAction}
                onChange={handleFieldChange}
              />
              {errors.nextAction ? <span className="application-form__error">{errors.nextAction}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Follow-up date</span>
              <input className="application-form__input" type="date" name="followUpDate" value={formData.followUpDate} onChange={handleFieldChange} />
            </label>
          </div>
        </div>

        <div className="application-form__section">
          <h3 className="application-form__section-title">Recruiter / outreach</h3>

          <div className="application-form__grid">
            <label className="application-form__field">
              <span className="application-form__label">Recruiter name</span>
              <input className="application-form__input" type="text" name="name" data-section="recruiter" value={formData.recruiter.name} onChange={handleFieldChange} />
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Recruiter email</span>
              <input className="application-form__input" type="email" name="email" data-section="recruiter" value={formData.recruiter.email} onChange={handleFieldChange} />
              {errors.recruiterEmail ? <span className="application-form__error">{errors.recruiterEmail}</span> : null}
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Outreach date</span>
              <input className="application-form__input" type="date" name="outreachDate" data-section="recruiter" value={formData.recruiter.outreachDate} onChange={handleFieldChange} />
            </label>

            <label className="application-form__field">
              <span className="application-form__label">Outreach method</span>
              <select className="application-form__input" name="method" data-section="recruiter" value={formData.recruiter.method} onChange={handleFieldChange}>
                {outreachMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>

            <label className="application-form__field application-form__field--full">
              <span className="application-form__label">Response status</span>
              <select className="application-form__input" name="responseStatus" data-section="recruiter" value={formData.recruiter.responseStatus} onChange={handleFieldChange}>
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
