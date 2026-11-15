const header = document.querySelector('.site-header');
const progressBar = document.querySelector('#progress-bar');
const menuButton = document.querySelector('#menu-button');
const nav = document.querySelector('#site-nav');

function updatePageState() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, progress)}%`;
    header.classList.toggle('scrolled', window.scrollY > 24);
}

updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });

const returnToTop = document.querySelector('#return-to-top');
returnToTop.addEventListener('click', (event) => {
    event.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
});

nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const filterButtons = document.querySelectorAll('.filter-button');
const stories = document.querySelectorAll('.mission-story');
const filterEmpty = document.querySelector('#filter-empty');

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
    });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxClose = document.querySelector('#lightbox-close');

document.querySelectorAll('.image-button').forEach((button) => {
    button.addEventListener('click', () => {
        const preview = button.querySelector('img');
        lightboxImage.src = button.dataset.full;
        lightboxImage.alt = preview.alt;
        lightbox.showModal();
    });
});

lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
});
