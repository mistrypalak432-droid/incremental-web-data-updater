import pandas as pd


def clean_data(records):
    """
    Clean scraped records without assuming
    specific column names.
    """

    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)

    # Remove completely empty rows
    df = df.dropna(how="all")

    # Remove completely empty columns
    df = df.dropna(axis=1, how="all")

    # Convert all values to strings and remove extra spaces
    for column in df.columns:
        df[column] = (
            df[column]
            .fillna("")
            .astype(str)
            .str.strip()
        )

    # If a URL column exists, use it for duplicate removal
    if "url" in df.columns:
        df = df.drop_duplicates(
            subset=["url"],
            keep="first"
        )

    # Otherwise remove completely identical records
    else:
        df = df.drop_duplicates(
            keep="first"
        )

    return df.reset_index(drop=True)