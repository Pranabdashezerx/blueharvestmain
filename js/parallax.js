/**
 * Depth parallax — layered scroll motion (hero sinks, content rises, sections drift).
 * Respects prefers-reduced-motion. Disabled on coarse pointers for performance.
 */
function initDepthParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Keep AOS transforms separate from parallax movement
    document.querySelectorAll('[data-parallax][data-aos]').forEach((el) => {
        const speed = el.dataset.parallax;
        const shell = document.createElement('div');
        shell.className = 'parallax-shell';
        shell.dataset.parallax = speed;
        el.removeAttribute('data-parallax');
        el.parentNode.insertBefore(shell, el);
        shell.appendChild(el);
    });

    const splitScene = document.querySelector('.hero-split-scene');
    const hero = document.querySelector('.hero:not(.hero-split-viewport)');
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    const overlay = document.querySelector('.overlay-effects');
    const waveDivider = document.querySelector('.wave-divider');
    const heroParticles = document.querySelector('.hero-particles');
    const parallaxItems = document.querySelectorAll('[data-parallax]');

    if (!hero && !parallaxItems.length) {
        return;
    }

    const isMobile = () => window.innerWidth < 768;
    let ticking = false;

    const update = () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const mobileFactor = isMobile() ? 0.55 : 1;

        if (hero && heroImage && !splitScene) {
            const heroHeight = hero.offsetHeight || vh;
            const progress = Math.min(1, Math.max(0, scrollY / heroHeight));

            heroImage.style.setProperty('--parallax-y', `${progress * 150 * mobileFactor}px`);
            heroImage.style.setProperty('--parallax-scale', `${1 + progress * 0.08}`);

            if (heroContent) {
                heroContent.style.setProperty('--parallax-y', `${progress * -95 * mobileFactor}px`);
            }

            if (overlay) {
                overlay.style.setProperty('--parallax-y', `${progress * 70 * mobileFactor}px`);
            }

            if (waveDivider) {
                waveDivider.style.transform = `translate3d(0, ${progress * 55 * mobileFactor}px, 0)`;
            }

            if (heroParticles) {
                heroParticles.style.transform = `translate3d(0, ${scrollY * 0.12 * mobileFactor}px, 0)`;
            }
        }

        parallaxItems.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.08;
            const rect = el.getBoundingClientRect();

            if (rect.bottom < -80 || rect.top > vh + 80) {
                return;
            }

            const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
            const y = centerOffset * speed * -1 * mobileFactor;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
        });

        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
}
