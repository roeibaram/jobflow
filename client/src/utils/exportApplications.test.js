import assert from 'node:assert/strict'
import test from 'node:test'
import { createApplicationsCsv } from './exportApplications.js'

test('exports every application and recruiter field with CSV escaping', () => {
  const csv = createApplicationsCsv([{
    companyName: 'Acme, Inc.',
    roleTitle: 'Engineer "II"',
    applicationLink: 'https://example.com/jobs/1',
    dateApplied: '2026-10-01',
    status: 'Interviewing',
    nextAction: 'Send a thank-you note',
    followUpDate: '2026-10-08',
    notes: 'First line\nSecond line',
    recruiter: {
      name: 'Rae Recruiter',
      email: 'rae@example.com',
      outreachDate: '2026-10-02',
      method: 'Email',
      responseStatus: 'Replied'
    }
  }])

  const [header, application] = csv.split('\r\n')

  assert.equal(
    header,
    '"Company","Role","Application link","Date applied","Status","Next action","Follow-up date","Notes","Recruiter name","Recruiter email","Outreach date","Outreach method","Response status"'
  )
  assert.equal(
    application,
    '"Acme, Inc.","Engineer ""II""","https://example.com/jobs/1","2026-10-01","Interviewing","Send a thank-you note","2026-10-08","First line\nSecond line","Rae Recruiter","rae@example.com","2026-10-02","Email","Replied"'
  )
})

test('neutralizes spreadsheet formulas and leaves missing values blank', () => {
  const csv = createApplicationsCsv([
    { companyName: '=HYPERLINK("https://example.com","Open")' },
    { companyName: '  @SUM(1,1)' }
  ])
  const rows = csv.split('\r\n')
  const emptyFields = Array(12).fill('""').join(',')

  assert.equal(
    rows[1],
    `"'=HYPERLINK(""https://example.com"",""Open"")",${emptyFields}`
  )
  assert.equal(rows[2], `"'  @SUM(1,1)",${emptyFields}`)
})

test('rejects invalid input rather than exporting a misleading file', () => {
  assert.throws(() => createApplicationsCsv(null), {
    name: 'TypeError',
    message: 'Applications must be an array.'
  })
})
