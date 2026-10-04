from pathlib import Path
from datetime import datetime
import pandas as pd


# Project root:
# Incremental-Web-Data-Updater/
BASE_DIR = Path(__file__).resolve().parent.parent

HISTORY_PATH = (
    BASE_DIR / "data" / "change_history.csv"
)


def save_changes(comparison_results):
    """
    Save NEW, CHANGED and REMOVED records
    into the change history.
    """

    history_records = []

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    for result in comparison_results:

        identity = result.get(
            "identity",
            ""
        )

        status = result.get(
            "status",
            ""
        )

        # -------------------------
        # NEW RECORD
        # -------------------------

        if status == "NEW":

            history_records.append({
                "timestamp": timestamp,
                "identity": identity,
                "status": "NEW",
                "field": "",
                "old_value": "",
                "new_value": "Record added"
            })

        # -------------------------
        # CHANGED RECORD
        # -------------------------

        elif status == "CHANGED":

            changes = result.get(
                "changes",
                {}
            )

            for field, change in changes.items():

                history_records.append({
                    "timestamp": timestamp,
                    "identity": identity,
                    "status": "CHANGED",
                    "field": field,
                    "old_value": change.get(
                        "old",
                        ""
                    ),
                    "new_value": change.get(
                        "new",
                        ""
                    )
                })

        # -------------------------
        # REMOVED RECORD
        # -------------------------

        elif status == "REMOVED":

            history_records.append({
                "timestamp": timestamp,
                "identity": identity,
                "status": "REMOVED",
                "field": "",
                "old_value": "Record existed",
                "new_value": "Record removed"
            })

    # Nothing to save
    if not history_records:
        return

    new_history = pd.DataFrame(
        history_records
    )

    # Add to existing history
    if HISTORY_PATH.exists():

        try:
            old_history = pd.read_csv(
                HISTORY_PATH
            )

            new_history = pd.concat(
                [
                    old_history,
                    new_history
                ],
                ignore_index=True
            )

        except Exception:
            pass

    HISTORY_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    new_history.to_csv(
        HISTORY_PATH,
        index=False
    )