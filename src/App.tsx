import { useState } from 'react'

interface NavSection {
  id: string
  label: string
  description: string
}

const NAV_SECTIONS: NavSection[] = [
  { id: 'overview', label: 'Overview', description: 'Team activity and pipeline health at a glance' },
  { id: 'leads', label: 'Leads', description: 'Every lead, organized and searchable' },
  { id: 'conversations', label: 'Conversations', description: 'Messages across all channels in one place' },
  { id: 'pipeline', label: 'Pipeline', description: 'Track opportunities from new to closed' },
  { id: 'automations', label: 'Automations', description: 'Follow-up and qualification workflows' },
  { id: 'appointments', label: 'Appointments', description: 'Scheduled viewings and calls' },
  { id: 'analytics', label: 'Analytics', description: 'Conversion and response-time reporting' },
]

function App() {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false)

  const activeNav = NAV_SECTIONS.find((section) => section.id === activeSection) ?? NAV_SECTIONS[0]

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileNavOpen(false)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="nav-toggle"
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>

          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              EF
            </span>
            <div className="brand-text">
              <span className="brand-name">EstateFlow AI</span>
              <span className="brand-subtitle">Lead operations workspace</span>
            </div>
          </div>
        </div>

        <div className="topbar-right">
          <button type="button" className="status-button" aria-label="View notifications">
            <span className="status-dot" aria-hidden="true" />
            <span className="status-label">3 updates</span>
          </button>

          <div className="user-area">
            <span className="user-avatar" aria-hidden="true">
              AK
            </span>
            <div className="user-meta">
              <span className="user-name">Adaeze Kalu</span>
              <span className="user-role">Team Lead</span>
            </div>
          </div>
        </div>
      </header>

      <div className="app-body">
        <nav
          id="primary-navigation"
          className={`sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}
          aria-label="Primary"
        >
          <ul className="nav-list">
            {NAV_SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`nav-item ${section.id === activeSection ? 'nav-item-active' : ''}`}
                  aria-current={section.id === activeSection ? 'page' : undefined}
                  onClick={() => handleSelectSection(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="sidebar-footer">
            <div className="org-card">
              <span className="org-name">Lagos Prime Realty</span>
              <span className="org-plan">Team plan</span>
            </div>
          </div>
        </nav>

        {isMobileNavOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        <main id="main-content" className="workspace">
          <div className="workspace-header">
            <div>
              <h1 className="workspace-title">{activeNav.label}</h1>
              <p className="workspace-description">{activeNav.description}</p>
            </div>
          </div>

          <section className="workspace-content" aria-label={`${activeNav.label} module`}>
            <div className="placeholder-panel">
              <h2 className="placeholder-title">This module is under construction</h2>
              <p className="placeholder-text">
                The {activeNav.label.toLowerCase()} module will live here. Once connected, this
                space will show real lead and pipeline data for your team instead of a
                placeholder.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
            
