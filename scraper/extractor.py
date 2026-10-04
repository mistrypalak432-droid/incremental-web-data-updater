from bs4 import BeautifulSoup


def extract_page_data(html):
    """
    Basic automatic extraction.

    Extracts links from the page and returns
    title + url.
    """

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    records = []

    for link in soup.find_all(
        "a",
        href=True
    ):
        title = link.get_text(
            " ",
            strip=True
        )

        if not title:
            continue

        records.append({
            "title": title,
            "url": link["href"]
        })

    return records


def extract_with_selectors(
    html,
    record_selector,
    title_selector,
    url_selector
):
    """
    Existing title + URL extraction.

    This is kept for backward compatibility.
    """

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    records = []

    record_elements = soup.select(
        record_selector
    )

    for record in record_elements:

        title_element = record.select_one(
            title_selector
        )

        url_element = record.select_one(
            url_selector
        )

        title = ""

        if title_element:
            title = title_element.get_text(
                " ",
                strip=True
            )

        link = ""

        if url_element:
            link = url_element.get(
                "href",
                ""
            )

        if not title:
            continue

        records.append({
            "title": title,
            "url": link
        })

    return records


def extract_with_fields(
    html,
    record_selector,
    fields
):
    """
    Generic multi-field extraction.

    Example:

    fields = {
        "title": ".title",
        "company": ".company",
        "location": ".location",
        "price": ".price",
        "url": "a"
    }

    Each selector is searched inside every
    record element.
    """

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    records = []

    record_elements = soup.select(
        record_selector
    )

    for record in record_elements:

        extracted_record = {}

        for field_name, selector in fields.items():

            element = record.select_one(
                selector
            )

            if not element:
                extracted_record[field_name] = ""
                continue

            # URL fields use href
            if (
                field_name.lower() == "url"
                or field_name.lower().endswith("_url")
            ):
                value = element.get(
                    "href",
                    ""
                )

            else:
                value = element.get_text(
                    " ",
                    strip=True
                )

            extracted_record[field_name] = value

        # Do not add completely empty records
        has_data = any(
            str(value).strip()
            for value in extracted_record.values()
        )

        if has_data:
            records.append(
                extracted_record
            )

    return records