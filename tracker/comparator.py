import pandas as pd


def compare_data(
    old_df,
    new_df,
    identity_field="url"
):
    """
    Compare old and new datasets.

    identity_field is used to identify whether
    two records represent the same item.
    """

    results = []

    # Handle completely empty datasets
    if old_df is None:
        old_df = pd.DataFrame()

    if new_df is None:
        new_df = pd.DataFrame()

    # If there is no identity field, comparison
    # cannot be performed reliably.
    if identity_field not in old_df.columns:
        old_df = pd.DataFrame()

    if identity_field not in new_df.columns:
        raise ValueError(
            f"Identity field '{identity_field}' "
            "was not found in the new data."
        )

    # Create lookup of old records
    old_records = {}

    for _, row in old_df.iterrows():
        key = str(row[identity_field]).strip()

        if key:
            old_records[key] = row.to_dict()

    new_records = {}

    # Compare new records
    for _, new_row in new_df.iterrows():

        key = str(
            new_row[identity_field]
        ).strip()

        if not key:
            continue

        new_records[key] = new_row.to_dict()

        # -------------------------
        # NEW RECORD
        # -------------------------

        if key not in old_records:

            results.append({
                "identity": key,
                "status": "NEW",
                "changes": {}
            })

            continue

        old_row = old_records[key]

        changes = {}

        # Compare all fields from the new dataset
        all_columns = set(
            old_row.keys()
        ).union(
            new_row.index
        )

        for column in all_columns:

            # Identity field itself does not need
            # to be compared.
            if column == identity_field:
                continue

            old_value = str(
                old_row.get(column, "")
            ).strip()

            new_value = str(
                new_row.get(column, "")
            ).strip()

            if old_value != new_value:

                changes[column] = {
                    "old": old_value,
                    "new": new_value
                }

        # -------------------------
        # CHANGED
        # -------------------------

        if changes:

            results.append({
                "identity": key,
                "status": "CHANGED",
                "changes": changes
            })

        # -------------------------
        # UNCHANGED
        # -------------------------

        else:

            results.append({
                "identity": key,
                "status": "UNCHANGED",
                "changes": {}
            })

    # -------------------------
    # REMOVED RECORDS
    # -------------------------

    for key in old_records:

        if key not in new_records:

            results.append({
                "identity": key,
                "status": "REMOVED",
                "changes": {}
            })

    return results