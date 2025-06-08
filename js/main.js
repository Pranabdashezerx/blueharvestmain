// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen when page is fully loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 800); // Short delay for better visual effect
    
    // Handle links for page transitions with loading screen
    document.querySelectorAll('a').forEach(link => {
        // Only handle internal links, not external or anchor links
        if (link.href && link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && !link.getAttribute('target')) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;
                
                // Show loading screen
                document.body.classList.remove('loaded');
                
                // Navigate to the new page after a short delay
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            });
        }
    });

    // Initialize AOS (Animate On Scroll) with once:true to prevent animations reverting
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true, // Set to true so animations don't revert
        mirror: false,
        anchorPlacement: 'top-bottom',
        disable: 'mobile' // Disable on mobile for better performance
    });

    // Navbar scroll effect - optimized with throttling and requestAnimationFrame
    const header = document.querySelector('header');
    
    // Apply scrolled class on page load if not at top
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    }
    
    let headerTicking = false;
    window.addEventListener('scroll', () => {
        if (!headerTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                headerTicking = false;
            });
            headerTicking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

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

    // Optimized parallax effect with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.pageYOffset;
                
                // Parallax for hero section
                const heroImg = document.querySelector('.hero-img');
                if (heroImg) {
                    heroImg.style.transform = `translateY(${scrollPosition * 0.05}px)`;
                }
                
                // Parallax for cold chain section
                const coldChainImg = document.querySelector('.cold-chain-img');
                if (coldChainImg) {
                    const coldChainSection = document.querySelector('.cold-chain');
                    if (coldChainSection) {
                        const coldChainOffset = coldChainSection.offsetTop;
                        const relativeScroll = scrollPosition - coldChainOffset + 500;
                        
                        if (relativeScroll > 0) {
                            coldChainImg.style.transform = `translateY(${relativeScroll * 0.03}px)`;
                        }
                    }
                }
                
                // Parallax for quality section
                const qualityImg = document.querySelector('.quality-img');
                if (qualityImg) {
                    const qualitySection = document.querySelector('.quality-control');
                    if (qualitySection) {
                        const qualityOffset = qualitySection.offsetTop;
                        const relativeScroll = scrollPosition - qualityOffset + 500;
                        
                        if (relativeScroll > 0) {
                            qualityImg.style.transform = `translateY(${relativeScroll * 0.02}px)`;
                        }
                    }
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
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
    addRippleEffect(document.querySelectorAll('button, .service-card, .feature-item, .solution-card, .why-us-item, .status-tag, .service-cta, .nav-links a, .social-icon, .btn'));
});

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