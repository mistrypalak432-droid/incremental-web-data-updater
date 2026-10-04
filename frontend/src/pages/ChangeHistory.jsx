import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function ChangeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/history`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      setHistory(data.history || []);
    } catch (error) {
      console.error(
        "Unable to load history:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    return {
      all: history.length,

      new: history.filter(
        (item) =>
          item.status === "NEW"
      ).length,

      changed: history.filter(
        (item) =>
          item.status === "CHANGED"
      ).length,

      removed: history.filter(
        (item) =>
          item.status === "REMOVED"
      ).length,
    };
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        if (filter === "ALL") {
          return true;
        }

        return item.status === filter;
      })
      .filter((item) => {
        if (!search.trim()) {
          return true;
        }

        const searchText =
          search.toLowerCase();

        return [
          item.identity,
          item.status,
          item.field,
          item.old_value,
          item.new_value,
          item.timestamp,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchText)
        );
      })
      .reverse();
  }, [history, filter, search]);

  const getStatusIcon = (status) => {
    if (status === "NEW") {
      return "+";
    }

    if (status === "CHANGED") {
      return "↻";
    }

    if (status === "REMOVED") {
      return "−";
    }

    return "•";
  };

  return (
    <div className="history-page">

      {/* HEADER */}

      <section className="page-heading">

        <div>

          <span className="section-kicker">
            VERSION TRACKING
          </span>

          <h1>
            Change History
          </h1>

          <p>
            Every detected addition, modification and
            removal is recorded here.
          </p>

        </div>

        <button
          type="button"
          className="refresh-button heading-refresh"
          onClick={loadHistory}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "↻ Refresh History"}
        </button>

      </section>


      {/* SUMMARY */}

      <section className="history-summary">

        <div
          className={`history-stat ${
            filter === "ALL"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setFilter("ALL")
          }
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setFilter("ALL");
            }
          }}
        >

          <div className="history-stat-icon all">
            ◇
          </div>

          <div>

            <span>
              ALL EVENTS
            </span>

            <strong>
              {counts.all}
            </strong>

          </div>

        </div>


        <div
          className={`history-stat ${
            filter === "NEW"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setFilter("NEW")
          }
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setFilter("NEW");
            }
          }}
        >

          <div className="history-stat-icon new">
            +
          </div>

          <div>

            <span>
              NEW
            </span>

            <strong>
              {counts.new}
            </strong>

          </div>

        </div>


        <div
          className={`history-stat ${
            filter === "CHANGED"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setFilter("CHANGED")
          }
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setFilter("CHANGED");
            }
          }}
        >

          <div className="history-stat-icon changed">
            ↻
          </div>

          <div>

            <span>
              CHANGED
            </span>

            <strong>
              {counts.changed}
            </strong>

          </div>

        </div>


        <div
          className={`history-stat ${
            filter === "REMOVED"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setFilter("REMOVED")
          }
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setFilter("REMOVED");
            }
          }}
        >

          <div className="history-stat-icon removed">
            −
          </div>

          <div>

            <span>
              REMOVED
            </span>

            <strong>
              {counts.removed}
            </strong>

          </div>

        </div>

      </section>


      {/* HISTORY PANEL */}

      <section className="panel history-panel">

        <div className="panel-header">

          <div>

            <span className="section-kicker">
              EVENT STREAM
            </span>

            <h2>
              Recorded Changes
            </h2>

          </div>

          <span className="history-count">
            {filteredHistory.length} events
          </span>

        </div>


        {/* SEARCH + FILTER */}

        <div className="history-toolbar">

          <div className="search-box history-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search identity, field or value..."
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>


          <div className="filter-buttons">

            {[
              "ALL",
              "NEW",
              "CHANGED",
              "REMOVED",
            ].map((status) => (

              <button
                type="button"
                key={status}
                className={
                  filter === status
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setFilter(status)
                }
              >
                {status}
              </button>

            ))}

          </div>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="large-empty-state">

            <div className="loading-ring"></div>

            <h3>
              Loading change history
            </h3>

            <p>
              Reading recorded events...
            </p>

          </div>

        ) : filteredHistory.length === 0 ? (

          <div className="large-empty-state">

            <div className="large-empty-icon">
              ↻
            </div>

            <h3>
              No history found
            </h3>

            <p>
              Run an update or change the current filter
              to see recorded events.
            </p>

          </div>

        ) : (

          <div className="history-list">

            {filteredHistory.map(
              (item, index) => (

                <article
                  className="history-event"
                  key={`${item.timestamp}-${item.identity}-${item.field}-${index}`}
                >

                  {/* TIMELINE */}

                  <div className="timeline-column">

                    <div
                      className={`timeline-dot ${String(
                        item.status || ""
                      ).toLowerCase()}`}
                    >
                      {getStatusIcon(
                        item.status
                      )}
                    </div>

                    {index <
                      filteredHistory.length -
                        1 && (
                      <div className="timeline-line"></div>
                    )}

                  </div>


                  {/* EVENT CONTENT */}

                  <div className="history-event-content">

                    <div className="history-event-top">

                      <div className="history-event-title">

                        <span
                          className={`status-badge ${String(
                            item.status || ""
                          ).toLowerCase()}`}
                        >
                          {item.status}
                        </span>

                        <strong>
                          {item.identity ||
                            "Unknown record"}
                        </strong>

                      </div>

                      <time>
                        {item.timestamp}
                      </time>

                    </div>


                    {/* NEW */}

                    {item.status ===
                      "NEW" && (

                      <div className="event-message new-message">

                        <span className="event-message-icon">
                          +
                        </span>

                        <div>

                          <strong>
                            New record detected
                          </strong>

                          <p>
                            This record was not present
                            in the previous dataset.
                          </p>

                        </div>

                      </div>

                    )}


                    {/* REMOVED */}

                    {item.status ===
                      "REMOVED" && (

                      <div className="event-message removed-message">

                        <span className="event-message-icon">
                          −
                        </span>

                        <div>

                          <strong>
                            Record removed
                          </strong>

                          <p>
                            This record was present
                            previously but is no longer
                            detected.
                          </p>

                        </div>

                      </div>

                    )}


                    {/* CHANGED */}

                    {item.status ===
                      "CHANGED" && (

                      <div className="change-detail">

                        <div className="changed-field-name">
                          <span>
                            FIELD
                          </span>

                          <strong>
                            {item.field ||
                              "Unknown"}
                          </strong>
                        </div>


                        <div className="value-comparison">

                          <div className="value-box old-box">

                            <span>
                              BEFORE
                            </span>

                            <p>
                              {item.old_value ||
                                "—"}
                            </p>

                          </div>


                          <div className="value-arrow">
                            →
                          </div>


                          <div className="value-box new-box">

                            <span>
                              AFTER
                            </span>

                            <p>
                              {item.new_value ||
                                "—"}
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>


      {/* FOOTER INFORMATION */}

      <section className="history-note">

        <div className="history-note-icon">
          ◇
        </div>

        <div>

          <strong>
            How change tracking works
          </strong>

          <p>
            Each scraping run is compared with the
            previously stored dataset using your selected
            identity field. Field-level differences are
            recorded so you can see exactly what changed.
          </p>

        </div>

      </section>

    </div>
  );
}

export default ChangeHistory;