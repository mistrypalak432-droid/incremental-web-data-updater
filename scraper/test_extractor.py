from extractor import extract_page_data


html = """
<html>
<body>

<article>
    <a href="/python">Python Developer</a>
    <p>ABC Company</p>
    <p>Ahmedabad</p>
</article>

<article>
    <a href="/data">Data Analyst</a>
    <p>XYZ Company</p>
    <p>Vadodara</p>
</article>

</body>
</html>
"""


data = extract_page_data(html)

for record in data:
    print(record)