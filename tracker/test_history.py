from tracker.updater import update_current_data


first_scrape = [
    {
        "title": "Python Developer",
        "url": "https://example.com/python"
    },
    {
        "title": "Data Analyst",
        "url": "https://example.com/data"
    },
    {
        "title": "ML Engineer",
        "url": "https://example.com/ml"
    }
]


second_scrape = [
    {
        "title": "Python Developer",
        "url": "https://example.com/python"
    },
    {
        "title": "Senior Data Analyst",
        "url": "https://example.com/data"
    }
]


print("\nFIRST UPDATE")
result = update_current_data(first_scrape)
print(result)


print("\nSECOND UPDATE")
result = update_current_data(second_scrape)
print(result)