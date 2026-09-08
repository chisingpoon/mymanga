document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. VUE GLOBAL SEARCH CONTROLLER
    // =========================================================
    if (document.getElementById('app') && typeof Vue !== 'undefined') {
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    searchQuery: '',
                    isFocused: false,
                    loading: true,
                    db: {
                        hk: [],
                        jp: [],
                        movies: [],
                        objects: []
                    }
                }
            },
            computed: {
                searchIndex() {
                    const list = [];

                    // 1. Manga HK Books
                    this.db.hk.forEach(item => {
                        if (!item.Title && !item.出版物標題) return;
                        list.push({
                            id: `hk-${item.ISBN || item.Title}`,
                            category: '香港漫畫',
                            badgeClass: 'bg-blue-100 text-blue-700',
                            title: item.Title || item.出版物標題,
                            subtitle: item.ISBN ? `ISBN: ${item.ISBN}` : '香港版單行本',
                            url: `manga-database.html?region=HK&isbn=${encodeURIComponent(item.ISBN || '')}`
                        });
                    });

                    // 2. Manga JP Books
                    this.db.jp.forEach(item => {
                        if (!item.類 && !item.標題) return;
                        list.push({
                            id: `jp-${item.ISBN || item.標題}`,
                            category: '日本原著',
                            badgeClass: 'bg-emerald-100 text-emerald-700',
                            title: `${item.類 || ''} ${item.巻 || ''}`.trim() || item.標題,
                            subtitle: item.ISBN ? `ISBN: ${item.ISBN}` : '日本原版',
                            url: `manga-database.html?region=JP&isbn=${encodeURIComponent(item.ISBN || '')}`
                        });
                    });

                    // 3. Movies
                    this.db.movies.forEach(item => {
                        const title = item['JP Title'] || item['名稱'] || item['HK Title'];
                        if (!title) return;
                        list.push({
                            id: `movie-${item['Media ID']}`,
                            category: '大長篇電影',
                            badgeClass: 'bg-amber-100 text-amber-700',
                            title: title,
                            subtitle: item['HK Title'] ? `港譯: ${item['HK Title']}` : `${item['JP Release Date'] || ''} 上映`,
                            url: `movie.html?mediaid=${encodeURIComponent(item['Media ID'] || '')}`
                        });
                    });

                    // 4. Media Objects / Gadgets
                    this.db.objects.forEach(item => {
                        const title = item['名稱'] || item['Name'] || item['法寶名稱'];
                        if (!title) return;
                        list.push({
                            id: `obj-${item['ID'] || title}`,
                            category: item['類別'] || '神奇法寶',
                            badgeClass: 'bg-purple-100 text-purple-700',
                            title: title,
                            subtitle: item['日文名稱'] ? `日文: ${item['日文名稱']}` : '',
                            url: `mediaobject.html?id=${encodeURIComponent(item['ID'] || title)}`
                        });
                    });

                    return list;
                },
                searchResults() {
                    const q = this.searchQuery.trim().toLowerCase();
                    if (!q) return [];

                    return this.searchIndex
                        .filter(item => 
                            item.title.toLowerCase().includes(q) || 
                            (item.subtitle && item.subtitle.toLowerCase().includes(q))
                        )
                        .slice(0, 10);
                }
            },
            methods: {
                async fetchDatabase() {
                    this.loading = true;
                    try {
                        const [hk, jp, movies, objects] = await Promise.all([
                            fetch("https://opensheet.elk.sh/1Ker7vSVvehFJw_D7271lONLKs3b0UGj7OIF2aHK3kG8/出版目録HK").then(r => r.json()).catch(() => []),
                            fetch("https://opensheet.elk.sh/1Ker7vSVvehFJw_D7271lONLKs3b0UGj7OIF2aHK3kG8/出版目録JP").then(r => r.json()).catch(() => []),
                            fetch("https://opensheet.elk.sh/1Ker7vSVvehFJw_D7271lONLKs3b0UGj7OIF2aHK3kG8/電影動畫").then(r => r.json()).catch(() => []),
                            fetch("https://opensheet.elk.sh/1Ker7vSVvehFJw_D7271lONLKs3b0UGj7OIF2aHK3kG8/法寶角色與媒體資料").then(r => r.json()).catch(() => [])
                        ]);

                        this.db = { hk, jp, movies, objects };
                    } catch (err) {
                        console.error("Failed to fetch database for search:", err);
                    } finally {
                        this.loading = false;
                    }
                }
            },
            mounted() {
                this.fetchDatabase();
            }
        }).mount('#app');
    }

    // =========================================================
    // 2. NAV DROPDOWNS & MOBILE MENU
    // =========================================================
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');

    dropdownItems.forEach(item => {
        const button = item.querySelector('button');
        const menu = item.querySelector('.nav-dropdown-menu');

        item.addEventListener('mouseenter', () => {
            dropdownItems.forEach(other => {
                if (other !== item) {
                    other.querySelector('button')?.blur();
                    other.querySelector('.nav-dropdown-menu')?.classList.remove('is-active');
                }
            });
        });

        if (button && menu) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('is-active');
                
                dropdownItems.forEach(d => {
                    d.querySelector('button')?.blur();
                    d.querySelector('.nav-dropdown-menu')?.classList.remove('is-active');
                });

                if (!isOpen) {
                    menu.classList.add('is-active');
                }
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown-item')) {
            dropdownItems.forEach(item => {
                item.querySelector('button')?.blur();
                item.querySelector('.nav-dropdown-menu')?.classList.remove('is-active');
            });
        }
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // =========================================================
    // 3. QUICK SEARCH MODAL & SHORTCUTS (Ctrl+K)
    // =========================================================
    const openSearchBtn = document.getElementById('openSearchBtn');
    const openSearchBtnMobile = document.getElementById('openSearchBtnMobile');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchModalBox = document.getElementById('searchModalBox');
    const quickSearchInput = document.getElementById('quickSearchInput');

    function openModal() {
        if (!searchModal || !searchModalBox) return;
        searchModal.classList.remove('opacity-0', 'pointer-events-none');
        searchModalBox.classList.remove('scale-95');
        searchModalBox.classList.add('scale-100');
        setTimeout(() => quickSearchInput?.focus(), 50);
    }

    function closeModal() {
        if (!searchModal || !searchModalBox) return;
        searchModal.classList.add('opacity-0', 'pointer-events-none');
        searchModalBox.classList.remove('scale-100');
        searchModalBox.classList.add('scale-95');
    }

    if (openSearchBtn) openSearchBtn.addEventListener('click', openModal);
    if (openSearchBtnMobile) openSearchBtnMobile.addEventListener('click', openModal);
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openModal();
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    document.querySelectorAll('.quick-jump-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            if (target) {
                window.location.href = target;
            }
        });
    });

    if (quickSearchInput) {
        quickSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && quickSearchInput.value.trim() !== '') {
                window.location.href = `mediaobject.html?q=${encodeURIComponent(quickSearchInput.value.trim())}`;
            }
        });
    }
});
