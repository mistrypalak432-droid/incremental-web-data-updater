import pandas as pd

from comparator import compare_data


old_data = pd.DataFrame([
    {
        "title": "Python Developer",
        "url": "https://example.com/python"
    },
    {
        "title": "Data Analyst",
        "url": "https://example.com/data"
    }
])


new_data = pd.DataFrame([
    {
        "title": "Python Developer",
        "url": "https://example.com/python"
    },
    {
        "title": "Senior Data Analyst",
        "url": "https://example.com/data"
    },
    {
        "title": "ML Engineer",
        "url": "https://example.com/ml"
    }
])


results = compare_data(
    old_data,
    new_data
)


for result in results:

    print("\n--------------------")

    print(
        f"URL: {result['url']}"
    )

    print(
        f"Status: {result['status']}"
    )

    print(
        f"Changes: {result['changes']}"
    )