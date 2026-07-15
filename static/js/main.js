document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('p, h1, h2, h3, img, .fade-in-element');
  elements.forEach(el => {
    el.classList.add('fade-in-element');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-element').forEach(el => {
    observer.observe(el);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMenu = document.querySelector('.close-menu');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
  if (closeMenu && mobileNav) {
    closeMenu.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  }

  const tfElement = document.querySelector('[data-tf-live]');
  if (tfElement) {
    const loadTypeform = () => {
      const s = document.createElement('script');
      s.src = '//embed.typeform.com/next/embed.js';
      s.defer = true;
      document.body.appendChild(s);
    };
    const formObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadTypeform();
          obs.disconnect();
        }
      });
    });
    formObserver.observe(tfElement);
  }

  document.querySelectorAll('.faq details').forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        document.querySelectorAll('.faq details').forEach(other => {
          if (other !== this) other.open = false;
        });
      }
    });
  });

  const splash = document.getElementById('splash-screen');
  if (splash) {
    const hasSeenSplash = document.cookie.split(';').some(c => c.trim() === 'splashSeen=true');
    if (hasSeenSplash) {
      splash.remove();
    } else {
      window.addEventListener('load', () => {
        document.cookie = 'splashSeen=true; path=/; max-age=31536000';
        setTimeout(() => {
          splash.classList.add('fade-english');
        }, 1000);
        setTimeout(() => {
          splash.classList.add('hide');
        }, 3000);
        setTimeout(() => {
          splash.remove();
        }, 5000);
      });
    }
  }

  const header = document.querySelector('header');
  if (header) {
    const activateAt = 300;
    const handleScroll = () => {
      const { scrollY } = window;
      if (scrollY > activateAt) {
        header.classList.add('scrolled');
      } else if (scrollY <= 0) {
        header.classList.remove('scrolled');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  }
});

function trackLocalPestEvent(eventName, parameters = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
}

document.addEventListener('click', event => {
  const link = event.target.closest('a, button');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const configured = link.dataset.analyticsEvent;
  if (configured) {
    trackLocalPestEvent(configured, { link_url: href, cta_id: link.id || link.dataset.cta || '' });
    return;
  }
  if (href.startsWith('tel:')) {
    trackLocalPestEvent('click_to_call', { link_url: href, cta_id: link.id || '' });
  } else if (href.startsWith('mailto:')) {
    trackLocalPestEvent('email_click', { link_url: href, cta_id: link.id || '' });
  } else if (link.dataset.cta) {
    trackLocalPestEvent('primary_cta_click', { link_url: href, cta_id: link.dataset.cta });
  }
});

window.addEventListener('message', event => {
  const data = event.data || {};
  const eventType = typeof data === 'string' ? data : (data.type || data.eventName || '');
  if (String(eventType).toLowerCase().includes('form-submit') || String(eventType).toLowerCase().includes('submit')) {
    trackLocalPestEvent('generate_lead', { form_id: 'quote-form', form_provider: 'typeform' });
  }
});
