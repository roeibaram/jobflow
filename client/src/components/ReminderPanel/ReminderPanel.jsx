import { formatDisplayDate } from '../../utils/date'
import './ReminderPanel.css'

function getReminderTiming(reminder) {
  if (reminder.isOverdue) {
    return { label: 'Overdue', tone: 'overdue' }
  }

  if (reminder.daysUntil === 0) {
    return { label: 'Due today', tone: 'today' }
  }

  if (reminder.daysUntil === 1) {
    return { label: 'Tomorrow', tone: 'soon' }
  }

  if (typeof reminder.daysUntil === 'number') {
    return {
      label: `In ${reminder.daysUntil} days`,
      tone: reminder.daysUntil <= 3 ? 'soon' : 'upcoming'
    }
  }

  return { label: 'Upcoming', tone: 'upcoming' }
}

export function ReminderPanel({ reminders }) {
  const visibleReminders = reminders.slice(0, 5)
  const hiddenReminderCount = Math.max(0, reminders.length - visibleReminders.length)

  return (
    <section className="reminder-panel">
      <div className="reminder-panel__header">
        <div>
          <p className="reminder-panel__eyebrow">Reminder queue</p>
          <h2 className="reminder-panel__title">Follow-ups to watch</h2>
        </div>
      </div>

      {visibleReminders.length ? (
        <>
          <div className="reminder-panel__list">
            {visibleReminders.map((reminder) => {
              const timing = getReminderTiming(reminder)

              return (
                <article className={`reminder-panel__item reminder-panel__item--${timing.tone}`} key={reminder.id}>
                  <div className="reminder-panel__item-header">
                    <div>
                      <h3 className="reminder-panel__company">{reminder.companyName}</h3>
                      <p className="reminder-panel__role">{reminder.roleTitle}</p>
                    </div>
                    <span className={`reminder-panel__badge reminder-panel__badge--${timing.tone}`}>
                      {timing.label}
                    </span>
                  </div>

                  <p className="reminder-panel__action">{reminder.nextAction}</p>

                  <div className="reminder-panel__item-meta">
                    <span>{formatDisplayDate(reminder.followUpDate)}</span>
                    <span>{reminder.recruiterName}</span>
                  </div>
                </article>
              )
            })}
          </div>

          {hiddenReminderCount > 0 ? (
            <p className="reminder-panel__overflow">
              {hiddenReminderCount} more follow-up{hiddenReminderCount === 1 ? '' : 's'} waiting in the tracker.
            </p>
          ) : null}
        </>
      ) : (
        <p className="reminder-panel__empty-copy">No follow-up dates yet. Add one when you want the tracker to surface reminders automatically.</p>
      )}
    </section>
  )
}
