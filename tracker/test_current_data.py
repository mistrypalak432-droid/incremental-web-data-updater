import pandas as pd

from current_data import (
    load_current_data,
    save_current_data
)


df = pd.DataFrame([
    {
        "title": "Python Developer",
        "url": "https://example.com/python"
    },
    {
        "title": "Data Analyst",
        "url": "https://example.com/data"
    }
])


save_current_data(df)

loaded_data = load_current_data()

print("\nCurrent data:")
print(loaded_data)