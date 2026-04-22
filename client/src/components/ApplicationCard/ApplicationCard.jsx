import { formatDisplayDate } from '../../utils/date'
import { getFollowUpLabel, getResponseTone, getStatusTone } from '../../utils/application'
import './ApplicationCard.css'

function getCompanyInitials(companyName) {
  return companyName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function ApplicationCard({ application, onEdit, onDelete }) {
  const statusTone = getStatusTone(application.status)
  const responseTone = getResponseTone(application.recruiter?.responseStatus || 'No reply')
  const followUpLabel = getFollowUpLabel(application.followUpDate)

  return (
    <article className="application-card">
      <div className="application-card__header">
        <div className="application-card__identity">
          <span className="application-card__avatar">{getCompanyInitials(application.companyName)}</span>

          <div>
            <div className="application-card__title-row">
              <h3 className="application-card__company">{application.companyName}</h3>
              <span className={`application-card__status application-card__status--${statusTone}`}>{application.status}</span>
            </div>

            <p className="application-card__role">{application.roleTitle}</p>
            <p className="application-card__meta">Applied {formatDisplayDate(application.dateApplied)}</p>
          </div>
        </div>

        <div className="application-card__actions">
          <button type="button" className="application-card__button application-card__button--secondary" onClick={() => onEdit(application)}>
            Edit
          </button>
          <button type="button" className="application-card__button application-card__button--danger" onClick={() => onDelete(application.id)}>
            Delete
          </button>
        </div>
      </div>

      <div className="application-card__body">
        <div className="application-card__detail-grid">
          <div className="application-card__detail-item">
            <span className="application-card__detail-label">Application link</span>
            {application.applicationLink ? (
              <a className="application-card__detail-link" href={application.applicationLink} target="_blank" rel="noreferrer">
                Open posting
              </a>
            ) : (
              <span className="application-card__detail-text">No link saved</span>
            )}
          </div>

          <div className="application-card__detail-item">
            <span className="application-card__detail-label">Recruiter</span>
            <span className="application-card__detail-text">{application.recruiter?.name || 'No recruiter logged'}</span>
          </div>

          <div className="application-card__detail-item">
            <span className="application-card__detail-label">Outreach status</span>
            <span className={`application-card__response application-card__response--${responseTone}`}>
              {application.recruiter?.responseStatus || 'No reply'}
            </span>
          </div>

          <div className="application-card__detail-item">
            <span className="application-card__detail-label">Follow-up</span>
            <span className={`application-card__detail-text ${followUpLabel.includes('overdue') ? 'application-card__detail-text--alert' : ''}`}>
              {followUpLabel}
            </span>
          </div>
        </div>

        <div className="application-card__focus-block">
          <span className="application-card__detail-label">Next step</span>
          <p className="application-card__focus-copy">{application.nextAction || 'No next step written yet.'}</p>
        </div>

        <div className="application-card__notes-block">
          <span className="application-card__detail-label">Notes</span>
          <p className="application-card__notes">{application.notes || 'No notes yet.'}</p>
        </div>
      </div>
    </article>
  )
}
