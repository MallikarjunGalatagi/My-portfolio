/* ==========================================================================
   Mallikarjun Galatagi - Evernote Script Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Current Year Updater
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // Theme Switcher Mechanic
    // ==========================================================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    // Retrieve saved theme preference, default to developer 'dark'
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        const glowElement = document.getElementById('mouse-glow');
        
        if (theme === 'light') {
            // Setup details for switching to Evernote Light Theme
            if (themeIcon) {
                themeIcon.className = 'fa-solid fa-moon';
            }
            if (themeText) {
                themeText.textContent = 'Dark';
            }
            if (glowElement) {
                glowElement.style.opacity = '0';
            }
        } else {
            // Setup details for switching to Developer Dark Theme
            if (themeIcon) {
                themeIcon.className = 'fa-solid fa-sun';
            }
            if (themeText) {
                themeText.textContent = 'Light';
            }
            if (glowElement) {
                glowElement.style.opacity = 'var(--mouse-glow-opacity)';
            }
        }
    }

    // ==========================================================================
    // Scroll Progress & Sticky Header Logic
    // ==========================================================================
    const navBar = document.getElementById('main-nav');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPosition = window.scrollY;

        // 1. Update progress bar
        if (windowHeight > 0 && scrollProgressBar) {
            const scrollPercent = (scrollPosition / windowHeight) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';
        }

        // 2. Navigation bar sticky transition
        if (navBar) {
            if (scrollPosition > 50) {
                navBar.classList.add('navbar-scrolled');
            } else {
                navBar.classList.remove('navbar-scrolled');
            }
        }

        // 3. Back to top visibility
        if (backToTopBtn) {
            if (scrollPosition > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // 4. Section active navigation highlighting
        highlightNavigation();
    });

    // Back to top scroll execution
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active Section Tracking
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('header, section');

    function highlightNavigation() {
        let scrollYPosition = window.scrollY;

        sections.forEach(currentSection => {
            const sectionHeight = currentSection.offsetHeight;
            const sectionTop = currentSection.offsetTop - 120; // offset navbar
            const sectionId = currentSection.getAttribute('id');

            if (scrollYPosition > sectionTop && scrollYPosition <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile Hamburger Auto-Close when clicking links
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                // If it is open in mobile view, close it
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    // Fallback using Bootstrap Collapse API directly
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        });
    });

    // ==========================================================================
    // Mouse Glow Effect (Mouse Tracker)
    // ==========================================================================
    const mouseGlow = document.getElementById('mouse-glow');
    
    if (mouseGlow) {
        window.addEventListener('mousemove', (e) => {
            // Only update tracker position coordinates
            mouseGlow.style.left = e.clientX + 'px';
            mouseGlow.style.top = e.clientY + 'px';
        });
    }

    // ==========================================================================
    // Library Initializations: Typed.js, AOS, Vanilla Tilt
    // ==========================================================================

    // Initialize Typed.js on hero heading typing target
    if (typeof Typed !== 'undefined' && document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Java Developer',
                'Full Stack Developer',
                'Backend Developer',
                'Software Engineer',
                'Problem Solver'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
            disable: 'mobile' // Disable animations on mobile for smoother scrolling
        });
    }

    // Initialize Vanilla Tilt.js on components (Desktop only)
    if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        VanillaTilt.init(Array.from(tiltElements));
    }

    // ==========================================================================
    // Form Submission & Contact Validation
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all the contact form fields.', 'error');
                return;
            }

            // Disable submit button during redirect
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';
            }

            // Construct mailto link
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoUrl = `mailto:mallikarjungalatagi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Copy email to clipboard as backup fallback
            navigator.clipboard.writeText('mallikarjungalatagi@gmail.com').then(() => {
                showNotification("Copied 'mallikarjungalatagi@gmail.com' to clipboard and launching email app!", 'success');
            }).catch(() => {
                showNotification("Launching email app to send message!", 'success');
            });

            // Trigger the email client via simulated link click (safest browser gesture bypass)
            const mailLink = document.createElement('a');
            mailLink.href = mailtoUrl;
            document.body.appendChild(mailLink);
            mailLink.click();
            document.body.removeChild(mailLink);

            // Reset form
            setTimeout(() => {
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
                }
            }, 1000);
        });
    }



    // Elegant Toast/Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `custom-toast toast-${type}`;
        
        // Dynamic icons for notification
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        
        notification.innerHTML = `
            <div class="toast-body-content">
                <i class="fa-solid ${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        // Style the custom notification inject
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: '9999',
            backgroundColor: type === 'success' ? '#00A82D' : '#EF4444',
            color: '#FFFFFF',
            padding: '16px 24px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            borderRadius: '6px',
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 8px 30px',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate inside view
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 50);

        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
});

// ==========================================================================
// Project Card Expand / Accordion Mechanism (Global Event Delegator - Modal Pop)
// ==========================================================================
document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-toggle-details');
    if (!button) return;
    
    const card = button.closest('.project-card');
    if (!card) return;
    
    // Find all values from the card DOM
    const title = card.querySelector('.project-title').textContent.trim();
    const imgSrc = card.querySelector('.project-img').getAttribute('src');
    const imgAlt = card.querySelector('.project-img').getAttribute('alt');
    
    const gitUrl = card.querySelector('.btn-git-code').getAttribute('href');
    const demoUrl = card.querySelector('.btn-demo-video').getAttribute('href');
    
    // Grab the hidden detail segments
    const techStackHtml = card.querySelector('.tech-stack-grid').innerHTML;
    const descHtml = card.querySelector('.project-desc').innerHTML;
    const bulletsHtml = card.querySelector('.features-bullets').innerHTML;
    
    // Populate the Modal elements
    document.getElementById('modal-project-img').setAttribute('src', imgSrc);
    document.getElementById('modal-project-img').setAttribute('alt', imgAlt);
    document.getElementById('modal-project-title').textContent = title;
    
    document.getElementById('modal-project-git').setAttribute('href', gitUrl);
    document.getElementById('modal-project-demo').setAttribute('href', demoUrl);
    
    document.getElementById('modal-project-tech').innerHTML = techStackHtml;
    document.getElementById('modal-project-desc').innerHTML = descHtml;
    document.getElementById('modal-project-bullets').innerHTML = bulletsHtml;
    
    // Open Modal
    const modal = document.getElementById('project-details-modal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable scroll under overlay
    }
});

// Close Modal Event Listeners
document.addEventListener('click', (e) => {
    const isCloseBtn = e.target.closest('.project-modal-close');
    const isBackdrop = e.target.classList.contains('project-modal-backdrop');
    
    if (isCloseBtn || isBackdrop) {
        const modal = document.getElementById('project-details-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Re-enable scroll
        }
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('project-details-modal');
        if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
});

// Initialize Bootstrap Tooltips
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Ripple Click Animation Handler
document.addEventListener('click', (e) => {
    const button = e.target.closest('.ripple-btn');
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(circle);
});
