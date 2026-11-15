const header = document.querySelector('.site-header');
const progressBar = document.querySelector('#progress-bar');
const menuButton = document.querySelector('#menu-button');
const nav = document.querySelector('#site-nav');
const floatingTop = document.querySelector('#floating-top');
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updatePageState() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    const showTopControl = window.scrollY > 700;

    progressBar.style.width = `${Math.min(100, progress)}%`;
    header.classList.toggle('scrolled', window.scrollY > 24);
    floatingTop.classList.toggle('visible', showTopControl);
    floatingTop.setAttribute('aria-hidden', String(!showTopControl));
    floatingTop.tabIndex = showTopControl ? 0 : -1;
}

function scrollToTop(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

document.querySelectorAll('#return-to-top, #floating-top').forEach((control) => {
    control.addEventListener('click', scrollToTop);
});

function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion()) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('visible'));
}

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                const active = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-32% 0px -58%', threshold: 0 });

    navLinks.forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) sectionObserver.observe(section);
    });
}

const filterButtons = document.querySelectorAll('.filter-button');
const stories = document.querySelectorAll('.mission-story');
const filterEmpty = document.querySelector('#filter-empty');
const filterStatus = document.querySelector('#filter-status');
const filterNames = { moon: 'Moon', mars: 'Mars', 'deep-space': 'Deep space' };

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
        });

        let visibleCount = 0;
        stories.forEach((story) => {
            const visible = filter === 'all' || story.dataset.category === filter;
            story.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        filterEmpty.hidden = visibleCount !== 0;
        filterStatus.textContent = filter === 'all'
            ? `Showing all ${visibleCount} missions`
            : `Showing ${visibleCount} ${filterNames[filter]} ${visibleCount === 1 ? 'mission' : 'missions'}`;
    });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('#lightbox-close');

document.querySelectorAll('.image-button').forEach((button) => {
    button.addEventListener('click', () => {
        const preview = button.querySelector('img');
        const caption = button.closest('figure').querySelector('figcaption');

        lightboxImage.src = button.dataset.full;
        lightboxImage.alt = preview.alt;
        lightboxCaption.textContent = caption.textContent.trim();
        lightbox.showModal();
    });
});

lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
});

updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });
