from pathlib import Path
import json

from scraper.cleaner import clean_data

from tracker.current_data import (
    load_current_data,
    save_current_data
)

from tracker.comparator import (
    compare_data
)

from tracker.history import (
    save_changes
)


# Project root:
# Incremental-Web-Data-Updater/
BASE_DIR = Path(__file__).resolve().parent.parent

SUMMARY_PATH = (
    BASE_DIR / "data" / "update_summary.json"
)


def update_current_data(
    new_records,
    identity_field="url"
):
    """
    Scrape new data, compare it with
    the previously stored dataset,
    save the new current dataset,
    and record changes.
    """

    # --------------------------------
    # STEP 1
    # Clean newly scraped data
    # --------------------------------

    new_df = clean_data(
        new_records
    )

    # --------------------------------
    # STEP 2
    # Load previous dataset
    # --------------------------------

    old_df = load_current_data()

    # --------------------------------
    # STEP 3
    # Compare old vs new
    # --------------------------------

    comparison_results = compare_data(
        old_df,
        new_df,
        identity_field=identity_field
    )

    # --------------------------------
    # STEP 4
    # Save change history
    # --------------------------------

    save_changes(
        comparison_results
    )

    # --------------------------------
    # STEP 5
    # Replace current dataset
    # --------------------------------

    save_current_data(
        new_df
    )

    # --------------------------------
    # STEP 6
    # Calculate summary
    # --------------------------------

    new_count = sum(
        1
        for result in comparison_results
        if result["status"] == "NEW"
    )

    changed_count = sum(
        1
        for result in comparison_results
        if result["status"] == "CHANGED"
    )

    unchanged_count = sum(
        1
        for result in comparison_results
        if result["status"] == "UNCHANGED"
    )

    removed_count = sum(
        1
        for result in comparison_results
        if result["status"] == "REMOVED"
    )

    summary = {
        "new": new_count,
        "changed": changed_count,
        "unchanged": unchanged_count,
        "removed": removed_count,
        "total": len(new_df)
    }

    # --------------------------------
    # STEP 7
    # Save summary
    # --------------------------------

    SUMMARY_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        SUMMARY_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            summary,
            file,
            indent=4
        )

    # --------------------------------
    # STEP 8
    # Return result to FastAPI
    # --------------------------------

    return {
        "summary": summary,
        "comparison": comparison_results
    }