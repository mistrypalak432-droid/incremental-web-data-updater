import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);

    try {
      const [analyticsResponse, historyResponse] =
        await Promise.all([
          fetch(`${API_URL}/analytics`, {
            cache: "no-store",
          }),
          fetch(`${API_URL}/history`, {
            cache: "no-store",
          }),
        ]);

      const analyticsData =
        await analyticsResponse.json();

      const historyData =
        await historyResponse.json();

      setAnalytics(analyticsData);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error(
        "Unable to load analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const totalEvents =
    analytics?.total_changes || 0;

  const totalRecords =
    analytics?.total_records || 0;

  const newCount =
    analytics?.new || 0;

  const changedCount =
    analytics?.changed || 0;

  const removedCount =
    analytics?.removed || 0;

  const maxEventValue = Math.max(
    newCount,
    changedCount,
    removedCount,
    1
  );

  const percentages = useMemo(() => {
    if (!totalEvents) {
      return {
        new: 0,
        changed: 0,
        removed: 0,
      };
    }

    return {
      new: Math.round(
        (newCount / totalEvents) * 100
      ),
      changed: Math.round(
        (changedCount / totalEvents) * 100
      ),
      removed: Math.round(
        (removedCount / totalEvents) * 100
      ),
    };
  }, [
    totalEvents,
    newCount,
    changedCount,
    removedCount,
  ]);

  const fieldChanges = useMemo(() => {
    const counts = {};

    history
      .filter(
        (item) =>
          item.status === "CHANGED" &&
          item.field
      )
      .forEach((item) => {
        counts[item.field] =
          (counts[item.field] || 0) + 1;
      });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [history]);

  const maxFieldChanges = Math.max(
    ...fieldChanges.map(
      ([, count]) => count
    ),
    1
  );

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <section className="page-heading">

        <div>

          <span className="section-kicker">
            DATA INTELLIGENCE
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Understand the current dataset and the
            changes detected across scraping runs.
          </p>

        </div>

        <button
          type="button"
          className="refresh-button heading-refresh"
          onClick={loadAnalytics}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "↻ Refresh Analytics"}
        </button>

      </section>


      {/* TOP METRICS */}

      <section className="analytics-metrics">

        <div className="analytics-metric cyan-metric">

          <span>
            CURRENT RECORDS
          </span>

          <strong>
            {loading
              ? "—"
              : totalRecords}
          </strong>

          <small>
            Active dataset size
          </small>

        </div>


        <div className="analytics-metric green-metric">

          <span>
            NEW
          </span>

          <strong>
            {loading
              ? "—"
              : newCount}
          </strong>

          <small>
            Added records
          </small>

        </div>


        <div className="analytics-metric purple-metric">

          <span>
            CHANGED
          </span>

          <strong>
            {loading
              ? "—"
              : changedCount}
          </strong>

          <small>
            Modified records
          </small>

        </div>


        <div className="analytics-metric orange-metric">

          <span>
            REMOVED
          </span>

          <strong>
            {loading
              ? "—"
              : removedCount}
          </strong>

          <small>
            Removed records
          </small>

        </div>

      </section>


      {/* CHART AREA */}

      <section className="analytics-grid">

        {/* CHANGE DISTRIBUTION */}

        <div className="panel chart-panel">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                DISTRIBUTION
              </span>

              <h2>
                Change Breakdown
              </h2>

            </div>

            <span className="chart-total">
              {totalEvents} total
            </span>

          </div>


          <div className="donut-layout">

            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(
                  var(--cyan) 0 ${percentages.new}%,
                  var(--purple) ${percentages.new}% ${
                    percentages.new +
                    percentages.changed
                  }%,
                  var(--orange) ${
                    percentages.new +
                    percentages.changed
                  }% 100%
                )`,
              }}
            >
              <div className="donut-hole">

                <strong>
                  {totalEvents}
                </strong>

                <span>
                  events
                </span>

              </div>
            </div>


            <div className="chart-legend">

              <div className="legend-item">

                <span className="legend-color cyan"></span>

                <div>
                  <strong>
                    New
                  </strong>

                  <small>
                    {newCount} events
                  </small>
                </div>

                <b>
                  {percentages.new}%
                </b>

              </div>


              <div className="legend-item">

                <span className="legend-color purple"></span>

                <div>
                  <strong>
                    Changed
                  </strong>

                  <small>
                    {changedCount} events
                  </small>
                </div>

                <b>
                  {percentages.changed}%
                </b>

              </div>


              <div className="legend-item">

                <span className="legend-color orange"></span>

                <div>
                  <strong>
                    Removed
                  </strong>

                  <small>
                    {removedCount} events
                  </small>
                </div>

                <b>
                  {percentages.removed}%
                </b>

              </div>

            </div>

          </div>

        </div>


        {/* BAR CHART */}

        <div className="panel chart-panel">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                ACTIVITY
              </span>

              <h2>
                Event Volume
              </h2>

            </div>

          </div>


          <div className="bar-chart">

            <div className="chart-y-labels">

              <span>
                {maxEventValue}
              </span>

              <span>
                {Math.round(
                  maxEventValue / 2
                )}
              </span>

              <span>
                0
              </span>

            </div>


            <div className="bars-area">

              <div className="grid-line top"></div>
              <div className="grid-line middle"></div>
              <div className="grid-line bottom"></div>


              <div className="bar-group">

                <div className="bar-wrapper">

                  <div
                    className="chart-bar new-bar"
                    style={{
                      height: `${
                        (newCount /
                          maxEventValue) *
                        100
                      }%`,
                    }}
                  >
                    <span>
                      {newCount}
                    </span>
                  </div>

                </div>

                <small>
                  New
                </small>

              </div>


              <div className="bar-group">

                <div className="bar-wrapper">

                  <div
                    className="chart-bar changed-bar"
                    style={{
                      height: `${
                        (changedCount /
                          maxEventValue) *
                        100
                      }%`,
                    }}
                  >
                    <span>
                      {changedCount}
                    </span>
                  </div>

                </div>

                <small>
                  Changed
                </small>

              </div>


              <div className="bar-group">

                <div className="bar-wrapper">

                  <div
                    className="chart-bar removed-bar"
                    style={{
                      height: `${
                        (removedCount /
                          maxEventValue) *
                        100
                      }%`,
                    }}
                  >
                    <span>
                      {removedCount}
                    </span>
                  </div>

                </div>

                <small>
                  Removed
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FIELD CHANGES */}

      <section className="panel field-analysis-panel">

        <div className="panel-header">

          <div>

            <span className="section-kicker">
              FIELD ANALYSIS
            </span>

            <h2>
              Most Frequently Changed Fields
            </h2>

          </div>

          <span className="chart-total">
            {changedCount} changed events
          </span>

        </div>


        {fieldChanges.length === 0 ? (

          <div className="large-empty-state compact">

            <div className="large-empty-icon">
              ◒
            </div>

            <h3>
              No field changes yet
            </h3>

            <p>
              Field analytics will appear after records
              are modified between scraping runs.
            </p>

          </div>

        ) : (

          <div className="field-analysis">

            {fieldChanges.map(
              ([field, count], index) => (

                <div
                  className="field-analysis-row"
                  key={field}
                >

                  <div className="field-rank">
                    0{index + 1}
                  </div>

                  <div className="field-name">
                    <strong>
                      {field}
                    </strong>

                    <span>
                      {count} change
                      {count !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  <div className="field-progress">

                    <div
                      className="field-progress-fill"
                      style={{
                        width: `${
                          (count /
                            maxFieldChanges) *
                          100
                        }%`,
                      }}
                    ></div>

                  </div>

                  <strong className="field-count">
                    {count}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* SYSTEM HEALTH */}

      <section className="analytics-bottom-grid">

        <div className="panel health-panel">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                SYSTEM
              </span>

              <h2>
                Tracking Health
              </h2>

            </div>

          </div>


          <div className="health-content">

            <div className="health-ring">

              <div>
                <strong>
                  {totalRecords > 0
                    ? "100"
                    : "0"}
                  %
                </strong>

                <span>
                  READY
                </span>
              </div>

            </div>


            <div className="health-details">

              <div>
                <span className="health-dot green"></span>

                <div>
                  <strong>
                    Dataset
                  </strong>

                  <small>
                    {totalRecords > 0
                      ? "Active"
                      : "Empty"}
                  </small>
                </div>
              </div>


              <div>
                <span className="health-dot purple"></span>

                <div>
                  <strong>
                    History
                  </strong>

                  <small>
                    {history.length} events
                  </small>
                </div>
              </div>


              <div>
                <span className="health-dot cyan"></span>

                <div>
                  <strong>
                    Tracker
                  </strong>

                  <small>
                    Operational
                  </small>
                </div>
              </div>

            </div>

          </div>

        </div>


        <div className="panel analytics-summary-panel">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                INSIGHT
              </span>

              <h2>
                Snapshot
              </h2>

            </div>

          </div>


          <div className="snapshot-list">

            <div>

              <span>
                Total history entries
              </span>

              <strong>
                {analytics?.total_history_entries ||
                  0}
              </strong>

            </div>


            <div>

              <span>
                Total tracked changes
              </span>

              <strong>
                {totalEvents}
              </strong>

            </div>


            <div>

              <span>
                Current records
              </span>

              <strong>
                {totalRecords}
              </strong>

            </div>


            <div>

              <span>
                Change rate
              </span>

              <strong>
                {totalRecords > 0
                  ? `${Math.round(
                      (changedCount /
                        totalRecords) *
                        100
                    )}%`
                  : "0%"}
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Analytics;