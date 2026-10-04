import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ScraperContext = createContext(null);

const API_URL = "https://incremental-web-data-updater.onrender.com";

export function ScraperProvider({ children }) {
  // =========================
  // Scraper Form State
  // =========================

  const [url, setUrl] = useState(
    localStorage.getItem("scraper_url") || ""
  );

  const [pages, setPages] = useState(
    Number(localStorage.getItem("scraper_pages")) || 1
  );

  const [paginationMode, setPaginationMode] = useState(
    localStorage.getItem("scraper_pagination") || "auto"
  );

  const [recordSelector, setRecordSelector] = useState(
    localStorage.getItem("scraper_record_selector") || ""
  );

  const [fields, setFields] = useState(() => {
    const savedFields =
      localStorage.getItem("scraper_fields");

    if (savedFields) {
      try {
        return JSON.parse(savedFields);
      } catch {
        return [
          {
            name: "title",
            selector: "",
          },
          {
            name: "url",
            selector: "",
          },
        ];
      }
    }

    return [
      {
        name: "title",
        selector: "",
      },
      {
        name: "url",
        selector: "",
      },
    ];
  });

  const [identityField, setIdentityField] = useState(
    localStorage.getItem("scraper_identity") || "url"
  );

  // =========================
  // Result State
  // =========================

  const [data, setData] = useState(() => {
    const savedData =
      localStorage.getItem("scraper_data");

    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        return [];
      }
    }

    return [];
  });

  const [comparison, setComparison] = useState([]);

  const [summary, setSummary] = useState(() => {
    const savedSummary =
      localStorage.getItem("scraper_summary");

    if (savedSummary) {
      try {
        return JSON.parse(savedSummary);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  // =========================
  // Save Form State
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "scraper_url",
      url
    );
  }, [url]);

  useEffect(() => {
    localStorage.setItem(
      "scraper_pages",
      String(pages)
    );
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(
      "scraper_pagination",
      paginationMode
    );
  }, [paginationMode]);

  useEffect(() => {
    localStorage.setItem(
      "scraper_record_selector",
      recordSelector
    );
  }, [recordSelector]);

  useEffect(() => {
    localStorage.setItem(
      "scraper_fields",
      JSON.stringify(fields)
    );
  }, [fields]);

  useEffect(() => {
    localStorage.setItem(
      "scraper_identity",
      identityField
    );
  }, [identityField]);

  // =========================
  // Save Scraped Data
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "scraper_data",
      JSON.stringify(data)
    );
  }, [data]);

  useEffect(() => {
    if (summary) {
      localStorage.setItem(
        "scraper_summary",
        JSON.stringify(summary)
      );
    } else {
      localStorage.removeItem(
        "scraper_summary"
      );
    }
  }, [summary]);

  // =========================
  // Build Field Object
  // =========================

  const getFieldObject = () => {
    const fieldObject = {};

    fields.forEach((field) => {
      const name =
        field.name?.trim();

      const selector =
        field.selector?.trim();

      if (name && selector) {
        fieldObject[name] = selector;
      }
    });

    return fieldObject;
  };

  // =========================
  // Scrape Website
  // =========================

  const scrapeWebsite = async () => {
    if (!url.trim()) {
      setMessage(
        "Please enter a website URL."
      );

      setMessageType("error");

      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const fieldObject =
        getFieldObject();

      const response = await fetch(
        `${API_URL}/scrape`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),

            pages: Number(pages),

            record_selector:
              recordSelector.trim() ||
              null,

            pagination_mode:
              paginationMode,

            fields:
              Object.keys(fieldObject)
                .length > 0
                ? fieldObject
                : null,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Scrape failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      const scrapedData =
        result.data || [];

      setData(scrapedData);

      setComparison([]);

      setSummary({
        total:
          result.records_found ||
          scrapedData.length ||
          0,
      });

      setMessage(
        `Successfully scraped ${
          result.records_found ||
          scrapedData.length ||
          0
        } records.`
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Scrape error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to scrape website."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Update Current Data
  // =========================

  const updateData = async () => {
    if (!url.trim()) {
      setMessage(
        "Please enter a website URL."
      );

      setMessageType("error");

      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const fieldObject =
        getFieldObject();

      const response = await fetch(
        `${API_URL}/update`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),

            pages: Number(pages),

            record_selector:
              recordSelector.trim() ||
              null,

            pagination_mode:
              paginationMode,

            fields:
              Object.keys(fieldObject)
                .length > 0
                ? fieldObject
                : null,

            identity_field:
              identityField,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Update failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      setComparison(
        result.comparison || []
      );

      setSummary(
        result.summary || null
      );

      // Get the newly updated current data
      const currentResponse =
        await fetch(
          `${API_URL}/current-data`
        );

      if (currentResponse.ok) {
        const currentResult =
          await currentResponse.json();

        setData(
          currentResult.records || []
        );
      }

      setMessage(
        "Data update completed successfully."
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to update data."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Download CSV
  // =========================

  const downloadCSV = async () => {
    if (!url.trim()) {
      setMessage(
        "Please enter a website URL first."
      );

      setMessageType("error");

      return;
    }

    setLoading(true);

    try {
      const fieldObject =
        getFieldObject();

      const response = await fetch(
        `${API_URL}/scrape/download`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),

            pages: Number(pages),

            record_selector:
              recordSelector.trim() ||
              null,

            pagination_mode:
              paginationMode,

            fields:
              Object.keys(fieldObject)
                .length > 0
                ? fieldObject
                : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob =
        await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        "scraped_data.csv";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );

      setMessage(
        "CSV downloaded successfully."
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to download CSV."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Clear Results
  // =========================

  const clearResults = () => {
    setData([]);

    setComparison([]);

    setSummary(null);

    setMessage("");

    setMessageType("");

    localStorage.removeItem(
      "scraper_data"
    );

    localStorage.removeItem(
      "scraper_summary"
    );
  };

  // =========================
  // Context
  // =========================

  return (
    <ScraperContext.Provider
      value={{
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
        setData,

        comparison,
        setComparison,

        summary,
        setSummary,

        loading,

        message,
        messageType,

        scrapeWebsite,
        updateData,
        downloadCSV,
        clearResults,
      }}
    >
      {children}
    </ScraperContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useScraper() {
  const context =
    useContext(
      ScraperContext
    );

  if (!context) {
    throw new Error(
      "useScraper must be used inside ScraperProvider"
    );
  }

  return context;
}