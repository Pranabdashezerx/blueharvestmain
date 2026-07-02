/**
 * Split-curtain scroll — hero parts at the center; next section appears in the gap.
 * Maritime metaphor: surface breaks open to reveal market depth below.
 */
function initSplitScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const scene = document.querySelector('.hero-split-scene');
    if (!scene) {
        return;
    }

    const pin = scene.querySelector('.hero-split-pin');
    const topCurtain = scene.querySelector('.hero-split-curtain--top');
    const bottomCurtain = scene.querySelector('.hero-split-curtain--bottom');
    const foreground = scene.querySelector('.hero-split-foreground');
    const hint = scene.querySelector('.split-scroll-hint');
    const revealSection = document.querySelector('.statistics--split-reveal');

    if (!pin || !topCurtain || !bottomCurtain) {
        return;
    }

    const isMobile = () => window.innerWidth < 768;
    let ticking = false;

    const getProgress = () => {
        const rect = scene.getBoundingClientRect();
        const sceneTop = window.scrollY + rect.top;
        const distance = Math.max(1, scene.offsetHeight - window.innerHeight);
        return Math.min(1, Math.max(0, (window.scrollY - sceneTop) / distance));
    };

    const update = () => {
        const progress = getProgress();
        const mobile = isMobile();
        const halfViewport = window.innerHeight * 0.5;
        const travel = halfViewport * progress;

        topCurtain.style.transform = `translate3d(0, ${-travel}px, 0)`;
        bottomCurtain.style.transform = `translate3d(0, ${travel}px, 0)`;

        if (foreground) {
            const fadeStart = mobile ? 0.06 : 0.12;
            const fadeEnd = mobile ? 0.28 : 0.38;
            const fadeProgress = Math.min(1, Math.max(0, (progress - fadeStart) / (fadeEnd - fadeStart)));
            const opacity = Math.max(0, 1 - fadeProgress);

            foreground.style.transform = `translate3d(0, ${-travel}px, 0)`;
            foreground.style.opacity = String(opacity);
            foreground.classList.toggle('is-hidden', fadeProgress >= 1);
        }

        if (hint) {
            hint.style.opacity = String(Math.max(0, 1 - progress * 2));
            hint.style.transform = `translate3d(-50%, ${progress * 16}px, 0)`;
        }

        if (revealSection) {
            const revealStart = mobile ? 0.14 : 0.15;
            const revealLift = Math.max(0, (progress - revealStart) / (1 - revealStart));
            revealSection.style.setProperty('--split-reveal', String(revealLift));
            revealSection.style.visibility = revealLift > 0 ? 'visible' : '';
        }

        document.body.classList.toggle('split-active', progress > 0.04);
        document.body.classList.toggle('split-complete', progress >= 0.96);
        document.body.classList.toggle('split-past', scene.getBoundingClientRect().bottom <= 0);

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
