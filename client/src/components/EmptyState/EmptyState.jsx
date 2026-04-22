import './EmptyState.css'

export function EmptyState({ hasSearchOrFilter }) {
  return (
    <section className="empty-state">
      <div className="empty-state__icon">+</div>
      <h3 className="empty-state__title">{hasSearchOrFilter ? 'No opportunities match this view' : 'Your CRM is ready for the first opportunity'}</h3>
      <p className="empty-state__copy">
        {hasSearchOrFilter
          ? 'Try a different status filter or search term to widen the pipeline.'
          : 'Add your first role on the right, then use the weekly review to keep your search moving.'}
      </p>
    </section>
  )
}
