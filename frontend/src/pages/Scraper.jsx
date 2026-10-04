import { useScraper } from "../ScraperContext";

function Scraper() {
  const {
    url,
    setUrl,

    pages,
    setPages,

    paginationMode,
    setPaginationMode,

    recordSelector,
    setRecordSelector,

    fields,
    setFields,

    identityField,
    setIdentityField,

    data,
    comparison,
    summary,

    loading,
    message,
    messageType,

    scrapeWebsite,
    updateData,
    downloadCSV,
    clearResults,
  } = useScraper();

  // =========================
  // Field Management
  // =========================

  const updateField = (index, key, value) => {
    setFields((currentFields) =>
      currentFields.map((field, fieldIndex) =>
        fieldIndex === index
          ? {
              ...field,
              [key]: value,
            }
          : field
      )
    );
  };

  const addField = () => {
    setFields((currentFields) => [
      ...currentFields,
      {
        name: "",
        selector: "",
      },
    ]);
  };

  const removeField = (index) => {
    if (fields.length <= 1) {
      return;
    }

    setFields((currentFields) =>
      currentFields.filter(
        (_, fieldIndex) =>
          fieldIndex !== index
      )
    );
  };

  const statusClass = (status) => {
    return String(status || "")
      .toLowerCase();
  };

  return (
    <div className="scraper-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="page-heading">

        <div>

          <span className="section-kicker">
            DATA COLLECTION
          </span>

          <h1>
            Web Scraper
          </h1>

          <p>
            Configure a public website, scrape multiple
            pages, and prepare the data for change tracking.
          </p>

        </div>

        <div className="heading-orb">

          <div className="orb-core">
            ◈
          </div>

        </div>

      </section>


      {/* =========================
          MESSAGE
      ========================= */}

      {message && (

        <div
          className={`notification ${messageType}`}
        >

          <span className="notification-icon">

            {messageType === "success"
              ? "✓"
              : messageType === "error"
              ? "!"
              : "i"}

          </span>

          <span>
            {message}
          </span>

        </div>

      )}


      {/* =========================
          MAIN SCRAPER LAYOUT
      ========================= */}

      <section className="scraper-layout">

        {/* =========================
            CONFIGURATION
        ========================= */}

        <div className="panel scraper-config">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                CONFIGURATION
              </span>

              <h2>
                Scrape a Website
              </h2>

            </div>

            <span className="config-number">
              01
            </span>

          </div>


          {/* WEBSITE URL */}

          <div className="form-group">

            <label>
              Website URL
            </label>

            <input
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com/page/{page}"
            />

            <small>
              Use a public website that permits
              automated access.
            </small>

          </div>


          {/* PAGES + PAGINATION */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Number of pages
              </label>

              <input
                type="number"
                min="1"
                max="20"
                value={pages}
                onChange={(event) => {

                  const value =
                    Number(event.target.value) || 1;

                  setPages(
                    Math.max(
                      1,
                      Math.min(20, value)
                    )
                  );

                }}
              />

            </div>


            <div className="form-group">

              <label>
                Pagination
              </label>

              <select
                value={paginationMode}
                onChange={(event) =>
                  setPaginationMode(
                    event.target.value
                  )
                }
              >

                <option value="template">
                  URL Template — {"{page}"}
                </option>

                <option value="query">
                  Query Parameter — ?page=
                </option>

                <option value="auto">
                  Automatic Next Page
                </option>

              </select>

            </div>

          </div>


          {/* RECORD SELECTOR */}

          <div className="form-group">

            <label>

              Record CSS Selector

              <span className="optional">
                Optional
              </span>

            </label>

            <input
              type="text"
              value={recordSelector}
              onChange={(event) =>
                setRecordSelector(
                  event.target.value
                )
              }
              placeholder=".quote"
            />

            <small>
              Example: .quote, .product,
              article, .listing
            </small>

          </div>


          {/* =========================
              FIELD MAPPING
          ========================= */}

          <div className="field-section">

            <div className="field-section-header">

              <div>

                <label>
                  Data Fields
                </label>

                <p>
                  Tell the scraper which values to
                  extract from each record.
                </p>

              </div>

              <button
                type="button"
                className="small-button"
                onClick={addField}
              >
                + Add Field
              </button>

            </div>


            <div className="field-list">

              {fields.map(
                (field, index) => (

                  <div
                    className="field-row"
                    key={index}
                  >

                    <input
                      type="text"
                      value={field.name}
                      onChange={(event) =>
                        updateField(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Field name"
                    />

                    <span className="selector-arrow">
                      →
                    </span>

                    <input
                      type="text"
                      value={field.selector}
                      onChange={(event) =>
                        updateField(
                          index,
                          "selector",
                          event.target.value
                        )
                      }
                      placeholder=".text"
                    />

                    <button
                      type="button"
                      className="remove-field"
                      onClick={() =>
                        removeField(index)
                      }
                      disabled={
                        fields.length <= 1
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )}

            </div>

          </div>


          {/* =========================
              IDENTITY FIELD
          ========================= */}

          <div className="form-group">

            <label>
              Identity Field
            </label>

            <select
              value={identityField}
              onChange={(event) =>
                setIdentityField(
                  event.target.value
                )
              }
            >

              {fields
                .filter(
                  (field) =>
                    field.name.trim()
                )
                .map((field) => (

                  <option
                    key={field.name}
                    value={field.name}
                  >
                    {field.name}
                  </option>

                ))}

            </select>

            <small>
              This field identifies the same record
              between different scraping runs.
            </small>

          </div>


          {/* =========================
              ACTION BUTTONS
          ========================= */}

          <div className="scraper-actions">

            <button
              type="button"
              className="action-button scrape-button"
              onClick={scrapeWebsite}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Working...
                </>
              ) : (
                <>
                  ◈ Scrape Website
                </>
              )}

            </button>


            <button
              type="button"
              className="action-button update-button"
              onClick={updateData}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  ↻ Update & Track
                </>
              )}

            </button>


            <button
              type="button"
              className="action-button download-button"
              onClick={downloadCSV}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Preparing...
                </>
              ) : (
                <>
                  ↓ Download CSV
                </>
              )}

            </button>

          </div>


          {/* CLEAR */}

          <button
            type="button"
            className="clear-button"
            onClick={clearResults}
          >
            Clear Results
          </button>

        </div>


        {/* =========================
            SIDE INFORMATION
        ========================= */}

        <aside className="scraper-side">

          <div className="panel info-panel">

            <div className="info-icon">
              ⚡
            </div>

            <h3>
              How it works
            </h3>

            <div className="steps">

              <div className="info-step">

                <span>
                  01
                </span>

                <div>

                  <strong>
                    Configure
                  </strong>

                  <p>
                    Enter a public URL and define
                    the records and fields you want.
                  </p>

                </div>

              </div>


              <div className="info-step">

                <span>
                  02
                </span>

                <div>

                  <strong>
                    Scrape
                  </strong>

                  <p>
                    Requests and BeautifulSoup collect
                    records across your selected pages.
                  </p>

                </div>

              </div>


              <div className="info-step">

                <span>
                  03
                </span>

                <div>

                  <strong>
                    Compare
                  </strong>

                  <p>
                    The tracker identifies new,
                    changed, unchanged and removed records.
                  </p>

                </div>

              </div>


              <div className="info-step">

                <span>
                  04
                </span>

                <div>

                  <strong>
                    Analyze
                  </strong>

                  <p>
                    Explore your current dataset
                    and historical changes.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* RESPONSIBLE SCRAPING */}

          <div className="panel responsible-panel">

            <div className="responsible-title">

              <span>
                ◆
              </span>

              Responsible scraping

            </div>

            <p>
              Only scrape public information from
              websites where automated access is allowed.
              Respect robots.txt, terms of service,
              rate limits and applicable laws.
            </p>

          </div>

        </aside>

      </section>


      {/* =========================
          SCRAPE RESULT
      ========================= */}

      {data.length > 0 && (

        <section className="panel result-panel">

          <div className="panel-header">

            <div>

              <span className="section-kicker">
                SCRAPE RESULT
              </span>

              <h2>
                Extracted Data
              </h2>

            </div>

            <div className="result-count">
              {data.length} records
            </div>

          </div>


          <div className="result-meta">

            <div>

              <span>
                Source
              </span>

              <strong>
                {url}
              </strong>

            </div>

            <div>

              <span>
                Pages
              </span>

              <strong>
                {pages}
              </strong>

            </div>

          </div>


          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>

                  {Object.keys(data[0]).map(
                    (column) => (

                      <th key={column}>
                        {column}
                      </th>

                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {data.map(
                  (row, index) => (

                    <tr key={index}>

                      {Object.keys(data[0]).map(
                        (column) => {

                          const value =
                            String(
                              row[column] ?? ""
                            );

                          return (
                            <td key={column}>

                              {value.length > 120
                                ? `${value.slice(
                                    0,
                                    120
                                  )}...`
                                : value}

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

        </section>

      )}


      {/* =========================
          UPDATE SUMMARY
      ========================= */}

      {summary && (

        <section className="update-section">

          <div className="summary-title">

            <span className="section-kicker">
              UPDATE RESULT
            </span>

            <h2>
              Change Detection
            </h2>

          </div>


          <div className="summary-grid">

            <div className="summary-card new-summary">

              <span>
                NEW
              </span>

              <strong>
                {summary.new ?? 0}
              </strong>

              <small>
                Records added
              </small>

            </div>


            <div className="summary-card changed-summary">

              <span>
                CHANGED
              </span>

              <strong>
                {summary.changed ?? 0}
              </strong>

              <small>
                Records modified
              </small>

            </div>


            <div className="summary-card unchanged-summary">

              <span>
                UNCHANGED
              </span>

              <strong>
                {summary.unchanged ?? 0}
              </strong>

              <small>
                Records identical
              </small>

            </div>


            <div className="summary-card removed-summary">

              <span>
                REMOVED
              </span>

              <strong>
                {summary.removed ?? 0}
              </strong>

              <small>
                Records disappeared
              </small>

            </div>

          </div>


          {/* =========================
              COMPARISON
          ========================= */}

          {comparison.length > 0 && (

            <div className="panel comparison-panel">

              <div className="panel-header">

                <div>

                  <span className="section-kicker">
                    COMPARISON
                  </span>

                  <h2>
                    Detected Changes
                  </h2>

                </div>

              </div>


              <div className="comparison-list">

                {comparison.map(
                  (item, index) => (

                    <div
                      className="comparison-item"
                      key={`${item.identity}-${index}`}
                    >

                      <div className="comparison-top">

                        <span
                          className={`status-badge ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        <strong>
                          {item.identity}
                        </strong>

                      </div>


                      {item.status ===
                        "CHANGED" &&
                        item.changes && (

                          <div className="field-changes">

                            {Object.entries(
                              item.changes
                            ).map(
                              (
                                [field, change]
                              ) => (

                                <div
                                  className="field-change"
                                  key={field}
                                >

                                  <span className="change-field">
                                    {field}
                                  </span>


                                  <div className="old-value">

                                    <small>
                                      OLD
                                    </small>

                                    <span>
                                      {change.old}
                                    </span>

                                  </div>


                                  <span className="change-arrow">
                                    →
                                  </span>


                                  <div className="new-value">

                                    <small>
                                      NEW
                                    </small>

                                    <span>
                                      {change.new}
                                    </span>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        )}

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      )}

    </div>
  );
}

export default Scraper;