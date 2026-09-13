export const statusFilterOptions = ['All', 'Applied', 'Interviewing', 'Rejected', 'Offer', 'Saved']

export const applicationSortOptions = [
  { value: 'recent', label: 'Newest applied' },
  { value: 'followUp', label: 'Follow-up date' },
  { value: 'company', label: 'Company A-Z' }
]

export const formStatusOptions = statusFilterOptions.filter((status) => status !== 'All')

export const outreachMethodOptions = ['Email', 'LinkedIn', 'Phone', 'Referral', 'Other']

export const responseStatusOptions = ['No reply', 'Replied', 'Follow-up needed']
