

// ponytail: single role, so the data lives here instead of a data/ module.
const roles = [
  {
    title: 'Information Technology Technician',
    org: 'Ameri-tide',
    type: 'Part-time · Hybrid',
    period: 'Aug 2026 to Present',
    location: 'Bellevue, WA',
    summary:
      'Advise on and implement network solutions that deliver reliable connectivity while keeping private financial information secure.',
    points: [
      'Segmented the network with VLANs and dedicated SSIDs so guests and unauthorized users cannot reach or intercept client financial data, and secured wireless access with WPA3-Enterprise authentication backed by RADIUS.',
      'Built Zapier workflows for AI email triage, consolidating multiple email providers into one centralized dashboard, plus a loan pipeline workflow tracking the assigned employee, last update, and current stage of every loan.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="content-section">
      <div className="section-header">
        <h2 className="section-title">
          Experience

        </h2>
        <div className="rule" />
      </div>

      {roles.map((role, i) => (
        <div key={role.org}>
          <article className="xp-card">
            <div className="xp-head">
              <h3 className="xp-title">{role.title}</h3>
              <span className="xp-period">{role.period}</span>
            </div>
            <p className="xp-meta">
              {role.org} · {role.type} · {role.location}
            </p>
            <p className="xp-summary">{role.summary}</p>
            <ul className="xp-points">
              {role.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        </div>
      ))}
    </section>
  )
}
