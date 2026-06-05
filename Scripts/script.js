// ===================== STATE =====================
let currentSlideIndex = {};
let lightboxSlides = [];
let currentLightboxIndex = 0;

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeNavbar();
    initializeScrollToTop();
    initializeSliders();
    initializeLightbox();
    initializeContactForm();
    initializeCharCounter();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeCounters();
    initializeSkillBars();
    registerServiceWorker();
});

// ===================== THEME TOGGLE =====================
function initializeTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===================== NAVBAR =====================
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });

    if (navToggle) {
        navToggle.addEventListener('change', () => {
            document.body.style.overflow = navToggle.checked ? 'hidden' : '';
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (navToggle) {
                navToggle.checked = false;
                document.body.style.overflow = '';
            }
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 70;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
}

// ===================== SCROLL TO TOP =====================
function initializeScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================== SLIDERS =====================
function initializeSliders() {
    document.querySelectorAll('.image-slider').forEach((slider, index) => {
        const slides = slider.querySelectorAll('.slide');
        currentSlideIndex[index] = 0;

        slides.forEach((s, i) => {
            s.style.display = i === 0 ? 'block' : 'none';
            s.style.opacity = i === 0 ? '1' : '0';
        });

        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        if (prev) prev.onclick = () => changeSlide(-1, prev);
        if (next) next.onclick = () => changeSlide(1, next);
    });
}

function changeSlide(direction, button) {
    const slider = button.closest('.image-slider');
    const slides = slider.querySelectorAll('.slide');
    const allSliders = document.querySelectorAll('.image-slider');
    const idx = Array.from(allSliders).indexOf(slider);

    const current = slides[currentSlideIndex[idx]];
    current.style.opacity = '0';
    setTimeout(() => { current.style.display = 'none'; }, 300);

    currentSlideIndex[idx] = (currentSlideIndex[idx] + direction + slides.length) % slides.length;

    const next = slides[currentSlideIndex[idx]];
    next.style.display = 'block';
    setTimeout(() => { next.style.opacity = '1'; }, 10);
}

// ===================== LIGHTBOX =====================
function initializeLightbox() {
    const lightbox = document.getElementById('img-lightbox');
    const lightboxImg = document.getElementById('img-lightbox-img');
    const lightboxCaption = document.getElementById('img-lightbox-caption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox || !lightboxImg) return;

    lightboxSlides = [];

    document.querySelectorAll('.slide img').forEach((img, index) => {
        const caption = img.nextElementSibling ? img.nextElementSibling.textContent : img.alt;
        lightboxSlides.push({ src: img.src, alt: img.alt, caption });

        img.addEventListener('click', () => openLightbox(index));
    });

    const close = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); lightboxMove(-1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); lightboxMove(1); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') lightboxMove(-1);
        if (e.key === 'ArrowRight') lightboxMove(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('img-lightbox');
    const lightboxImg = document.getElementById('img-lightbox-img');
    const lightboxCaption = document.getElementById('img-lightbox-caption');

    if (!lightboxSlides[index]) return;

    currentLightboxIndex = index;
    lightboxImg.src = lightboxSlides[index].src;
    lightboxImg.alt = lightboxSlides[index].alt;
    if (lightboxCaption) lightboxCaption.textContent = lightboxSlides[index].caption;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function lightboxMove(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + lightboxSlides.length) % lightboxSlides.length;
    const lightboxImg = document.getElementById('img-lightbox-img');
    const lightboxCaption = document.getElementById('img-lightbox-caption');

    if (!lightboxSlides[currentLightboxIndex]) return;
    lightboxImg.src = lightboxSlides[currentLightboxIndex].src;
    lightboxImg.alt = lightboxSlides[currentLightboxIndex].alt;
    if (lightboxCaption) lightboxCaption.textContent = lightboxSlides[currentLightboxIndex].caption;
}

// Keep global aliases for inline onclick fallback
function closeLightbox() {
    const lightbox = document.getElementById('img-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}
function lightboxSlide(direction) { lightboxMove(direction); }

// ===================== CONTACT FORM =====================
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Veuillez remplir tous les champs.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Adresse email invalide.', 'error');
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1800);
    });
}

// ===================== NOTIFICATIONS =====================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
    const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${message}</span><button class="notif-close" aria-label="Fermer">&times;</button>`;
    notif.style.cssText = `
        position:fixed;top:20px;right:20px;
        background:${colors[type]};color:#fff;
        padding:14px 20px;border-radius:12px;
        box-shadow:0 8px 30px rgba(0,0,0,0.35);
        z-index:99999;display:flex;align-items:center;
        gap:10px;max-width:380px;font-family:'Poppins',sans-serif;
        font-size:0.9rem;font-weight:500;
        animation:slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notif);
    notif.querySelector('.notif-close').addEventListener('click', () => notif.remove());
    setTimeout(() => { if (notif.parentNode) notif.remove(); }, 5000);
}

// ===================== CHAR COUNTER =====================
function initializeCharCounter() {
    const textarea = document.getElementById('message');
    const counter = document.getElementById('charCount');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = len;
        counter.className = len > 900 ? 'danger' : len > 700 ? 'warn' : '';
    });
}

// ===================== SCROLL ANIMATIONS =====================
function initializeScrollAnimations() {
    const targets = document.querySelectorAll('.section, .skill-card, .project-card, .blog-post, .contact-card, .key-point, .skills-block');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
        observer.observe(el);
    });
}

// ===================== TYPING EFFECT =====================
function initializeTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const titles = [
        'Data Scientist',
        'ML Engineer',
        'Data Analyst',
        'BI Developer',
        'IA Enthusiast'
    ];

    let titleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused = false;

    function type() {
        const current = titles[titleIdx];

        if (paused) return;

        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                paused = true;
                setTimeout(() => { deleting = true; paused = false; tick(); }, 2000);
                return;
            }
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
            }
        }

        tick();
    }

    function tick() {
        const speed = deleting ? 50 : 90;
        setTimeout(type, speed);
    }

    setTimeout(tick, 800);
}

// ===================== COUNTERS =====================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const prefixes = { 'Projets': '', 'Technologies': '+', "Années d'études": '+' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const label = el.nextElementSibling ? el.nextElementSibling.textContent : '';
            const prefix = prefixes[label] || '';
            let current = 0;
            const duration = 1200;
            const steps = 40;
            const increment = target / steps;
            const interval = duration / steps;

            const timer = setInterval(() => {
                current = Math.min(current + increment, target);
                el.textContent = prefix + Math.floor(current);
                if (current >= target) clearInterval(timer);
            }, interval);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// ===================== SKILL PROGRESS BARS =====================
function initializeSkillBars() {
    const fills = document.querySelectorAll('.skill-progress-fill[data-fill]');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const fill = entry.target;
            const value = parseFloat(fill.dataset.fill);
            fill.style.width = (value * 100) + '%';
            fill.style.transform = 'scaleX(1)';
            fill.classList.add('animate');
            observer.unobserve(fill);
        });
    }, { threshold: 0.3 });

    fills.forEach(f => {
        f.style.width = '0%';
        observer.observe(f);
    });
}

// ===================== SERVICE WORKER =====================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

// ===================== GLOBAL STYLES (notifications) =====================
const _style = document.createElement('style');
_style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(110%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
    }
    .notif-close {
        background: none; border: none; color: #fff;
        font-size: 1.1rem; cursor: pointer; margin-left: 6px;
        padding: 0; line-height: 1; opacity: 0.8;
    }
    .notif-close:hover { opacity: 1; }
`;
document.head.appendChild(_style);
