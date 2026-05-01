import { ApplicationCard } from '../ApplicationCard/ApplicationCard'
import { EmptyState } from '../EmptyState/EmptyState'
import './ApplicationList.css'

export function ApplicationList({ applications, hasSearchOrFilter, onClearFilters, onEdit, onDelete }) {
  if (!applications.length) {
    return <EmptyState hasSearchOrFilter={hasSearchOrFilter} onClearFilters={onClearFilters} />
  }

  return (
    <div className="application-list">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
