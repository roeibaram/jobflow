import './DashboardHeader.css'

export function DashboardHeader() {
  return (
    <section className="dashboard-header">
      <div className="dashboard-header__content">
        <p className="dashboard-header__eyebrow">Jobflow</p>
        <h1 className="dashboard-header__title">Keep your applications, recruiter outreach, and next steps in one place.</h1>
        <p className="dashboard-header__description">
          This version is intentionally still in progress. The core tracking flow works, the layout is clean, and follow-up reminders are starting to make the app feel useful.
        </p>
      </div>

      <div className="dashboard-header__highlights">
        <article className="dashboard-header__highlight-card">
          <span className="dashboard-header__highlight-label">What works now</span>
          <p className="dashboard-header__highlight-copy">Add roles, keep recruiter details attached, update statuses, and set a next step without bouncing between notes apps.</p>
        </article>

        <article className="dashboard-header__highlight-card">
          <span className="dashboard-header__highlight-label">What still feels unfinished</span>
          <p className="dashboard-header__highlight-copy">There is room for stronger insights, deeper detail views, and better analytics later. Right now it is a solid MVP foundation.</p>
        </article>
      </div>
    </section>
  )
}
