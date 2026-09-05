/**
 * ==============================================================================
 * RestoOS — Partner Login Controller (Mock Auth)
 * ==============================================================================
 * Validates login credentials and routes to dashboard-preview.html.
 * Includes a 1-click Demo Account autofill button.
 * ==============================================================================
 */

class PartnerAuth {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.emailInput = document.getElementById('loginEmail');
    this.passwordInput = document.getElementById('loginPassword');
    this.rememberInput = document.getElementById('rememberMe');
    this.demoFillBtn = document.getElementById('demoFillBtn');
    this.errorBanner = document.getElementById('loginErrorBanner');

    this.init();
  }

  get client() {
    return window.apiClient;
  }

  init() {
    if (!this.form) return;

    this.setupDemoFill();
    this.setupFormSubmit();
    this.checkRememberedUser();
  }

  checkRememberedUser() {
    try {
      const remembered = localStorage.getItem('restoos_partner_remembered');
      if (remembered && this.emailInput) {
        this.emailInput.value = remembered;
        if (this.rememberInput) this.rememberInput.checked = true;
      }
    } catch (e) {}
  }

  setupDemoFill() {
    if (!this.demoFillBtn) return;

    this.demoFillBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.emailInput) this.emailInput.value = 'demo@restaurant.com';
      if (this.passwordInput) this.passwordInput.value = 'demo12345';
      if (this.errorBanner) this.errorBanner.style.display = 'none';
      if (this.emailInput) this.emailInput.focus();
    });
  }

  setupFormSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = this.emailInput ? this.emailInput.value.trim() : '';
      const password = this.passwordInput ? this.passwordInput.value.trim() : '';
      const remember = this.rememberInput ? this.rememberInput.checked : false;

      if (!email || !password) {
        this.showError("Please provide both email and password.");
        return;
      }

      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Authenticating...</span>`;

      try {
        const res = await this.client.partnerLogin(email, password, remember);
        
        // Show success and redirect
        submitBtn.innerHTML = `<span>Access Granted ✓</span>`;
        setTimeout(() => {
          window.location.href = res.redirectTo || 'dashboard-preview.html';
        }, 400);
      } catch (err) {
        this.showError(err.message || "Authentication error. Try demo credentials.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  showError(msg) {
    if (!this.errorBanner) return;
    this.errorBanner.textContent = msg;
    this.errorBanner.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PartnerAuth();
});
