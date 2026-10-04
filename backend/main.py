from pathlib import Path
import io

import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from scraper.basic_scraper import (
    scrape_multiple_pages
)

from scraper.cleaner import clean_data

from tracker.updater import (
    update_current_data
)

from tracker.history import HISTORY_PATH

from tracker.current_data import (
    CURRENT_DATA_PATH,
    save_current_data
)


# ---------------------------------------
# PROJECT PATH
# ---------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"

LATEST_SCRAPE_PATH = (
    DATA_DIR / "latest_scrape.csv"
)


# ---------------------------------------
# FASTAPI
# ---------------------------------------

app = FastAPI(
    title="Incremental Web Data Updater",
    description=(
        "Scrape, compare and track "
        "changes in public web data."
    )
)


# ---------------------------------------
# CORS
# ---------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------
# REQUEST MODELS
# ---------------------------------------

class ScrapeRequest(BaseModel):

    url: str

    pages: int = Field(
        ge=1,
        le=20
    )

    record_selector: str | None = None

    title_selector: str | None = None

    url_selector: str | None = None

    pagination_mode: str = "auto"

    fields: dict[str, str] | None = None


class UpdateRequest(ScrapeRequest):

    identity_field: str = "url"


# ---------------------------------------
# HOME
# ---------------------------------------

@app.get("/")
def home():

    return {
        "message":
            "Incremental Web Data Updater API is running"
    }


# ---------------------------------------
# HEALTH
# ---------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok"
    }


# ---------------------------------------
# SCRAPE
# ---------------------------------------

@app.post("/scrape")
def scrape_website(
    request: ScrapeRequest
):

    data = scrape_multiple_pages(
        request.url,
        request.pages,
        request.record_selector,
        request.title_selector,
        request.url_selector,
        request.pagination_mode,
        request.fields
    )

    df = clean_data(data)

    # Make sure data directory exists
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------
    # SAVE LATEST SCRAPE
    # --------------------------------

    df.to_csv(
        LATEST_SCRAPE_PATH,
        index=False
    )

    # --------------------------------
    # IMPORTANT FIX
    # SAVE SCRAPED DATA AS CURRENT DATA
    # --------------------------------

    save_current_data(df)

    return {
        "url": request.url,
        "pages": request.pages,
        "records_found": len(df),
        "data": df.to_dict(
            orient="records"
        )
    }


# ---------------------------------------
# UPDATE & TRACK
# ---------------------------------------

@app.post("/update")
def update_website(
    request: UpdateRequest
):

    data = scrape_multiple_pages(
        request.url,
        request.pages,
        request.record_selector,
        request.title_selector,
        request.url_selector,
        request.pagination_mode,
        request.fields
    )

    result = update_current_data(
        data,
        identity_field=request.identity_field
    )

    return {
        "url": request.url,
        "pages": request.pages,
        "identity_field":
            request.identity_field,
        "summary":
            result["summary"],
        "comparison":
            result["comparison"]
    }


# ---------------------------------------
# CURRENT DATA
# ---------------------------------------

@app.get("/current-data")
def get_current_data():

    if not CURRENT_DATA_PATH.exists():

        return {
            "records": []
        }

    try:

        df = pd.read_csv(
            CURRENT_DATA_PATH
        )

        df = df.fillna("")

        return {
            "records":
                df.to_dict(
                    orient="records"
                )
        }

    except Exception as error:

        return {
            "records": [],
            "error": str(error)
        }


# ---------------------------------------
# HISTORY
# ---------------------------------------

@app.get("/history")
def get_history():

    if not HISTORY_PATH.exists():

        return {
            "history": []
        }

    try:

        df = pd.read_csv(
            HISTORY_PATH
        )

        df = df.fillna("")

        return {
            "history":
                df.to_dict(
                    orient="records"
                )
        }

    except Exception as error:

        return {
            "history": [],
            "error": str(error)
        }


# ---------------------------------------
# ANALYTICS
# ---------------------------------------

@app.get("/analytics")
def get_analytics():

    # Current data
    if CURRENT_DATA_PATH.exists():

        try:

            current_df = pd.read_csv(
                CURRENT_DATA_PATH
            )

        except Exception:

            current_df = pd.DataFrame()

    else:

        current_df = pd.DataFrame()


    # History
    if HISTORY_PATH.exists():

        try:

            history_df = pd.read_csv(
                HISTORY_PATH
            )

        except Exception:

            history_df = pd.DataFrame()

    else:

        history_df = pd.DataFrame()


    new_count = 0
    changed_count = 0
    removed_count = 0


    if (
        not history_df.empty
        and "status" in history_df.columns
    ):

        new_count = int(
            (
                history_df["status"]
                == "NEW"
            ).sum()
        )

        changed_count = int(
            (
                history_df["status"]
                == "CHANGED"
            ).sum()
        )

        removed_count = int(
            (
                history_df["status"]
                == "REMOVED"
            ).sum()
        )


    total_changes = (
        new_count
        + changed_count
        + removed_count
    )


    return {

        "total_records":
            len(current_df),

        "new":
            new_count,

        "changed":
            changed_count,

        "removed":
            removed_count,

        "total_changes":
            total_changes,

        "total_history_entries":
            len(history_df)
    }


# ---------------------------------------
# DOWNLOAD CSV
# ---------------------------------------

@app.post("/scrape/download")
def download_scraped_data(
    request: ScrapeRequest
):

    data = scrape_multiple_pages(
        request.url,
        request.pages,
        request.record_selector,
        request.title_selector,
        request.url_selector,
        request.pagination_mode,
        request.fields
    )

    df = clean_data(data)

    csv_buffer = io.StringIO()

    df.to_csv(
        csv_buffer,
        index=False
    )

    csv_buffer.seek(0)

    return StreamingResponse(
        iter([
            csv_buffer.getvalue()
        ]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; "
                "filename=scraped_data.csv"
        }
    )