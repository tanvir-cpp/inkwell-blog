<p align="center">
  <img src="assets/images/hero-illustration.png" alt="InkWell Banner" width="400">
</p>

<h1 align="center">✦ InkWell</h1>

<p align="center">
  <strong>Stories, Code & Creative Thinking</strong><br>
  A modern, Supabase-powered blog for tutorials, travel, design, and curated resources.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Markdown">
</p>

---

## 🌟 Overview

**InkWell** is a beautifully designed, fully-featured blog platform built with vanilla HTML, CSS, and JavaScript — powered by **Supabase** as the backend CMS. It includes a public-facing blog with rich content rendering and a complete admin panel for managing posts, categories, users, and activity logs.

## ✨ Features

### 📖 Public Blog
- **Hero Section** — Eye-catching landing with featured article highlights
- **Category Navigation** — Browse posts by Coding, Design, Travel, Tech, and Resources
- **Full-Text Search** — Instant search with `Ctrl+K` keyboard shortcut
- **Markdown Rendering** — Built-in Markdown parser with syntax highlighting support
- **Reading Progress Bar** — Visual scroll indicator while reading articles
- **Responsive Design** — Fully mobile-friendly with hamburger menu navigation
- **Newsletter Signup** — Integrated subscription form
- **Pagination** — Paginated article listings with category filters
- **Sidebar Widgets** — Categories, popular tags, and newsletter
- **Scroll Reveal Animations** — Smooth entrance animations on scroll

### 🔧 Admin Panel (`admin.html`)
- **Secure Authentication** — Email/password login via Supabase Auth
- **Dashboard** — Stats overview with total posts, views, published count, and categories
- **Post Management** — Create, edit, publish, draft, archive, and delete posts
- **Markdown Editor** — Rich toolbar with live preview, word count, and reading time
- **Bulk Actions** — Select multiple posts for batch publish, draft, or delete
- **Category Management** — View and organize content categories
- **User Management** — Admin-only user creation with role assignment (Admin/Writer)
- **Activity Log** — Track content changes and user activity
- **Mobile-Friendly** — Full responsive admin layout with collapsible sidebar

### 🛠️ Technical Highlights
- **Zero Framework** — Pure HTML/CSS/JS, no build step required
- **Supabase Backend** — Postgres database, Auth, and real-time capabilities
- **Lucide Icons** — Beautiful, consistent icon set throughout the UI
- **Hash-Based Routing** — Client-side navigation without page reloads
- **SEO Optimized** — Open Graph tags, semantic HTML, and proper heading hierarchy

## 📂 Project Structure

```
inkwell-blog/
├── index.html              # Main blog — home, posts, pages
├── admin.html              # Admin panel — CMS dashboard
├── css/
│   ├── style.css           # Blog styles (35KB)
│   └── admin.css           # Admin panel styles (35KB)
├── js/
│   ├── app.js              # Blog engine — routing, rendering, markdown
│   ├── supabase-config.js  # Supabase client initialization
│   └── env.js              # Environment variables (gitignored)
├── assets/
│   └── images/
│       ├── hero-illustration.png
│       ├── mascot.png
│       ├── featured-workspace.png
│       └── articles/       # Article thumbnails
├── about.html              # About page
├── contact.html            # Contact page
├── book-reviews.html       # Book reviews page
├── podcast.html            # Podcast page
├── featured.html           # Featured content
├── productivity.html       # Productivity resources
├── archive.html            # Post archive
├── rss.html                # RSS feed page
├── .env                    # Supabase credentials (gitignored)
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- A [Supabase](https://supabase.com/) project (free tier works)
- A modern web browser
- Any static file server (or just open `index.html`)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/tanvir-cpp/inkwell-blog.git
   cd inkwell-blog
   ```

2. **Configure environment variables**

   Create a `js/env.js` file:

   ```js
   window.ENV = {
     SUPABASE_URL: "https://your-project.supabase.co",
     SUPABASE_ANON_KEY: "your-anon-key-here"
   };
   ```

3. **Set up Supabase tables**

   Your Supabase project needs the following tables:
   - `posts` — Blog articles with title, content (Markdown), category, status, tags, etc.
   - `categories` — Content categories with slug, name, and sort order
   - `profiles` — User profiles linked to Supabase Auth with roles (admin/writer)

4. **Run locally**

   Open `index.html` in your browser, or serve with any static server:

   ```bash
   npx serve .
   ```

5. **Access the admin panel**

   Navigate to `admin.html` and sign in with your Supabase Auth credentials.

## 🎨 Screenshots

|                  Blog Home                  |            Admin Dashboard             |
| :-----------------------------------------: | :------------------------------------: |
| Rich hero section with curated content grid | Stats, recent posts, and quick actions |

|                  Post Editor                  |               Mobile View               |
| :-------------------------------------------: | :-------------------------------------: |
| Markdown editor with toolbar and live preview | Fully responsive with bottom navigation |

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Tanvir Ahmed**
- GitHub: [@tanvir-cpp](https://github.com/tanvir-cpp)

---

<p align="center">
  <img src="assets/images/mascot.png" alt="InkWell Mascot" width="80"><br>
  <em>Made with ♥ and lots of ☕</em>
</p>
