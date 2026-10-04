# 🚀 DataFlow — Incremental Web Data Updater & Change Tracker

### Turn changing websites into trackable, analyzable data.

[🌐 Live Demo](https://incremental-web-data-updater.vercel.app/) · 
[💻 GitHub Repository](https://github.com/mistrypalak432-droid/incremental-web-data-updater)

---

## 💡 What is DataFlow?

Most web scrapers have a simple workflow:

**Enter a URL → Scrape data → Save data**

But what happens when the same website changes tomorrow?

You may have hundreds or thousands of records, and manually comparing the old and new datasets is difficult.

That's the problem I wanted to solve with **DataFlow**.

DataFlow is a web-based scraping and data change-tracking platform that allows users to collect data from public websites, clean and organize it, compare it with previously collected data, and understand exactly what changed.

Instead of only asking:

> **"What data is on this website?"**

DataFlow also asks:

> **"What changed since the last time I collected it?"**

---

# ✨ Why DataFlow is Different

DataFlow is not just a one-time web scraper.

It treats every new scrape as a new version of the dataset and compares it with the previously stored data.

It can identify four important types of changes:

### 🟢 NEW
A record that did not exist before.

### 🟡 CHANGED
An existing record where one or more fields have changed.

### ⚪ UNCHANGED
A record that is still exactly the same.

### 🔴 REMOVED
A record that existed previously but is no longer available.

This makes the project useful for **monitoring changing web data**, not just collecting it.

---

# 🔥 See the Difference

Imagine today's dataset contains:

```text
Product A
Product B
Product C
Product D
