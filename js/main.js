/* ============================================================
   PLUMBER PRO TEMPLATE — main.js (v2.0 Premium)
   ============================================================
   Interactions vanilla (aucune dépendance). Formulaires : envoi
   simulé — voir README pour brancher Formspree.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   UTILITAIRES
   ------------------------------------------------------------ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ------------------------------------------------------------
   1. MARQUEUR JS GLOBAL (permet le CSS de masquer [data-animate]
   uniquement quand JS est actif)
   ------------------------------------------------------------ */
document.documentElement.classList.add('js-enabled');

/* ------------------------------------------------------------
   2. SWITCHER DE THÈME (ocean | navy | crimson)
   ------------------------------------------------------------ */
function initTheme() {
    const THEMES = ['ocean', 'navy', 'crimson'];
    const STORAGE_KEY = 'plumberpro-theme';

    /** Applique un thème (avec repli sûr si valeur inconnue). */
    const applyTheme = (name) => {
        if (!THEMES.includes(name)) name = 'ocean';
        document.documentElement.setAttribute('data-theme', name);
        $$('.theme-dot').forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.themeOption === name);
        });
    };

    // Thème sauvegardé, sinon celui du HTML (data-theme par défaut)
    let saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { /* localStorage indisponible (mode privé) */ }
    if (saved) applyTheme(saved);

    $$('.theme-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            const name = dot.dataset.themeOption;
            applyTheme(name);
            try {
                localStorage.setItem(STORAGE_KEY, name);
            } catch (e) { /* ignoré */ }
        });
    });

    // Synchronisation entre onglets
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue);
    });
}

/* ------------------------------------------------------------
   3. MENU MOBILE
   ------------------------------------------------------------ */
function initMobileMenu() {
    const btn = $('.mobile-menu-btn');
    const menu = $('.mobile-menu');
    if (!btn || !menu) return;

    const setMenu = (open) => {
        menu.classList.toggle('active', open);
        btn.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
        btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    $$('.mobile-menu a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) setMenu(false);
    });
}

/* ------------------------------------------------------------
   4. HEADER : ombre au défilement
   ------------------------------------------------------------ */
function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;

    const update = () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ------------------------------------------------------------
   5. BARRE DE PROGRESSION DE LECTURE
   ------------------------------------------------------------ */
function initScrollProgress() {
    const bar = $('.scroll-progress-bar');
    if (!bar) return;

    const update = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* ------------------------------------------------------------
   6. ANIMATIONS À L'APPARITION
   ------------------------------------------------------------ */
function initScrollAnimations() {
    const items = $$('[data-animate]');
    if (!items.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('animate-fade-in-up'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   7. COMPTEURS ANIMÉS — <span data-counter="1500">0</span>
   ------------------------------------------------------------ */
function initCounters() {
    const counters = $$('[data-counter]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const animate = (el) => {
        const target = parseInt(el.dataset.counter, 10);
        if (Number.isNaN(target)) return;
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   8. FAQ ACCORDÉON
   ------------------------------------------------------------ */
function initFaq() {
    const items = $$('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
        const question = $('.faq-question', item);
        if (!question) return;

        question.addEventListener('click', () => {
            const wasOpen = item.classList.contains('active');
            items.forEach((other) => {
                other.classList.remove('active');
                const q = $('.faq-question', other);
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!wasOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ------------------------------------------------------------
   9. CARROUSEL TÉMOIGNAGES (auto-play + boucle)
   ------------------------------------------------------------ */
function initTestimonialCarousel() {
    const track = $('.testimonials-track');
    if (!track) return;

    const cards = $$('.testimonial-card', track);
    const dots = $$('.testimonial-dot');
    const prev = $('.testimonial-arrow.prev');
    const next = $('.testimonial-arrow.next');
    if (!cards.length) return;

    let index = 0;
    let timer = null;

    const goTo = (i) => {
        index = (i + cards.length) % cards.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, j) => d.classList.toggle('active', j === index));
    };

    const startAuto = () => {
        stopAuto();
        timer = setInterval(() => goTo(index + 1), 6000);
    };
    const stopAuto = () => {
        if (timer) { clearInterval(timer); timer = null; }
    };

    if (prev) prev.addEventListener('click', () => { goTo(index - 1); startAuto(); });
    if (next) next.addEventListener('click', () => { goTo(index + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

    // Pause au survol et quand l'onglet est masqué
    const wrap = track.closest('.testimonials-carousel') || track;
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopAuto() : startAuto();
    });

    // Navigation clavier (flèches) quand le carrousel a le focus
    wrap.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goTo(index - 1); startAuto(); }
        if (e.key === 'ArrowRight') { goTo(index + 1); startAuto(); }
    });

    // Swipe tactile
    let touchX = null;
    wrap.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) { goTo(dx < 0 ? index + 1 : index - 1); startAuto(); }
        touchX = null;
    }, { passive: true });

    goTo(0);
    startAuto();
}

/* ------------------------------------------------------------
   10. SLIDERS AVANT / APRÈS (comparaison draggable)
   ------------------------------------------------------------ */
function initBeforeAfter() {
    const widgets = $$('.before-after');
    if (!widgets.length) return;

    widgets.forEach((widget) => {
        const before = $('.ba-before', widget);
        const handle = $('.ba-handle', widget);
        if (!before || !handle) return;

        let dragging = false;

        const setPos = (clientX) => {
            const rect = widget.getBoundingClientRect();
            const pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
            widget.style.setProperty('--ba-position', `${pct}%`);
        };

        const onDown = (e) => {
            dragging = true;
            setPos(e.touches ? e.touches[0].clientX : e.clientX);
        };
        const onMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            setPos(e.touches ? e.touches[0].clientX : e.clientX);
        };
        const onUp = () => { dragging = false; };

        handle.addEventListener('mousedown', onDown);
        handle.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);

        // Clic direct sur le comparatif : positionne la poignée
        widget.addEventListener('click', (e) => {
            if (e.target.closest('.ba-handle')) return;
            setPos(e.clientX);
        });

        // État initial : 50%
        widget.style.setProperty('--ba-position', '50%');
    });
}

/* ------------------------------------------------------------
   11. WIDGET DE PRISE DE RENDEZ-VOUS
   Jours des 14 prochains jours + créneaux horaires fixes.
   Le choix est répliqué dans un input caché (name="rendez_vous")
   pour partir avec le formulaire.
   ------------------------------------------------------------ */
function initBooking() {
    const widget = $('.booking-widget');
    if (!widget) return;

    const daysWrap = $('.booking-days', widget);
    const slotsWrap = $('.booking-slots', widget);
    const summary = $('.booking-summary', widget);
    const hidden = $('.booking-value', widget);
    if (!daysWrap || !slotsWrap) return;

    const CRENEAUX = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];
    const DAY_NAMES = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
    const MONTH_NAMES = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    let selectedDay = null;   // élément .booking-day actif
    let selectedSlot = null;  // élément .booking-slot actif

    /** Génère le libellé complet, ex. « mardi 30 sept. à 14:00 ». */
    const formatSummary = (dayEl, slot) => {
        const d = new Date(dayEl.dataset.date);
        return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} à ${slot}`;
    };

    const updateSummary = () => {
        if (!selectedDay || !selectedSlot) return;
        if (summary) {
            $('.booking-summary-text', summary).textContent =
                `Rendez-vous souhaité : ${formatSummary(selectedDay, selectedSlot.textContent.trim())}`;
            summary.classList.add('visible');
        }
        if (hidden) {
            hidden.value = formatSummary(selectedDay, selectedSlot.textContent.trim());
        }
    };

    // --- Génération des 14 prochains jours (dimanche désactivé) ---
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const isSunday = d.getDay() === 0;
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.className = `booking-day${isSunday ? ' disabled' : ''}`;
        dayBtn.dataset.date = d.toISOString().slice(0, 10);
        dayBtn.disabled = isSunday;

        const name = document.createElement('span');
        name.className = 'booking-day-name';
        name.textContent = i === 0 ? "auj." : i === 1 ? 'demain' : DAY_NAMES[d.getDay()];

        const num = document.createElement('span');
        num.className = 'booking-day-num';
        num.textContent = d.getDate();

        dayBtn.append(name, num);
        daysWrap.appendChild(dayBtn);

        if (!isSunday) {
            dayBtn.addEventListener('click', () => {
                if (selectedDay) selectedDay.classList.remove('selected');
                selectedDay = dayBtn;
                selectedDay.classList.add('selected');
                updateSummary();
            });
        }
    }

    // --- Créneaux horaires ---
    CRENEAUX.forEach((slot) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'booking-slot';
        btn.textContent = slot;
        btn.addEventListener('click', () => {
            if (selectedSlot) selectedSlot.classList.remove('selected');
            selectedSlot = btn;
            selectedSlot.classList.add('selected');
            updateSummary();
        });
        slotsWrap.appendChild(btn);
    });
}

/* ------------------------------------------------------------
   12. FORMULAIRES (validation + succès simulé)
   ------------------------------------------------------------ */
function initForms() {
    const forms = $$('form[data-demo-form]');
    if (!forms.length) return;

    const showError = (field, message) => {
        field.classList.add('is-invalid');
        const group = field.closest('.form-group');
        if (!group) return;
        let error = $('.form-error', group);
        if (!error) {
            error = document.createElement('p');
            error.className = 'form-error';
            group.appendChild(error);
        }
        error.textContent = message;
    };

    const clearError = (field) => {
        field.classList.remove('is-invalid');
        const group = field.closest('.form-group');
        const error = group && $('.form-error', group);
        if (error) error.remove();
    };

    forms.forEach((form) => {
        form.setAttribute('novalidate', 'novalidate');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;

            $$('[required]', form).forEach((field) => {
                clearError(field);
                const isCheckbox = field.type === 'checkbox';
                const value = isCheckbox ? String(field.checked) : field.value.trim();

                if (!value || (isCheckbox && !field.checked)) {
                    showError(field, isCheckbox
                        ? 'Vous devez accepter pour continuer.'
                        : 'Ce champ est obligatoire.');
                    valid = false;
                    return;
                }

                if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError(field, 'Veuillez saisir une adresse e-mail valide.');
                    valid = false;
                }

                if (field.type === 'tel' && !/^[+0-9 ().-]{8,20}$/.test(value)) {
                    showError(field, 'Veuillez saisir un numéro de téléphone valide.');
                    valid = false;
                }
            });

            if (!valid) return;

            // Envoi simulé : masque le formulaire, affiche la confirmation
            const success = form.parentElement.querySelector('.form-success');
            if (success) {
                form.hidden = true;
                success.hidden = false;
                success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.alert('Merci ! Votre demande a bien été enregistrée (démonstration).');
                form.reset();
            }
        });

        // Efface l'erreur dès que l'utilisateur corrige
        $$('[required]', form).forEach((field) => {
            const evt = field.type === 'checkbox' ? 'change' : 'input';
            field.addEventListener(evt, () => clearError(field));
        });
    });
}

/* Bouton « envoyer une autre demande » dans le panneau de succès */
function initSuccessReset() {
    $$('.form-success-reset').forEach((btn) => {
        btn.addEventListener('click', () => {
            const success = btn.closest('.form-success');
            const form = success && success.parentElement.querySelector('form');
            if (form) {
                form.reset();
                form.hidden = false;
            }
            success.hidden = true;
            if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

/* ------------------------------------------------------------
   13. ANNÉE DYNAMIQUE FOOTER
   ------------------------------------------------------------ */
function initFooterYear() {
    $$('[data-current-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
}

/* ------------------------------------------------------------
   INITIALISATION
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initScrollProgress();
    initScrollAnimations();
    initCounters();
    initFaq();
    initTestimonialCarousel();
    initBeforeAfter();
    initBooking();
    initForms();
    initSuccessReset();
    initFooterYear();
});
