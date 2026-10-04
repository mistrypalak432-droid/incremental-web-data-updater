from urllib.parse import (
    urljoin,
    urlparse,
    parse_qs,
    urlencode,
    urlunparse
)



def create_page_url(
    base_url,
    page_number,
    pagination_mode="template"
):
    """
    Create a URL for a specific page.

    Supported modes:

    template:
        https://example.com/page/{page}/

    query:
        https://example.com/jobs?page=1
    """

    if pagination_mode == "template":

        if "{page}" not in base_url:
            raise ValueError(
                "Template pagination requires "
                "'{page}' in the URL."
            )

        return base_url.replace(
            "{page}",
            str(page_number)
        )

    elif pagination_mode == "query":

        parsed = urlparse(base_url)

        query = parse_qs(
            parsed.query
        )

        query["page"] = [
            str(page_number)
        ]

        new_query = urlencode(
            query,
            doseq=True
        )

        return urlunparse(
            (
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment
            )
        )

    else:

        raise ValueError(
            f"Unsupported pagination mode: "
            f"{pagination_mode}"
        )


def make_absolute_url(
    base_url,
    link
):
    """
    Convert a relative URL into an
    absolute URL.
    """

    return urljoin(
        base_url,
        link
    )
def detect_pagination_mode(base_url):
    """
    Try to detect the pagination style
    from the supplied URL.

    Returns:
        "template"
        "query"
        "unknown"
    """

    # {page} already exists
    if "{page}" in base_url:
        return "template"

    parsed = urlparse(base_url)

    # Check for an existing page query parameter
    query = parse_qs(parsed.query)

    if "page" in query:
        return "query"

    return "unknown"
def detect_next_page_url(
    current_url,
    html
):
    """
    Find the next-page URL from the current page.

    Checks common pagination patterns:
    1. rel="next"
    2. .next class
    3. pagination text such as "Next"
    4. aria-label="Next"
    """

    from bs4 import BeautifulSoup

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    # --------------------------------
    # 1. rel="next"
    # --------------------------------

    next_link = soup.find(
        "a",
        rel=lambda value:
        value and "next" in value
    )

    if next_link and next_link.get("href"):

        return make_absolute_url(
            current_url,
            next_link["href"]
        )

    # --------------------------------
    # 2. Common CSS class: .next
    # --------------------------------

    next_link = soup.select_one(
        "a.next"
    )

    if next_link and next_link.get("href"):

        return make_absolute_url(
            current_url,
            next_link["href"]
        )

    # --------------------------------
    # 3. Pagination containers
    # --------------------------------

    next_link = soup.select_one(
        ".pager .next a, "
        ".pagination .next a, "
        ".pagination-next a"
    )

    if next_link and next_link.get("href"):

        return make_absolute_url(
            current_url,
            next_link["href"]
        )

    # --------------------------------
    # 4. Text / aria-label detection
    # --------------------------------

    next_words = {
        "next",
        "next page",
        "older",
        "›",
        "»",
        "→"
    }

    for link in soup.find_all(
        "a",
        href=True
    ):

        text = link.get_text(
            " ",
            strip=True
        ).lower()

        aria_label = link.get(
            "aria-label",
            ""
        ).lower()

        if text in next_words:

            return make_absolute_url(
                current_url,
                link["href"]
            )

        if aria_label in next_words:

            return make_absolute_url(
                current_url,
                link["href"]
            )

    # Nothing found
    return None