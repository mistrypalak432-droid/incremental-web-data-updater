import requests

from scraper.url_utils import (
    create_page_url,
    make_absolute_url,
    detect_next_page_url
)

from scraper.extractor import (
    extract_page_data,
    extract_with_selectors,
    extract_with_fields
)

from scraper.cleaner import clean_data


def scrape_page(
    url,
    record_selector=None,
    title_selector=None,
    url_selector=None,
    fields=None
):
    """
    Scrape one webpage.

    Extraction priority:

    1. Generic fields
    2. Title + URL selectors
    3. Automatic link extraction
    """

    response = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0"
        },
        timeout=10
    )

    response.raise_for_status()

    # ------------------------------------------
    # Generic multi-field extraction
    # ------------------------------------------

    if (
        record_selector
        and fields
    ):

        records = extract_with_fields(
            response.text,
            record_selector,
            fields
        )

    # ------------------------------------------
    # Existing title + URL extraction
    # ------------------------------------------

    elif (
        record_selector
        and title_selector
        and url_selector
    ):

        records = extract_with_selectors(
            response.text,
            record_selector,
            title_selector,
            url_selector
        )

    # ------------------------------------------
    # Automatic extraction
    # ------------------------------------------

    else:

        records = extract_page_data(
            response.text
        )

    # ------------------------------------------
    # Convert URLs to absolute URLs
    # ------------------------------------------

    for record in records:

        if "url" in record:

            record["url"] = make_absolute_url(
                response.url,
                record["url"]
            )

        # Also support fields such as
        # company_url, product_url etc.
        for field_name in list(
            record.keys()
        ):

            if (
                field_name.endswith("_url")
                and field_name != "url"
            ):

                record[field_name] = (
                    make_absolute_url(
                        response.url,
                        record[field_name]
                    )
                )

    return records


def scrape_multiple_pages(
    base_url,
    number_of_pages,
    record_selector=None,
    title_selector=None,
    url_selector=None,
    pagination_mode="template",
    fields=None
):
    """
    Scrape multiple pages.

    Supported pagination modes:

    template:
        https://example.com/page/{page}/

    query:
        https://example.com/jobs?page=1

    auto:
        Automatically follow the
        website's Next page link.
    """

    all_data = []

    current_url = base_url

    for page_number in range(
        1,
        number_of_pages + 1
    ):

        print(
            f"\nScraping page {page_number}..."
        )

        try:

            # ----------------------------------
            # Determine page URL
            # ----------------------------------

            if pagination_mode == "auto":

                if page_number == 1:

                    page_url = base_url

                else:

                    page_url = current_url

            else:

                page_url = create_page_url(
                    base_url,
                    page_number,
                    pagination_mode
                )

            print(
                f"URL: {page_url}"
            )

            # ----------------------------------
            # Request
            # ----------------------------------

            response = requests.get(
                page_url,
                headers={
                    "User-Agent": "Mozilla/5.0"
                },
                timeout=10
            )

            response.raise_for_status()

            # ----------------------------------
            # Generic fields
            # ----------------------------------

            if (
                record_selector
                and fields
            ):

                page_data = extract_with_fields(
                    response.text,
                    record_selector,
                    fields
                )

            # ----------------------------------
            # Existing title + URL selectors
            # ----------------------------------

            elif (
                record_selector
                and title_selector
                and url_selector
            ):

                page_data = extract_with_selectors(
                    response.text,
                    record_selector,
                    title_selector,
                    url_selector
                )

            # ----------------------------------
            # Automatic extraction
            # ----------------------------------

            else:

                page_data = extract_page_data(
                    response.text
                )

            # ----------------------------------
            # Convert relative URLs
            # ----------------------------------

            for record in page_data:

                if "url" in record:

                    record["url"] = make_absolute_url(
                        response.url,
                        record["url"]
                    )

                for field_name in list(
                    record.keys()
                ):

                    if (
                        field_name.endswith("_url")
                        and field_name != "url"
                    ):

                        record[field_name] = (
                            make_absolute_url(
                                response.url,
                                record[field_name]
                            )
                        )

            # ----------------------------------
            # Add records
            # ----------------------------------

            all_data.extend(
                page_data
            )

            print(
                f"Found {len(page_data)} records"
            )

            # ----------------------------------
            # Automatic pagination
            # ----------------------------------

            if pagination_mode == "auto":

                next_url = detect_next_page_url(
                    response.url,
                    response.text
                )

                if not next_url:

                    print(
                        "No next page found."
                    )

                    break

                current_url = next_url

                print(
                    f"Next page: {current_url}"
                )

        except requests.RequestException as error:

            print(
                f"Could not scrape page "
                f"{page_number}: {error}"
            )

            break

        except ValueError as error:

            print(
                f"Pagination error: {error}"
            )

            break

    return all_data


if __name__ == "__main__":

    url = input(
        "Enter website URL: "
    )

    pages = int(
        input(
            "How many pages do you want "
            "to scrape? "
        )
    )

    pagination_mode = input(
        "Pagination mode "
        "(template/query/auto): "
    ).strip().lower()

    if not pagination_mode:

        pagination_mode = "template"

    record_selector = input(
        "Record selector "
        "(optional): "
    ).strip()

    title_selector = input(
        "Title selector "
        "(optional): "
    ).strip()

    url_selector = input(
        "URL selector "
        "(optional): "
    ).strip()

    data = scrape_multiple_pages(
        url,
        pages,
        record_selector or None,
        title_selector or None,
        url_selector or None,
        pagination_mode
    )

    df = clean_data(
        data
    )

    print(
        "\n-----------------------------"
    )

    print(
        "Scraping completed"
    )

    print(
        "-----------------------------"
    )

    print(
        f"Total records after cleaning: "
        f"{len(df)}"
    )

    if not df.empty:

        print(
            "\nData preview:"
        )

        print(
            df.head(10)
        )

        df.to_csv(
            "data/scraped_data.csv",
            index=False
        )

        print(
            "\nCSV file saved successfully!"
        )

        print(
            "Location: "
            "data/scraped_data.csv"
        )

    else:

        print(
            "\nNo data was found."
        )