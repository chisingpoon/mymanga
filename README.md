# 📚 Master Manga Archive

A high-performance, web-based database for tracking manga original works, magazine serializations, and cross-region (HK/JP) publishing data.

## 🚀 Features

- **Blazing Fast Loading**: Implements a "Cache-First" strategy using `localStorage`. Data appears instantly on repeat visits.
- **Dynamic Data Sync**: Automatically fetches the latest records from Google Sheets via the `opensheet` API.
- **Smart Filtering**: Filter works by publication magazine, search by title, or jump to specific volumes.
- **Cross-Region Linking**: Seamlessly links original magazine entries to specific physical book details using ISBN mapping.
- **Responsive Design**: Built with Tailwind CSS, optimized for both desktop research and mobile viewing.

## 🛠️ Project Structure

- `index.html`: The central portal/landing page.
- `originalworks.html`: Detailed list of all serialized chapters and their original magazine sources.
- `manga-database.html`: The book-level database showing volume details, covers, and table of contents.
- `/assets`: (Recommended) Directory for shared CSS, JS, and image assets.

## 📊 Data Source

The project is powered by a Google Sheets backend. The following sheets are synchronized:
1. **作品完整列表**: Master list of all titles and metadata.
2. **出版目録HK / JP**: Regional publishing details and ISBNs.
3. **書籍收錄作品**: Mapping of which chapters appear in which volumes.

## 🔧 Technical Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (SFC-less via CDN)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: Fetch API + [Opensheet](https://github.com/benborgers/opensheet)
- **Storage**: Browser `localStorage` for performance optimization.

## 📦 Deployment on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Select the `main` branch and `/ (root)` folder.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---
*Note: This project is for archival and research purposes.*
