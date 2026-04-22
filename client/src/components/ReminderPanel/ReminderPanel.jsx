import { formatDisplayDate } from '../../utils/date'
import './ReminderPanel.css'

export function ReminderPanel({ reminders }) {
  const visibleReminders = reminders.slice(0, 5)

  return (
    <section className="reminder-panel">
      <div className="reminder-panel__header">
        <div>
          <p className="reminder-panel__eyebrow">Reminder queue</p>
          <h2 className="reminder-panel__title">Follow-ups to watch</h2>
        </div>
      </div>

      {visibleReminders.length ? (
        <div className="reminder-panel__list">
          {visibleReminders.map((reminder) => (
            <article className={`reminder-panel__item ${reminder.isOverdue ? 'reminder-panel__item--overdue' : ''}`} key={reminder.id}>
              <div className="reminder-panel__item-header">
                <div>
                  <h3 className="reminder-panel__company">{reminder.companyName}</h3>
                  <p className="reminder-panel__role">{reminder.roleTitle}</p>
                </div>
                <span className={`reminder-panel__badge ${reminder.isOverdue ? 'reminder-panel__badge--overdue' : 'reminder-panel__badge--upcoming'}`}>
                  {reminder.isOverdue ? 'Overdue' : 'Upcoming'}
                </span>
              </div>

              <p className="reminder-panel__action">{reminder.nextAction}</p>

              <div className="reminder-panel__item-meta">
                <span>{formatDisplayDate(reminder.followUpDate)}</span>
                <span>{reminder.recruiterName}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="reminder-panel__empty-copy">No follow-up dates yet. Add one when you want the tracker to surface reminders automatically.</p>
      )}
    </section>
  )
}
