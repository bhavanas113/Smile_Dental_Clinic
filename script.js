// 1. ORIGINAL: Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// 2. ORIGINAL + UPDATED: Change navbar background and Smart Scroll logic
// UPDATED: Ensuring navbar stays FIXED and visible always
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    // Original Logic + Persistence Fix
    if (window.scrollY > 50) {
        // MOBILE FIX: Use smaller padding on mobile to prevent overlapping
        if (window.innerWidth <= 768) {
            nav.style.padding = '8px 5%';
        } else {
            nav.style.padding = '12px 10%'; // Slightly more compact on scroll
        }
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        nav.style.background = 'rgba(255, 255, 255, 0.98)'; // Solid glass effect
    } else {
        if (window.innerWidth <= 768) {
            nav.style.padding = '15px 5%';
        } else {
            nav.style.padding = '20px 10%';
        }
        nav.style.boxShadow = 'none';
        nav.style.background = 'var(--glass-bg)'; // Maintain your variable
    }

    // ADVANCED: Smart Navbar Logic (FIXED: Stay visible always)
    // We keep the transform at 0 to ensure it never hides behind the top edge
    nav.style.transform = 'translateY(0)'; 
    
    lastScroll = currentScroll;
});

// 3. ORIGINAL: Smooth Scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ==========================================
// NEW ADVANCED UPDATES ADDED BELOW
// ==========================================

// 4. ADVANCED: 3D Mouse Tilt Effect for Service Cards
// This makes the cards lean toward the mouse for a high-end feel
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Only run on non-touch devices for better mobile experience
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
    });
});

// 5. ADVANCED: Page Load Reveal
// Adds a premium fade-in sequence when the clinic site first opens
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-content');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        hero.style.transition = 'all 1.2s ease-out';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 300);
});

// 6. ADVANCED: Form Success Animation (For the future Appointment Button)
const btnNav = document.querySelector('.btn-nav');
btnNav.addEventListener('mousedown', () => {
    btnNav.style.transform = 'scale(0.95)';
});
btnNav.addEventListener('mouseup', () => {
    btnNav.style.transform = 'scale(1)';
});

// ==========================================
// NEW: GALLERY & TRANSFORMATION LOGIC
// ==========================================

// 7. ADVANCED: Image Parallax for Gallery
// Makes the dental work photos move slightly inside their frames for depth
const galleryItems = document.querySelectorAll('.gallery-item img');
window.addEventListener('scroll', () => {
    galleryItems.forEach(img => {
        const speed = 0.05;
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yOffset = (window.innerHeight - rect.top) * speed;
            img.style.transform = `scale(1.1) translateY(${yOffset}px)`;
        }
    });
});

// 8. ADVANCED: Dynamic Greeting based on Clinic Hours
// Console log for debugging or could be used for a "We are Open/Closed" badge
const checkStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon...
    const hour = now.getHours();
    
    const isOpen = (day >= 1 && day <= 6) && (hour >= 10 && hour < 20);
    console.log(isOpen ? "Dr. Siddhi's Clinic is currently OPEN" : "Dr. Siddhi's Clinic is currently CLOSED");
};
checkStatus();

// ==========================================
// NEW: MOBILE MENU INTERACTION LOGIC
// ==========================================

// 9. MOBILE: Toggle Navigation Drawer
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });
}

// 10. MOBILE: Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle) menuToggle.classList.remove('is-active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// ==========================================
// NEW: MOBILE SCROLL-SPY & UI ENHANCEMENT
// ==========================================

// 11. MOBILE: Highlight Bottom Nav active item on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.style.color = 'var(--dark-navy)'; // Default color
        const href = item.getAttribute('href');
        if (href === `#${current}`) {
            item.style.color = 'var(--primary-blue)'; // Highlight color
        }
        // Keep the call button white
        if (item.classList.contains('call-hub')) {
            item.style.color = 'white';
        }
    });
});

// ==========================================
// NEW ADDITION: FINAL MOBILE READABILITY FIX
// ==========================================

// 12. Fix small font issue by injecting dynamic viewport scaling on mobile
const adjustForMobileText = () => {
    if (window.innerWidth <= 480) {
        // Ensure the body doesn't allow the browser to auto-shrink text
        document.body.style.webkitTextSizeAdjust = "100%";
        
        // Specifically check if headings are too small and boost them
        const mainHeading = document.querySelector('.hero-content h1');
        if (mainHeading) {
            mainHeading.style.fontSize = "2.8rem";
        }
    }
};

window.addEventListener('resize', adjustForMobileText);
window.addEventListener('DOMContentLoaded', adjustForMobileText);
