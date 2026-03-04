/* ==========================================================================
   InkWell Blog — Core Application Engine
   Handles routing, rendering, markdown parsing, search, and interactivity
   Now powered by Supabase CMS with fallback to local JSON
   ========================================================================== */

(function () {
  'use strict';

  // ─── State ───
  const state = {
    posts: [],
    categories: [],
    siteConfig: {},
    currentView: 'home', // 'home' | 'post'
    currentPost: null,
    activeCategory: 'all',
    searchQuery: '',
    page: 1,
    postsPerPage: 6,
    useSupabase: false,
  };

  // ─── DOM Cache ───
  const dom = {};

  // ─── Init ───
  async function init() {
    cacheDom();
    await loadData();
    setupEventListeners();
    handleRoute();
    setupScrollEffects();
    setupRevealAnimations();
  }

  // ─── Cache DOM Elements ───
  function cacheDom() {
    dom.header = document.querySelector('.site-header');
    dom.heroSection = document.querySelector('.hero');
    dom.curatedSection = document.querySelector('.curated-section');
    dom.articlesSection = document.querySelector('.articles-section');
    dom.homeView = document.getElementById('home-view');
    dom.postView = document.getElementById('post-view');
    dom.articlesList = document.getElementById('articles-list');
    dom.featuredGrid = document.getElementById('featured-grid');
    dom.categoryFilters = document.getElementById('category-filters');
    dom.sidebarCategories = document.getElementById('sidebar-categories');
    dom.sidebarTags = document.getElementById('sidebar-tags');
    dom.pagination = document.getElementById('pagination');
    dom.searchOverlay = document.getElementById('search-overlay');
    dom.searchInput = document.getElementById('search-input');
    dom.searchResults = document.getElementById('search-results');
    dom.searchToggle = document.getElementById('search-toggle');
    dom.searchClose = document.getElementById('search-close');
    dom.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    dom.mainNav = document.getElementById('main-nav');
    dom.readingProgress = document.getElementById('reading-progress');
    dom.postHeroImg = document.getElementById('post-hero-img');
    dom.postCategory = document.getElementById('post-category');
    dom.postTitle = document.getElementById('post-title');
    dom.postSubtitle = document.getElementById('post-subtitle');
    dom.postAuthor = document.getElementById('post-author');
    dom.postDate = document.getElementById('post-date');
    dom.postReadTime = document.getElementById('post-read-time');
    dom.postBody = document.getElementById('post-body');
    dom.postAuthorAvatar = document.getElementById('post-author-avatar');
    dom.heroTitle = document.getElementById('hero-title');
    dom.heroSubtitle = document.getElementById('hero-subtitle');
    dom.pageView = document.getElementById('page-view');
    dom.pageTitle = document.getElementById('page-title');
    dom.pageBody = document.getElementById('page-body');
  }

  // ─── Load Data — Supabase ───
  async function loadData() {
    if (window.supabase && typeof supabase !== 'undefined') {
      try {
        const [postsRes, catsRes] = await Promise.all([
          supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('date', { ascending: false }),
          supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
        ]);

        if (postsRes.data && postsRes.data.length > 0) {
          state.posts = postsRes.data.map(p => ({
            id: p.id,
            slug: p.slug || p.id,
            title: p.title,
            subtitle: p.subtitle,
            category: p.category_id,
            tags: p.tags || [],
            author: p.author_name,
            authorAvatar: p.author_avatar,
            date: p.date,
            readTime: p.read_time,
            thumbnail: p.thumbnail,
            excerpt: p.excerpt,
            content: p.content,
            mediaUrl: p.media_url,
            featured: p.featured,
            views: p.views || 0,
            markdown: null, // Content stored directly in DB
          }));
          state.useSupabase = true;
          console.log('✅ Loaded from Supabase:', state.posts.length, 'posts');
        }

        if (catsRes.data && catsRes.data.length > 0) {
          state.categories = catsRes.data;
        }
      } catch (err) {
        console.warn('Supabase load failed:', err);
      }
    } else {
      console.error('Supabase client not found!');
    }
  }

  // ─── Event Listeners ───
  function setupEventListeners() {
    // Search
    dom.searchToggle.addEventListener('click', openSearch);
    dom.searchClose.addEventListener('click', closeSearch);
    dom.searchInput.addEventListener('input', handleSearch);
    dom.searchOverlay.addEventListener('click', (e) => {
      if (e.target === dom.searchOverlay) closeSearch();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    });

    // Mobile menu
    dom.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Logo click -> home
    document.querySelector('.logo').addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });

    // Nav link category filtering
    document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const nav = link.dataset.nav;

        // Update active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close mobile menu if open
        dom.mobileMenuToggle.classList.remove('active');
        dom.mainNav.classList.remove('active');

        if (nav === 'home') {
          state.activeCategory = 'all';
          navigateTo('home');
        } else {
          if (state.currentView !== 'home') {
            window.location.hash = '';
            state.currentView = 'home';
            dom.homeView.style.display = 'block';
            dom.postView.classList.remove('active');
            dom.heroSection.style.display = 'block';
            dom.readingProgress.style.width = '0';
            renderFeatured();
            renderSidebar();
          }
          state.activeCategory = nav;
          state.page = 1;
          renderCategoryFilters();
          renderArticles();
          setTimeout(() => {
            dom.articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });
    });

    // Hash change
    window.addEventListener('hashchange', handleRoute);

    // Reading progress
    window.addEventListener('scroll', updateReadingProgress);
  }

  // ─── Routing ───
  function handleRoute() {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith('page/')) {
      const pageId = hash.replace('page/', '');
      showPage(pageId);
      return;
    }

    if (hash.startsWith('post/')) {
      const postId = hash.replace('post/', '');
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        showPost(post);
        return;
      }
    }

    showHome();
  }

  function navigateTo(view, postId) {
    if (view === 'home') {
      window.location.hash = '';
      showHome();
    } else if (view === 'post' && postId) {
      window.location.hash = `post/${postId}`;
    }
  }

  // ─── Show Home View ───
  function showHome() {
    state.currentView = 'home';
    state.currentPost = null;

    dom.homeView.style.display = 'block';
    dom.postView.classList.remove('active');
    if (dom.pageView) dom.pageView.style.display = 'none';
    dom.heroSection.style.display = 'block';
    dom.readingProgress.style.width = '0';

    renderFeatured();
    renderCategoryFilters();
    renderArticles();
    renderSidebar();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Show Post View ───
  async function showPost(post) {
    state.currentView = 'post';
    state.currentPost = post;

    dom.homeView.style.display = 'none';
    dom.heroSection.style.display = 'none';
    if (dom.pageView) dom.pageView.style.display = 'none';
    dom.postView.classList.add('active');

    // Increment view count in Supabase (fire and forget)
    if (state.useSupabase) {
      supabase.rpc('increment_views', { post_id: post.id }).then(() => { }, () => { });
    }

    // Update post header
    dom.postHeroImg.src = post.thumbnail;
    dom.postHeroImg.alt = post.title;
    dom.postCategory.textContent = post.category;
    dom.postCategory.dataset.category = post.category;
    dom.postTitle.textContent = post.title;
    dom.postSubtitle.textContent = post.subtitle;
    dom.postAuthor.textContent = post.author;
    dom.postDate.textContent = formatDate(post.date);
    dom.postReadTime.textContent = post.readTime;
    dom.postAuthorAvatar.textContent = post.authorAvatar;

    // Remove any existing media player
    const existingPlayer = dom.postBody.parentNode.querySelector('.post-media-player');
    if (existingPlayer) existingPlayer.remove();

    // Render Audio / Media Player if present
    if (post.mediaUrl) {
      const playerWrapper = document.createElement('div');
      playerWrapper.className = 'post-media-player';
      playerWrapper.style.margin = '2rem auto';
      playerWrapper.style.maxWidth = 'var(--max-width-sm)';
      playerWrapper.style.padding = '0 var(--space-xl)';

      // Check if it's a direct audio file or an embed
      if (post.mediaUrl.match(/\.(mp3|wav|ogg)$/i)) {
        playerWrapper.innerHTML = `
          <div style="background: var(--off-white); padding: var(--space-xl); border-radius: 12px; border: 1px solid var(--gray-200);">
              <h3 style="font-family: var(--font-display); font-size: 1.2rem; color: var(--navy); margin-bottom: var(--space-md); display:flex; align-items:center; gap: 8px;">
                 <i data-lucide="headphones" style="width:20px;height:20px;color:var(--pink);"></i> Listen to Episode
              </h3>
              <audio controls style="width: 100%; outline: none;">
                  <source src="${post.mediaUrl}" type="audio/mpeg">
                  Your browser does not support the audio element.
              </audio>
          </div>
        `;
      } else if (post.mediaUrl.includes('youtube.com') || post.mediaUrl.includes('youtu.be')) {
        let youtubeId = '';
        if (post.mediaUrl.includes('youtube.com/watch?v=')) {
          youtubeId = post.mediaUrl.split('v=')[1].split('&')[0];
        } else if (post.mediaUrl.includes('youtu.be/')) {
          youtubeId = post.mediaUrl.split('youtu.be/')[1].split('?')[0];
        } else if (post.mediaUrl.includes('youtube.com/embed/')) {
          youtubeId = post.mediaUrl.split('youtube.com/embed/')[1].split('?')[0];
        }

        if (youtubeId) {
          playerWrapper.innerHTML = `
            <div style="border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-sm); position: relative; padding-bottom: 56.25%; height: 0;">
              <iframe src="https://www.youtube.com/embed/${youtubeId}?rel=0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          `;
        }
      } else if (post.mediaUrl.includes('spotify.com') || post.mediaUrl.includes('soundcloud.com')) {
        // Assume it's an iframe embed if it contains common embed domains
        playerWrapper.innerHTML = `
          <div style="border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-sm);">
            ${post.mediaUrl.startsWith('<iframe') ? post.mediaUrl : `<iframe src="${post.mediaUrl}" width="100%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`}
          </div>
        `;
      } else {
        // Fallback simple link
        playerWrapper.innerHTML = `<a href="${post.mediaUrl}" target="_blank" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;"><i data-lucide="play-circle" style="width:16px;height:16px;"></i> Play Media External</a>`;
      }

      dom.postBody.parentNode.insertBefore(playerWrapper, dom.postBody);
      lucide.createIcons();
    }

    // Render content
    if (post.content) {
      // Content from Supabase (stored as markdown string)
      dom.postBody.innerHTML = parseMarkdown(post.content);
    } else if (post.markdown) {
      // Content from local markdown file
      try {
        const res = await fetch(post.markdown);
        const markdown = await res.text();
        dom.postBody.innerHTML = parseMarkdown(markdown);
      } catch (err) {
        dom.postBody.innerHTML = '<p>Failed to load article content.</p>';
        console.error('Markdown load error:', err);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Show Page View ───
  function showPage(pageId) {
    state.currentView = 'page';
    dom.homeView.style.display = 'none';
    dom.heroSection.style.display = 'none';
    dom.postView.classList.remove('active');
    if (dom.pageView) dom.pageView.style.display = 'block';

    const pages = {
      'about': { title: 'About Us', content: '<p>Welcome to InkWell. We are a passionate team of writers, developers, and designers sharing our thoughts with the world. We believe in the power of stories, code, and creative thinking.</p>' },
      'contact': { title: 'Contact', content: '<p>Have a question or want to work with us? Drop us an email at <strong>hello@inkwellblog.com</strong>.</p>' },
      'book-reviews': { title: 'Book Reviews', content: '<p>Check out our latest reviews on programming, design, and productivity books.</p>' },
      'productivity': { title: 'Productivity', content: '<p>Resources, tools, and guides to help you work smarter and stay organized.</p>' },
      'featured': { title: 'Featured Series', content: '<p>A collection of our best and most deeply researched multi-part series.</p>' },
      'archive': { title: 'Archive', content: '<p>Looking for something specific? Browse our complete archive of published work.</p>' },
      'podcast': { title: 'Podcast', content: '<p>Listen to the official InkWell podcast where we discuss technology, design, and the creative life. Available on Spotify and Apple Podcasts.</p>' },
      'rss': { title: 'RSS Feed', content: '<p>Subscribe to our <a href="#">RSS Feed</a> to get the latest articles delivered directly to your reader.</p>' }
    };

    const page = pages[pageId] || { title: 'Page Not Found', content: '<p>We could not find the page you are looking for.</p>' };

    if (dom.pageTitle) dom.pageTitle.textContent = page.title;
    if (dom.pageBody) dom.pageBody.innerHTML = page.content;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Render Featured Cards ───
  function renderFeatured() {
    const featured = state.posts.slice(0, 3);
    dom.featuredGrid.innerHTML = featured.map(post => `
      <div class="featured-card" onclick="window.location.hash='post/${post.id}'">
        <img class="featured-card-image" src="${post.thumbnail}" alt="${post.title}" loading="lazy">
        <div class="featured-card-content">
          <span class="category-badge" data-category="${post.category}">
            <i data-lucide="${getCategoryIcon(post.category)}"></i>
            ${post.category}
          </span>
          <h3 class="featured-card-title">${post.title}</h3>
          <p class="featured-card-subtitle">${post.subtitle}</p>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  // ─── Render Category Filters ───
  function renderCategoryFilters() {
    const allBtn = `<button class="category-filter ${state.activeCategory === 'all' ? 'active' : ''}" data-category="all">
      <i data-lucide="layers"></i> All
    </button>`;

    const catBtns = state.categories.map(cat => `
      <button class="category-filter ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <i data-lucide="${cat.icon}"></i> ${cat.name}
      </button>
    `).join('');

    dom.categoryFilters.innerHTML = allBtn + catBtns;

    dom.categoryFilters.querySelectorAll('.category-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        state.page = 1;
        renderCategoryFilters();
        renderArticles();
      });
    });

    refreshIcons();
  }

  // ─── Render Articles ───
  function renderArticles() {
    const filtered = state.activeCategory === 'all'
      ? state.posts
      : state.posts.filter(p => p.category === state.activeCategory);

    const start = (state.page - 1) * state.postsPerPage;
    const paged = filtered.slice(start, start + state.postsPerPage);

    if (paged.length === 0) {
      dom.articlesList.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--gray-400); font-family:var(--font-ui);">
          <i data-lucide="search" style="width:48px;height:48px;margin:0 auto var(--space-lg);display:block;opacity:0.3;"></i>
          <p>No articles found in this category yet.</p>
        </div>
      `;
      dom.pagination.innerHTML = '';
      refreshIcons();
      return;
    }

    dom.articlesList.innerHTML = paged.map((post, i) => `
      <article class="article-card" style="animation-delay:${0.1 * (i + 1)}s" onclick="window.location.hash='post/${post.id}'">
        <img class="article-card-image" src="${post.thumbnail}" alt="${post.title}" loading="lazy">
        <div class="article-card-content">
          <span class="category-badge" data-category="${post.category}">
            <i data-lucide="${getCategoryIcon(post.category)}" style="width:14px;height:14px;"></i>
            ${post.category}
          </span>
          <h3 class="article-card-title">${post.title}</h3>
          <p class="article-card-subtitle">${post.subtitle || post.excerpt}</p>
        </div>
      </article>
    `).join('');

    const totalPages = Math.ceil(filtered.length / state.postsPerPage);
    renderPagination(totalPages);
    refreshIcons();
  }

  // ─── Render Pagination ───
  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      dom.pagination.innerHTML = '';
      return;
    }

    let html = `<button class="pagination-btn" ${state.page <= 1 ? 'disabled' : ''} data-page="${state.page - 1}">
      <i data-lucide="chevron-left" style="width:14px;height:14px;"></i> Prev
    </button>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn ${state.page === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="pagination-btn" ${state.page >= totalPages ? 'disabled' : ''} data-page="${state.page + 1}">
      Next <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
    </button>`;

    dom.pagination.innerHTML = html;

    dom.pagination.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        state.page = parseInt(btn.dataset.page);
        renderArticles();
        dom.articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    refreshIcons();
  }

  // ─── Render Sidebar ───
  function renderSidebar() {
    const categoryCounts = {};
    state.posts.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    dom.sidebarCategories.innerHTML = state.categories.map(cat => `
      <div class="sidebar-cat-item" data-category="${cat.id}">
        <span><i data-lucide="${cat.icon}" style="width:16px;height:16px;"></i> ${cat.name}</span>
        <span class="sidebar-cat-count">${categoryCounts[cat.id] || 0}</span>
      </div>
    `).join('');

    dom.sidebarCategories.querySelectorAll('.sidebar-cat-item').forEach(item => {
      item.addEventListener('click', () => {
        state.activeCategory = item.dataset.category;
        state.page = 1;
        renderCategoryFilters();
        renderArticles();
      });
    });

    const allTags = new Set();
    state.posts.forEach(p => {
      if (p.tags) p.tags.forEach(t => allTags.add(t));
    });
    dom.sidebarTags.innerHTML = [...allTags].map(tag =>
      `<span class="sidebar-tag">${tag}</span>`
    ).join('');

    refreshIcons();
  }

  // ─── Search ───
  function openSearch() {
    dom.searchOverlay.classList.add('active');
    dom.searchInput.value = '';
    dom.searchResults.innerHTML = '';
    setTimeout(() => dom.searchInput.focus(), 200);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    dom.searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleSearch() {
    const query = dom.searchInput.value.toLowerCase().trim();
    if (query.length < 2) {
      dom.searchResults.innerHTML = '<p class="search-hint">Type at least 2 characters to search...</p>';
      return;
    }

    const results = state.posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.subtitle.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(query))) ||
      post.category.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      dom.searchResults.innerHTML = '<p class="search-hint">No articles found. Try a different search term.</p>';
      return;
    }

    dom.searchResults.innerHTML = results.map(post => `
      <div class="search-result-item" onclick="window.location.hash='post/${post.id}'; document.getElementById('search-overlay').classList.remove('active'); document.body.style.overflow='';">
        <img src="${post.thumbnail}" alt="${post.title}">
        <div class="search-result-info">
          <h3>${highlightMatch(post.title, query)}</h3>
          <p>${post.subtitle}</p>
        </div>
      </div>
    `).join('');
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span style="color:var(--teal);">$1</span>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ─── Mobile Menu ───
  function toggleMobileMenu() {
    dom.mobileMenuToggle.classList.toggle('active');
    dom.mainNav.classList.toggle('active');
  }

  // ─── Scroll Effects ───
  function setupScrollEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 20;
      dom.header.classList.toggle('scrolled', scrolled);
    });
  }

  // ─── Reading Progress ───
  function updateReadingProgress() {
    if (state.currentView !== 'post') {
      dom.readingProgress.style.width = '0';
      return;
    }

    const postBody = dom.postBody;
    const rect = postBody.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = postBody.scrollHeight;

    const scrolledIntoPost = Math.max(0, -rect.top);
    const progress = Math.min(100, (scrolledIntoPost / (totalHeight - windowHeight)) * 100);

    dom.readingProgress.style.width = `${progress}%`;
  }

  // ─── Reveal Animations ───
  function setupRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ─── Markdown Parser ───
  function parseMarkdown(md) {
    let html = md;

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Tables
    html = html.replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (match, header, body) => {
      const headers = header.split('|').map(h => h.trim()).filter(Boolean);
      const rows = body.trim().split('\n').map(row =>
        row.split('|').map(cell => cell.trim()).filter(Boolean)
      );

      let table = '<table><thead><tr>';
      headers.forEach(h => table += `<th>${h}</th>`);
      table += '</tr></thead><tbody>';
      rows.forEach(row => {
        table += '<tr>';
        row.forEach(cell => table += `<td>${cell}</td>`);
        table += '</tr>';
      });
      table += '</tbody></table>';
      return table;
    });

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs
    html = html.split('\n\n').map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<')) return block;
      return `<p>${block}</p>`;
    }).join('\n');

    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/\n/g, ' ');

    return html;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Helpers ───
  function getCategoryIcon(category) {
    const cat = state.categories.find(c => c.id === category);
    return cat ? cat.icon : 'file-text';
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // ─── Boot ───
  document.addEventListener('DOMContentLoaded', init);
})();
