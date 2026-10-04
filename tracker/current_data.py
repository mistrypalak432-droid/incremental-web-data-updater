from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

CURRENT_DATA_PATH = (
    BASE_DIR / "data" / "current_data.csv"
)


def load_current_data():
    if not CURRENT_DATA_PATH.exists():
        return pd.DataFrame()

    try:
        return pd.read_csv(
            CURRENT_DATA_PATH
        )
    except Exception:
        return pd.DataFrame()


def save_current_data(df):
    CURRENT_DATA_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        CURRENT_DATA_PATH,
        index=False
    )