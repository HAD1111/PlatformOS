/**
 * ==============================================================================
 * RestoOS — Public Company Marketing Website Application Logic
 * ==============================================================================
 * Renders marketing sections from the decoupled data layer and manages
 * UI interactions (nav, mobile drawer, pricing toggle, FAQ accordions).
 * ==============================================================================
 */

// SVG Icon Helper Map for dynamic rendering
const ICON_MAP = {
  globe: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  qrcode: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  'message-circle': `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>`,
  'refresh-cw': `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevronDown: `<svg class="faq-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
};

class MarketingApp {
  constructor() {
    this.isAnnualPricing = false;
    this.init();
  }

  get client() {
    return window.apiClient;
  }

  async init() {
    this.setupNavbar();
    this.setupMobileDrawer();
    
    // Asynchronously fetch and render all marketing sections
    await Promise.all([
      this.renderFeatures(),
      this.renderHowItWorks(),
      this.renderShowcase(),
      this.renderDashboardPreview(),
      this.renderPricing(),
      this.renderTestimonials(),
      this.renderFaqs()
    ]);

    this.setupPricingToggle();
    this.setupFaqAccordion();
  }

  /* ------------------------------------------------------------------------
     Navbar & Scroll Handling
     ------------------------------------------------------------------------ */
  setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  setupMobileDrawer() {
    const burgerBtn = document.getElementById('burgerBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerScrim = document.getElementById('drawerScrim');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = (open) => {
      if (!mobileDrawer || !drawerScrim || !burgerBtn) return;
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      drawerScrim.classList.toggle('open', isOpen);
      burgerBtn.classList.toggle('open', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (burgerBtn) {
      burgerBtn.addEventListener('click', () => toggleDrawer());
    }
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => toggleDrawer(false));
    }
    if (drawerScrim) {
      drawerScrim.addEventListener('click', () => toggleDrawer(false));
    }
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });
  }

  /* ------------------------------------------------------------------------
     Render Features Section
     ------------------------------------------------------------------------ */
  async renderFeatures() {
    const container = document.getElementById('featuresGrid');
    if (!container || !this.client) return;

    try {
      const features = await this.client.getFeatures();
      container.innerHTML = features.map(feat => `
        <div class="feature-card">
          <div class="feature-card-top">
            <div class="feature-icon-box" aria-hidden="true">
              ${ICON_MAP[feat.icon] || ICON_MAP.globe}
            </div>
            <span class="badge badge-brass">${feat.badge}</span>
          </div>
          <h3 class="feature-title">${feat.title}</h3>
          <p class="feature-desc">${feat.description}</p>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render features:', err);
    }
  }

  /* ------------------------------------------------------------------------
     Render How It Works Section
     ------------------------------------------------------------------------ */
  async renderHowItWorks() {
    const container = document.getElementById('howItWorksGrid');
    if (!container || !this.client) return;

    try {
      const steps = await this.client.getHowItWorks();
      container.innerHTML = steps.map(step => `
        <div class="step-card">
          <div class="step-number">${step.step}</div>
          <h3 class="step-title">${step.title}</h3>
          <p class="step-desc">${step.description}</p>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render how it works:', err);
    }
  }

  /* ------------------------------------------------------------------------
     Render Product Showcase Section ("Our Work")
     ------------------------------------------------------------------------ */
  async renderShowcase() {
    const container = document.getElementById('showcaseGrid');
    if (!container || !this.client) return;

    try {
      const showcaseItems = await this.client.getShowcase();
      container.innerHTML = showcaseItems.map(item => `
        <div class="showcase-card ${item.isLiveReference ? 'featured' : ''}">
          <div class="showcase-media">
            <img src="${item.image}" alt="${item.name} Restaurant Showcase" loading="lazy">
            <div class="showcase-badge-top">
              ${item.isLiveReference 
                ? '<span class="badge badge-emerald">Live Working Demo</span>' 
                : '<span class="badge badge-demo">Concept Showcase</span>'}
            </div>
          </div>
          <div class="showcase-body">
            <div class="showcase-name-row">
              <h3 class="showcase-name">${item.name}</h3>
              <span class="badge badge-subtle">${item.location}</span>
            </div>
            <p class="showcase-cuisine">${item.cuisine}</p>
            <p class="showcase-desc">${item.description}</p>
            <div class="showcase-tags">
              ${item.tags.map(tag => `<span class="showcase-tag">${tag}</span>`).join('')}
            </div>
            ${item.isLiveReference ? `
              <a href="${item.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-block">
                <span>Launch Live Demo</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : `
              <button class="btn btn-secondary btn-block" onclick="window.marketingApp.showToast('Demo preview for ${item.name} is scheduled for an upcoming release.')">
                <span>View Concept</span>
              </button>
            `}
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render showcase:', err);
    }
  }

  /* ------------------------------------------------------------------------
     Render Dashboard Preview Section
     ------------------------------------------------------------------------ */
  async renderDashboardPreview() {
    const metricsContainer = document.getElementById('dashMetricsGrid');
    const updatesContainer = document.getElementById('dashRecentList');
    if (!metricsContainer || !updatesContainer || !this.client) return;

    try {
      const data = await this.client.getDashboardMetrics();
      
      metricsContainer.innerHTML = data.stats.map(stat => `
        <div class="dash-metric-box">
          <p class="metric-label">${stat.label}</p>
          <p class="metric-number">${stat.value}</p>
          <p class="metric-note">${stat.note}</p>
        </div>
      `).join('');

      updatesContainer.innerHTML = data.recentUpdates.map(update => `
        <div class="dash-recent-item">
          <div>
            <strong>${update.item}</strong> — <span style="color: var(--text-muted);">${update.change}</span>
          </div>
          <div style="display:flex; align-items:center; gap: 8px;">
            <span class="badge badge-subtle">${update.time}</span>
            <span class="badge badge-emerald">${update.status}</span>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render dashboard preview:', err);
    }
  }

  /* ------------------------------------------------------------------------
     Render Pricing Section
     ------------------------------------------------------------------------ */
  async renderPricing() {
    const container = document.getElementById('pricingGrid');
    if (!container || !this.client) return;

    try {
      const pricingData = await this.client.getPricing();
      container.innerHTML = pricingData.plans.map(plan => {
        const isNumeric = typeof plan.priceMonthly === 'number';
        const displayPrice = isNumeric 
          ? (this.isAnnualPricing ? plan.priceAnnual : plan.priceMonthly)
          : plan.priceMonthly;

        return `
          <div class="pricing-card ${plan.featured ? 'featured' : ''}">
            ${plan.featured ? `<div class="pricing-plan-badge"><span class="badge badge-brass">${plan.featuredBadge}</span></div>` : ''}
            <h3 class="pricing-name">${plan.name}</h3>
            <p class="pricing-tagline">${plan.tagline}</p>
            <div class="pricing-price-wrap">
              ${isNumeric ? `<span class="price-currency">$</span>` : ''}
              <span class="price-amount">${displayPrice}</span>
              ${isNumeric ? `<span class="price-period">/ month ${this.isAnnualPricing ? '(billed annually)' : ''}</span>` : ''}
            </div>
            <ul class="pricing-features-list">
              ${plan.features.map(feat => `
                <li class="pricing-feature-item">
                  ${ICON_MAP.check}
                  <span>${feat}</span>
                </li>
              `).join('')}
            </ul>
            <a href="${plan.ctaAction}" class="btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-block">
              ${plan.ctaText}
            </a>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to render pricing:', err);
    }
  }

  setupPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    const labelMonthly = document.getElementById('labelMonthly');
    const labelAnnual = document.getElementById('labelAnnual');
    if (!toggle || !labelMonthly || !labelAnnual) return;

    const updateToggleState = (annual) => {
      this.isAnnualPricing = annual;
      toggle.classList.toggle('annual', annual);
      toggle.setAttribute('aria-checked', annual);
      labelMonthly.classList.toggle('active', !annual);
      labelAnnual.classList.toggle('active', annual);
      this.renderPricing();
    };

    toggle.addEventListener('click', () => updateToggleState(!this.isAnnualPricing));
    labelMonthly.addEventListener('click', () => updateToggleState(false));
    labelAnnual.addEventListener('click', () => updateToggleState(true));
  }

  /* ------------------------------------------------------------------------
     Render Testimonials Section
     ------------------------------------------------------------------------ */
  async renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container || !this.client) return;

    try {
      const data = await this.client.getTestimonials();
      container.innerHTML = data.items.map(t => `
        <div class="testimonial-card">
          <p class="testimonial-quote">“${t.quote}”</p>
          <div class="testimonial-author">
            <img src="${t.avatar}" alt="${t.author}" class="author-avatar" loading="lazy">
            <div>
              <p class="author-name">${t.author}</p>
              <p class="author-role">${t.role} • ${t.restaurant}</p>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render testimonials:', err);
    }
  }

  /* ------------------------------------------------------------------------
     Render FAQ Section & Accordion
     ------------------------------------------------------------------------ */
  async renderFaqs() {
    const container = document.getElementById('faqList');
    if (!container || !this.client) return;

    try {
      const faqs = await this.client.getFaqs();
      container.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item" id="faqItem-${index}">
          <button class="faq-question-btn" type="button" aria-expanded="false" aria-controls="faqAnswer-${index}">
            <span>${faq.q}</span>
            ${ICON_MAP.chevronDown}
          </button>
          <div class="faq-answer" id="faqAnswer-${index}">
            <div class="faq-answer-inner">
              ${faq.a}
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to render FAQs:', err);
    }
  }

  setupFaqAccordion() {
    const container = document.getElementById('faqList');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question-btn');
      if (!btn) return;

      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all items
      container.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isExpanded) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }

  /* ------------------------------------------------------------------------
     Toast Message Helper
     ------------------------------------------------------------------------ */
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.marketingApp = new MarketingApp();
});
