import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function CurrentData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/current-data`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      setRecords(data.records || []);
    } catch (error) {
      console.error(
        "Unable to load current data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(
    (record) => {
      if (!search.trim()) {
        return true;
      }

      const searchText = search
        .toLowerCase()
        .trim();

      return Object.values(record).some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchText)
      );
    }
  );

  const columns =
    records.length > 0
      ? Object.keys(records[0])
      : [];

  return (
    <div className="data-page">

      {/* PAGE HEADER */}

      <section className="page-heading">

        <div>

          <span className="section-kicker">
            DATASET
          </span>

          <h1>
            Current Data
          </h1>

          <p>
            Browse the latest version of the records
            stored by the web tracker.
          </p>

        </div>

        <div className="data-counter">

          <strong>
            {records.length}
          </strong>

          <span>
            records
          </span>

        </div>

      </section>


      {/* DATA PANEL */}

      <section className="panel full-data-panel">

        <div className="panel-header">

          <div>

            <span className="section-kicker">
              LIVE DATASET
            </span>

            <h2>
              Stored Records
            </h2>

          </div>


          <button
            type="button"
            className="refresh-button"
            onClick={loadData}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>


        {/* SEARCH */}

        <div className="data-toolbar">

          <div className="search-box">

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
              placeholder="Search records..."
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


          <div className="result-count-text">

            Showing{" "}
            <strong>
              {filteredRecords.length}
            </strong>{" "}
            of{" "}
            <strong>
              {records.length}
            </strong>

          </div>

        </div>


        {/* TABLE */}

        {loading ? (

          <div className="large-empty-state">

            <div className="loading-ring"></div>

            <h3>
              Loading dataset
            </h3>

            <p>
              Fetching the latest stored records...
            </p>

          </div>

        ) : records.length === 0 ? (

          <div className="large-empty-state">

            <div className="large-empty-icon">
              ◫
            </div>

            <h3>
              No current data
            </h3>

            <p>
              Run an update from the Scraper page
              to create your first dataset.
            </p>

          </div>

        ) : filteredRecords.length === 0 ? (

          <div className="large-empty-state">

            <div className="large-empty-icon">
              ⌕
            </div>

            <h3>
              No matching records
            </h3>

            <p>
              Try a different search term.
            </p>

          </div>

        ) : (

          <div className="table-wrapper current-data-wrapper">

            <table className="data-table current-data-table">

              <thead>

                <tr>

                  <th className="row-number">
                    #
                  </th>

                  {columns.map(
                    (column) => (
                      <th key={column}>
                        {column}
                      </th>
                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {filteredRecords.map(
                  (record, index) => (

                    <tr key={index}>

                      <td className="row-number">
                        {index + 1}
                      </td>

                      {columns.map(
                        (column) => {

                          const value =
                            String(
                              record[
                                column
                              ] ?? ""
                            );

                          const isUrl =
                            /^https?:\/\//i.test(
                              value
                            );

                          return (
                            <td
                              key={column}
                            >

                              {isUrl ? (

                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="data-link"
                                >
                                  {value.length >
                                  80
                                    ? `${value.slice(
                                        0,
                                        80
                                      )}...`
                                    : value}
                                </a>

                              ) : (

                                value.length >
                                150
                                  ? `${value.slice(
                                      0,
                                      150
                                    )}...`
                                  : value

                              )}

                            </td>
                          );
                        }
                      )}

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* INFORMATION CARDS */}

      <section className="data-info-grid">

        <div className="panel data-info-card">

          <div className="data-info-icon cyan">
            ▦
          </div>

          <div>

            <span>
              TOTAL RECORDS
            </span>

            <strong>
              {records.length}
            </strong>

          </div>

        </div>


        <div className="panel data-info-card">

          <div className="data-info-icon purple">
            ◇
          </div>

          <div>

            <span>
              COLUMNS
            </span>

            <strong>
              {columns.length}
            </strong>

          </div>

        </div>


        <div className="panel data-info-card">

          <div className="data-info-icon green">
            ✓
          </div>

          <div>

            <span>
              DATA STATUS
            </span>

            <strong>
              {records.length > 0
                ? "ACTIVE"
                : "EMPTY"}
            </strong>

          </div>

        </div>

      </section>

    </div>
  );
}

export default CurrentData;