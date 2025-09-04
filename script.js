document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-scroll-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.menu-section');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Center the clicked link in the nav container
                const linkRect = this.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();
                const scrollLeft = navContainer.scrollLeft + (linkRect.left - containerRect.left) - (containerRect.width / 2) + (linkRect.width / 2);
                
                navContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all menu sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add active state to navigation links based on scroll position
    const headerHeight = document.querySelector('.main-header').offsetHeight;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const offset = headerHeight + navbarHeight + 50;

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - offset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
                
                // Ensure active link is visible in the nav container
                const linkRect = link.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();
                
                if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
                    const scrollLeft = navContainer.scrollLeft + (linkRect.left - containerRect.left) - (containerRect.width / 2) + (linkRect.width / 2);
                    navContainer.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Touch scroll handling for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    navContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        navContainer.style.cursor = 'grabbing';
        startX = e.pageX - navContainer.offsetLeft;
        scrollLeft = navContainer.scrollLeft;
    });

    navContainer.addEventListener('mouseleave', () => {
        isDown = false;
        navContainer.style.cursor = 'grab';
    });

    navContainer.addEventListener('mouseup', () => {
        isDown = false;
        navContainer.style.cursor = 'grab';
    });

    navContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - navContainer.offsetLeft;
        const walk = (x - startX) * 2;
        navContainer.scrollLeft = scrollLeft - walk;
    });
}); 