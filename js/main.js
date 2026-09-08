document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. VUE GLOBAL SEARCH CONTROLLER
    // =========================================================


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
                window.location.href = `mediaobject.html?searchkey=${encodeURIComponent(quickSearchInput.value.trim())}`;
            }
        });
    }
});
