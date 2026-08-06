// Mobile Menu Toggle Logic
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Global Search Modal Logic
function openGlobalSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('globalSearchInput').focus();
}

function closeGlobalSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Keyboard Shortcut Command+K / Ctrl+K & Escape Key support
document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openGlobalSearch();
    }
    if (e.key === 'Escape') {
        closeGlobalSearch();
    }
});