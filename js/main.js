// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen when page is fully loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.dispatchEvent(new MouseEvent('mousemove', {
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2,
            bubbles: true
        }));
    }, 800); // Short delay for better visual effect
    
    // Handle links for page transitions with loading screen
    document.querySelectorAll('a').forEach(link => {
        // Only handle internal links, not external or anchor links
        if (link.href && link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && !link.getAttribute('target')) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;

                if (this.classList.contains('status-tag')) {
                    const heroButtons = this.closest('.hero-buttons');
                    heroButtons?.classList.add('is-navigating');
                    this.classList.add('is-navigating');
                }
                
                // Show loading screen
                document.body.classList.remove('loaded');
                document.documentElement.classList.add('cursor-on-dark');

                try {
                    sessionStorage.setItem('bh-cursor', 'dark');
                } catch (error) {
                    // Ignore storage errors
                }
                
                // Navigate to the new page after a short delay
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            });
        }
    });

    // Initialize AOS (Animate On Scroll) with once:true to prevent animations reverting
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true, // Set to true so animations don't revert
            mirror: false,
            anchorPlacement: 'top-bottom',
            disable: 'mobile' // Disable on mobile for better performance
        });
    }

    // Navbar capsule — white glass on scroll (outer header stays transparent)
    const header = document.querySelector('#site-header') || document.querySelector('header');

    if (header) {
        const updateHeaderScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        };

        updateHeaderScroll();

        let headerTicking = false;
        window.addEventListener('scroll', () => {
            if (!headerTicking) {
                window.requestAnimationFrame(() => {
                    updateHeaderScroll();
                    headerTicking = false;
                });
                headerTicking = true;
            }
        }, { passive: true });
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.querySelector('.nav-backdrop');

    const closeMobileMenu = () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
        navBackdrop?.classList.remove('is-visible');
        navBackdrop?.setAttribute('hidden', '');
        hamburger?.setAttribute('aria-expanded', 'false');
        hamburger?.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
    };

    const openMobileMenu = () => {
        hamburger?.classList.add('active');
        navLinks?.classList.add('active');
        navBackdrop?.classList.add('is-visible');
        navBackdrop?.removeAttribute('hidden');
        hamburger?.setAttribute('aria-expanded', 'true');
        hamburger?.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('nav-open');
    };

    header?.querySelector('.nav-close')?.remove();
    navLinks?.querySelector('.nav-close')?.remove();

    if (navLinks && !navLinks.querySelector('.nav-close')) {
        const navClose = document.createElement('button');
        navClose.type = 'button';
        navClose.className = 'nav-close';
        navClose.setAttribute('aria-label', 'Close menu');
        navClose.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        navLinks.insertBefore(navClose, navLinks.firstChild);
        navClose.addEventListener('click', closeMobileMenu);
    }

    hamburger?.addEventListener('click', () => {
        if (navLinks?.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    navBackdrop?.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a, .nav-links .header-cta').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Legal page — highlight active section in table of contents
    if (document.body.classList.contains('legal-page')) {
        const legalSections = document.querySelectorAll('.legal-section[id]');
        const legalTocLinks = document.querySelectorAll('.legal-toc a');

        if (legalSections.length && legalTocLinks.length) {
            const setActiveTocLink = (id) => {
                legalTocLinks.forEach((link) => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                });
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    const visible = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                    if (visible[0]?.target?.id) {
                        setActiveTocLink(visible[0].target.id);
                    }
                },
                {
                    rootMargin: `-${Math.round(window.innerHeight * 0.28)}px 0px -55% 0px`,
                    threshold: [0, 0.15, 0.35, 0.55]
                }
            );

            legalSections.forEach((section) => observer.observe(section));

            legalTocLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    const id = link.getAttribute('href')?.slice(1);
                    if (id) {
                        setActiveTocLink(id);
                    }
                });
            });
        }
    }

    // Statistics Counter Animation
    const statsSection = document.querySelector('.statistics');
    if (statsSection) {
        const counters = document.querySelectorAll('.counter');
        let hasAnimated = false;

        const startCounting = () => {
            if (hasAnimated) return;
            
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                let count = 0;
                const duration = 2000; // ms
                const increment = target / (duration / 20); // Update every 20ms
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
            });
            
            hasAnimated = true;
        };

        // Check if stats section is in view
        const checkStatsInView = () => {
            const rect = statsSection.getBoundingClientRect();
            const isInView = (
                rect.top < window.innerHeight && 
                rect.bottom >= 0
            );
            
            if (isInView && !hasAnimated) {
                startCounting();
                // Remove scroll listener once animation has started
                window.removeEventListener('scroll', checkStatsInView);
            }
        };

        window.addEventListener('scroll', checkStatsInView);
        // Check on load in case stats are already visible
        setTimeout(checkStatsInView, 500);
    }

    // Solution Cards Animation
    const solutionCards = document.querySelectorAll('.solution-card');
    if (solutionCards.length > 0) {
        solutionCards.forEach(card => {
            const icon = card.querySelector('.solution-icon i');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.classList.add('fa-beat');
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.classList.remove('fa-beat');
                }
            });
        });
    }

    // Why Choose Us Items Animation
    const whyUsItems = document.querySelectorAll('.why-us-item');
    if (whyUsItems.length > 0) {
        whyUsItems.forEach(item => {
            const number = item.querySelector('.why-us-number');
            const icon = item.querySelector('.why-us-icon i');
            
            item.addEventListener('mouseenter', () => {
                if (number) {
                    number.style.transform = 'scale(1.2)';
                }
                if (icon) {
                    icon.classList.add('fa-spin');
                    setTimeout(() => {
                        icon.classList.remove('fa-spin');
                    }, 1000);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (number) {
                    number.style.transform = 'scale(1)';
                }
            });
        });
    }

    // Feature Items Hover Animation
    const featureItems = document.querySelectorAll('.feature-item');
    if (featureItems.length > 0) {
        featureItems.forEach(item => {
            const icon = item.querySelector('.feature-icon i');
            
            item.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.classList.add('fa-beat');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.classList.remove('fa-beat');
                }
            });
        });
    }

    // Service Cards Interactive Animation
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        serviceCards.forEach(card => {
            const icon = card.querySelector('.service-icon i');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.classList.add('fa-spin');
                    setTimeout(() => {
                        icon.classList.remove('fa-spin');
                    }, 1000);
                }
            });
        });
    }

    if (typeof initDepthParallax === 'function') {
        initDepthParallax();
    }

    if (typeof initSplitScroll === 'function') {
        initSplitScroll();
    }

    // Add ripple effect to all buttons and clickable elements
    const addRippleEffect = (elements) => {
        elements.forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    };
    
    // Add ripple effect to all buttons and clickable elements
    addRippleEffect(document.querySelectorAll('button, .service-card, .feature-item, .solution-card, .why-us-item, .status-tag, .header-cta, .service-cta, .nav-links a, .social-icon, .btn'));

    // Ensure loading screen is removed when navigating with browser back/forward (bfcache restore)
    window.addEventListener('pageshow', (event) => {
        // When the page is restored from the bfcache, DOMContentLoaded does not fire again.
        // Force-hide the loading overlay just in case.
        document.body.classList.add('loaded');
    });

    // Partners navigation controls removed
    //:functionality for manual scroll buttons removed
    //cleanup listeners
    const prevBtn = document.getElementById('partners-prev');
    const nextBtn = document.getElementById('partners-next');
    const pauseBtn = document.getElementById('partners-pause');
    prevBtn?.remove();
    nextBtn?.remove();
    pauseBtn?.remove();

    initWhatsAppCta();
});

function initWhatsAppCta() {
    if (document.querySelector('.whatsapp-cta')) {
        return;
    }

    const phone = '917008169612';
    const message = encodeURIComponent("Hello, I'd like to know more about BlueHarvest Exchange seafood trading services.");
    const link = document.createElement('a');
    link.className = 'whatsapp-cta';
    link.href = `https://wa.me/${phone}?text=${message}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Chat with BlueHarvest Exchange on WhatsApp');
    link.innerHTML = '<span class="whatsapp-cta__icon" aria-hidden="true"><i class="fab fa-whatsapp"></i></span>';

    document.body.appendChild(link);
}

// Add smooth scrolling for anchor links with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission with validation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = this.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        if (isValid) {
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }, 1500);
        } else {
            alert('Please fill out all required fields.');
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.required && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
}

// FAQ Toggle functionality
const faqItems = document.querySelectorAll('.faq-question');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const parent = this.parentNode;
            const icon = this.querySelector('.faq-toggle i');
            
            // Toggle this FAQ item
            parent.classList.toggle('active');
            
            // Toggle icon
            if (parent.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
}

/**
 * Switches the custom fishing-rod cursor between blue (light backgrounds)
 * and white (dark backgrounds) for proper contrast.
 */
let adaptiveCursorInitialized = false;

function initAdaptiveCursor() {
    if (adaptiveCursorInitialized || !window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    adaptiveCursorInitialized = true;

    const DARK_LUMINANCE_THRESHOLD = 0.45;
    const DARK_SURFACE_SELECTOR = [
        '.hero',
        '.hero-split-pin',
        '.hero-split-viewport',
        '.statistics',
        '.transform-banner',
        '.pt-hero',
        '.pt-chapter--sea',
        '.pt-cta-inner',
        'footer',
        '#loading-screen',
        'header .navbar',
        '.service-header',
        '.image-placeholder',
        '[data-cursor="dark"]'
    ].join(', ');

    function parseRgba(color) {
        if (!color || color === 'transparent') {
            return null;
        }

        const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
        if (!match) {
            return null;
        }

        return {
            r: Number(match[1]),
            g: Number(match[2]),
            b: Number(match[3]),
            a: match[4] !== undefined ? Number(match[4]) : 1
        };
    }

    function getRelativeLuminance(r, g, b) {
        const channel = (value) => {
            const normalized = value / 255;
            return normalized <= 0.03928
                ? normalized / 12.92
                : Math.pow((normalized + 0.055) / 1.055, 2.4);
        };

        const rs = channel(r);
        const gs = channel(g);
        const bs = channel(b);
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function isDarkSurface(element) {
        if (!element) {
            return false;
        }

        if (element.closest('[data-cursor="light"]')) {
            return false;
        }

        if (element.closest(DARK_SURFACE_SELECTOR)) {
            return true;
        }

        let node = element;
        while (node && node !== document.documentElement) {
            const style = window.getComputedStyle(node);
            const background = parseRgba(style.backgroundColor);

            if (background && background.a > 0.12) {
                return getRelativeLuminance(background.r, background.g, background.b) < DARK_LUMINANCE_THRESHOLD;
            }

            node = node.parentElement;
        }

        return false;
    }

    function setCursorTheme(isDark) {
        document.documentElement.classList.toggle('cursor-on-dark', isDark);

        try {
            sessionStorage.setItem('bh-cursor', isDark ? 'dark' : 'light');
        } catch (error) {
            // Ignore storage errors
        }
    }

    let pendingPoint = null;
    let cursorTicking = false;
    let lastDark = null;

    function updateCursorTheme(clientX, clientY) {
        const target = document.elementFromPoint(clientX, clientY);
        const isDark = isDarkSurface(target);

        if (isDark !== lastDark) {
            setCursorTheme(isDark);
            lastDark = isDark;
        }
    }

    document.addEventListener('mousemove', (event) => {
        pendingPoint = { x: event.clientX, y: event.clientY };

        if (!cursorTicking) {
            cursorTicking = true;
            window.requestAnimationFrame(() => {
                if (pendingPoint) {
                    updateCursorTheme(pendingPoint.x, pendingPoint.y);
                }
                cursorTicking = false;
            });
        }
    }, { passive: true });

    window.addEventListener('pageshow', () => {
        if (pendingPoint) {
            updateCursorTheme(pendingPoint.x, pendingPoint.y);
            return;
        }

        try {
            const storedTheme = sessionStorage.getItem('bh-cursor');
            if (storedTheme === 'dark') {
                setCursorTheme(true);
                lastDark = true;
            } else if (storedTheme === 'light') {
                setCursorTheme(false);
                lastDark = false;
            }
        } catch (error) {
            // Ignore storage errors
        }
    });
}

initAdaptiveCursor();

/* Homepage featured blog peekaboo reveal */
const featuredBlogPeekaboo = document.querySelector('.featured-blog-peekaboo');
if (featuredBlogPeekaboo) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        featuredBlogPeekaboo.classList.add('is-revealed');
    } else {
        const peekabooObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    featuredBlogPeekaboo.classList.add('is-revealed');
                    peekabooObserver.disconnect();
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

        peekabooObserver.observe(featuredBlogPeekaboo);
    }
}