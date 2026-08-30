interface OverviewStat {
  id: string;
  label: string;
  value: number;
}

interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

const overviewStats: OverviewStat[] = [
  { id: "new-leads", label: "New Leads", value: 12 },
  { id: "active-conversations", label: "Active Conversations", value: 7 },
  { id: "scheduled-appointments", label: "Scheduled Appointments", value: 4 },
];

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    title: "New lead captured",
    detail: "Amara Okafor inquired about a 3-bedroom listing in Lekki.",
    time: "10 min ago",
  },
  {
    id: "2",
    title: "Conversation follow-up",
    detail: "David Chen replied regarding property viewing availability.",
    time: "42 min ago",
  },
  {
    id: "3",
    title: "Appointment scheduled",
    detail: "Site visit booked with the Adeyemi family for Thursday.",
    time: "2 hours ago",
  },
];

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            EF
          </span>
          <span className="brand-name">EstateFlow AI</span>
        </div>

        <nav className="main-nav" aria-label="Primary">
          <ul>
            <li>
              <a href="#overview" aria-current="page">
                Overview
              </a>
            </li>
            <li>
              <a href="#leads">Leads</a>
            </li>
            <li>
              <a href="#conversations">Conversations</a>
            </li>
            <li>
              <a href="#pipeline">Pipeline</a>
            </li>
            <li>
              <a href="#appointments">Appointments</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-primary">
            Add Lead
          </button>
        </div>
      </header>

      <main className="app-main" id="overview">
        <section className="welcome-section" aria-labelledby="welcome-heading">
          <h1 id="welcome-heading">EstateFlow AI</h1>
          <p className="subtitle">
            Real-estate lead operations, intelligently organized.
          </p>
        </section>

        <section className="stats-grid" aria-label="Overview statistics">
          {overviewStats.map((stat) => (
            <article className="stat-card" key={stat.id}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="activity-section" aria-labelledby="activity-heading">
          <div className="section-heading-row">
            <h2 id="activity-heading">Recent Activity</h2>
            <button type="button" className="btn btn-secondary">
              View All
            </button>
          </div>

          <ul className="activity-list">
            {recentActivity.map((item) => (
              <li className="activity-item" key={item.id}>
                <div className="activity-content">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-detail">{item.detail}</p>
                </div>
                <span className="activity-time">{item.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
      
