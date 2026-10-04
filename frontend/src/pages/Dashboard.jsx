import { useEffect, useState } from "react";

const API_URL = "https://incremental-web-data-updater.onrender.com";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [analyticsResponse, dataResponse, historyResponse] =
        await Promise.all([
          fetch(`${API_URL}/analytics`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/current-data`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/history`, {
            cache: "no-store",
          }),
        ]);

      const analyticsData = await analyticsResponse.json();
      const data = await dataResponse.json();
      const historyData = await historyResponse.json();

      setAnalytics(analyticsData);
      setCurrentData(data.records || []);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestChanges = history.slice(-5).reverse();

  const totalRecords = analytics?.total_records || 0;
  const newRecords = analytics?.new || 0;
  const changedRecords = analytics?.changed || 0;
  const removedRecords = analytics?.removed || 0;

  return (
    <div className="dashboard-page">

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-grid"></div>

        <div className="hero-content">

          <div className="hero-badge">
            <span className="pulse-dot"></span>
            LIVE DATA MONITORING
          </div>

          <h1>
            Track the web.
            <br />
            <span>Detect every change.</span>
          </h1>

          <p>
            Scrape public web data, compare it with previous versions,
            and understand what changed through one intelligent dashboard.
          </p>

          <div className="hero-actions">
            <a
              href="/scraper"
              className="hero-button primary"
            >
              Start Scraping
              <span>→</span>
            </a>

            <a
              href="/analytics"
              className="hero-button secondary"
            >
              View Analytics
            </a>
          </div>

        </div>

        <div className="hero-orbit orbit-one"></div>
        <div className="hero-orbit orbit-two"></div>
        <div className="hero-orbit orbit-three"></div>

      </section>


      {/* STAT CARDS */}
      <section className="stats-grid">

        <div className="stat-card cyan-card">

          <div className="stat-top">
            <span className="stat-label">
              CURRENT RECORDS
            </span>

            <span className="stat-icon">
              ◈
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : totalRecords}
          </div>

          <div className="stat-footer">
            <span className="stat-line"></span>
            Active records
          </div>

        </div>


        <div className="stat-card green-card">

          <div className="stat-top">
            <span className="stat-label">
              NEW RECORDS
            </span>

            <span className="stat-icon">
              +
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : newRecords}
          </div>

          <div className="stat-footer">
            <span className="stat-line"></span>
            Newly discovered
          </div>

        </div>


        <div className="stat-card purple-card">

          <div className="stat-top">
            <span className="stat-label">
              CHANGED
            </span>

            <span className="stat-icon">
              ↻
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : changedRecords}
          </div>

          <div className="stat-footer">
            <span className="stat-line"></span>
            Field modifications
          </div>

        </div>


        <div className="stat-card orange-card">

          <div className="stat-top">
            <span className="stat-label">
              REMOVED
            </span>

            <span className="stat-icon">
              −
            </span>
          </div>

          <div className="stat-number">
            {loading ? "—" : removedRecords}
          </div>

          <div className="stat-footer">
            <span className="stat-line"></span>
            No longer detected
          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}
      <section className="dashboard-content">

        {/* SYSTEM FLOW */}
        <div className="panel flow-panel">

          <div className="panel-header">

            <div>
              <span className="section-kicker">
                PIPELINE
              </span>

              <h2>
                Data Flow
              </h2>
            </div>

            <span className="live-label">
              ● LIVE
            </span>

          </div>


          <div className="flow">

            <div className="flow-node blue-node">
              <div className="flow-icon">
                ◉
              </div>

              <strong>
                Website
              </strong>

              <small>
                Public source
              </small>
            </div>

            <div className="flow-arrow">
              <span></span>
              →
            </div>

            <div className="flow-node purple-node">
              <div className="flow-icon">
                ◇
              </div>

              <strong>
                Scraper
              </strong>

              <small>
                Requests + BS4
              </small>
            </div>

            <div className="flow-arrow">
              <span></span>
              →
            </div>

            <div className="flow-node green-node">
              <div className="flow-icon">
                ▦
              </div>

              <strong>
                Dataset
              </strong>

              <small>
                Pandas
              </small>
            </div>

            <div className="flow-arrow">
              <span></span>
              →
            </div>

            <div className="flow-node orange-node">
              <div className="flow-icon">
                ↻
              </div>

              <strong>
                Tracker
              </strong>

              <small>
                Detect changes
              </small>
            </div>

          </div>

        </div>


        {/* QUICK OVERVIEW */}
        <div className="panel overview-panel">

          <div className="panel-header">

            <div>
              <span className="section-kicker">
                OVERVIEW
              </span>

              <h2>
                System Activity
              </h2>
            </div>

          </div>


          <div className="activity-bars">

            <div className="activity-item">
              <div className="activity-info">
                <span>New</span>
                <strong>{newRecords}</strong>
              </div>

              <div className="activity-track">
                <div
                  className="activity-fill new-fill"
                  style={{
                    width: `${Math.min(newRecords * 5, 100)}%`,
                  }}
                ></div>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-info">
                <span>Changed</span>
                <strong>{changedRecords}</strong>
              </div>

              <div className="activity-track">
                <div
                  className="activity-fill changed-fill"
                  style={{
                    width: `${Math.min(changedRecords * 5, 100)}%`,
                  }}
                ></div>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-info">
                <span>Removed</span>
                <strong>{removedRecords}</strong>
              </div>

              <div className="activity-track">
                <div
                  className="activity-fill removed-fill"
                  style={{
                    width: `${Math.min(removedRecords * 5, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* RECENT CHANGES */}
      <section className="panel recent-panel">

        <div className="panel-header">

          <div>
            <span className="section-kicker">
              ACTIVITY LOG
            </span>

            <h2>
              Recent Changes
            </h2>
          </div>

          <a
            href="/history"
            className="view-all"
          >
            View all →
          </a>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading activity...
          </div>

        ) : latestChanges.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">
              ◌
            </div>

            <h3>
              No changes yet
            </h3>

            <p>
              Run your first website update to start tracking changes.
            </p>
          </div>

        ) : (

          <div className="activity-table">

            {latestChanges.map((item, index) => (

              <div
                className="activity-row"
                key={`${item.timestamp}-${item.identity}-${index}`}
              >

                <div className="activity-status">
                  <span
                    className={`status-badge ${String(
                      item.status || ""
                    ).toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="activity-identity">
                  <strong>
                    {item.identity || "Unknown"}
                  </strong>

                  <span>
                    {item.field
                      ? `Field: ${item.field}`
                      : "Record activity"}
                  </span>
                </div>

                <div className="activity-date">
                  {item.timestamp}
                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* DATA PREVIEW */}
      <section className="panel data-preview">

        <div className="panel-header">

          <div>
            <span className="section-kicker">
              DATASET
            </span>

            <h2>
              Current Data Preview
            </h2>
          </div>

          <a
            href="/data"
            className="view-all"
          >
            Open dataset →
          </a>

        </div>


        {currentData.length === 0 ? (

          <div className="empty-state compact">
            No current data available.
          </div>

        ) : (

          <div className="mini-table-wrapper">

            <table className="mini-table">

              <thead>
                <tr>
                  {Object.keys(currentData[0])
                    .slice(0, 4)
                    .map((column) => (
                      <th key={column}>
                        {column}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>

                {currentData
                  .slice(0, 5)
                  .map((row, index) => (

                    <tr key={index}>

                      {Object.keys(currentData[0])
                        .slice(0, 4)
                        .map((column) => (

                          <td key={column}>
                            {String(
                              row[column] ?? ""
                            ).length > 80
                              ? `${String(
                                  row[column] ?? ""
                                ).slice(0, 80)}...`
                              : String(
                                  row[column] ?? ""
                                )}
                          </td>

                        ))}

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* FOOTER MESSAGE */}
      <div className="dashboard-note">

        <span>◆</span>

        <p>
          DataFlow monitors public web data and keeps a history
          of what changes over time.
        </p>

        <span>◆</span>

      </div>

    </div>
  );
}

export default Dashboard;