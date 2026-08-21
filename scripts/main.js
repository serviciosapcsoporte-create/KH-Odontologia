/* ============================================
   KH ODONTOLOGIA ESTETICA - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const hamburger = document.querySelector('.hamburger');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (hamburger && navbarMenu) {
    hamburger.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    // Close menu on link click
    navbarMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        hamburger.classList.remove('open');
      });
    });
  }

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- WhatsApp message ---
  const whatsappBtns = document.querySelectorAll('[data-whatsapp]');
  const phone = '573125759211';
  const defaultMsg = 'Hola, me interesa información sobre sus servicios de odontología que vi en su página web.';

  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = btn.dataset.message || defaultMsg;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // --- Contact form WhatsApp redirect ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value || '';
      const service = document.getElementById('formService')?.value || '';
      const message = document.getElementById('formMessage')?.value || '';

      const waMsg = `Hola, soy ${name}. Me interesa el servicio de ${service}. ${message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  }

  // --- Intersection Observer for animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .why-item, .team-card, .testimonial-card, .contact-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // --- Active nav link based on current page ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Lazy load images ---
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imgObserver.observe(img);
    });
  }

});

// --- Animation styles (injected) ---
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;
document.head.appendChild(style);
