/**
 * ==============================================================================
 * RestoOS — Request Demo Form Controller
 * ==============================================================================
 * Handles interest pill toggles, real-time client validation,
 * asynchronous mock submission via apiClient, and simulated success state.
 * ==============================================================================
 */

class RequestDemoForm {
  constructor() {
    this.form = document.getElementById('requestDemoForm');
    this.modal = document.getElementById('demoSuccessModal');
    this.closeModalBtn = document.getElementById('modalCloseBtn');
    this.sameWhatsAppCheckbox = document.getElementById('sameWhatsApp');
    this.phoneInput = document.getElementById('phone');
    this.whatsappInput = document.getElementById('whatsapp');

    this.init();
  }

  get client() {
    return window.apiClient;
  }

  init() {
    if (!this.form) return;

    this.setupInterestPills();
    this.setupWhatsAppSync();
    this.setupUrlParamPrefill();
    this.setupFormSubmit();

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => {
        if (this.modal) this.modal.classList.remove('open');
      });
    }
  }

  setupInterestPills() {
    const pills = document.querySelectorAll('.interest-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const checkbox = pill.querySelector('input[type="checkbox"]');
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        pill.classList.toggle('selected', checkbox.checked);
      });
    });
  }

  setupWhatsAppSync() {
    if (!this.sameWhatsAppCheckbox || !this.phoneInput || !this.whatsappInput) return;

    this.sameWhatsAppCheckbox.addEventListener('change', () => {
      if (this.sameWhatsAppCheckbox.checked) {
        this.whatsappInput.value = this.phoneInput.value;
        this.whatsappInput.setAttribute('readonly', 'true');
      } else {
        this.whatsappInput.removeAttribute('readonly');
      }
    });

    this.phoneInput.addEventListener('input', () => {
      if (this.sameWhatsAppCheckbox && this.sameWhatsAppCheckbox.checked) {
        this.whatsappInput.value = this.phoneInput.value;
      }
    });
  }

  setupUrlParamPrefill() {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    if (plan) {
      const pillFull = document.querySelector('input[value="Full Package"]');
      const pillMenu = document.querySelector('input[value="Digital Menu"]');
      if (pillFull && (plan === 'professional' || plan === 'custom')) {
        pillFull.checked = true;
        pillFull.closest('.interest-pill').classList.add('selected');
      } else if (pillMenu && plan === 'starter') {
        pillMenu.checked = true;
        pillMenu.closest('.interest-pill').classList.add('selected');
      }
    }
  }

  validateField(input, testFn, errorMsg) {
    const value = (input.value || '').trim();
    const group = input.closest('.form-group');
    const isValid = testFn(value);

    if (!isValid) {
      input.classList.add('error');
      if (group) {
        group.classList.add('has-error');
        let errorEl = group.querySelector('.form-error-msg');
        if (errorEl) errorEl.textContent = errorMsg;
      }
      return false;
    } else {
      input.classList.remove('error');
      if (group) group.classList.remove('has-error');
      return true;
    }
  }

  validate() {
    let isValid = true;
    const nameRegex = /^.{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]{6,}$/;

    const restaurantName = document.getElementById('restaurantName');
    const yourName = document.getElementById('yourName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const whatsapp = document.getElementById('whatsapp');

    if (!this.validateField(restaurantName, val => nameRegex.test(val), "Please provide your restaurant name.")) {
      isValid = false;
    }
    if (!this.validateField(yourName, val => nameRegex.test(val), "Please provide your full name.")) {
      isValid = false;
    }
    if (!this.validateField(email, val => emailRegex.test(val), "Please enter a valid email address.")) {
      isValid = false;
    }
    if (!this.validateField(phone, val => phoneRegex.test(val), "Please provide a valid phone number.")) {
      isValid = false;
    }
    if (!this.validateField(whatsapp, val => phoneRegex.test(val), "Please provide your WhatsApp contact number.")) {
      isValid = false;
    }

    return isValid;
  }

  setupFormSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!this.validate()) {
        const firstError = this.form.querySelector('.form-control.error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Request...</span>`;

      // Gather form values
      const checkedInterests = Array.from(this.form.querySelectorAll('input[name="interests"]:checked'))
        .map(el => el.value);

      const formData = {
        restaurantName: document.getElementById('restaurantName').value.trim(),
        yourName: document.getElementById('yourName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        website: (document.getElementById('website') ? document.getElementById('website').value.trim() : ''),
        interests: checkedInterests.length > 0 ? checkedInterests : ["Full Package"],
        message: (document.getElementById('message') ? document.getElementById('message').value.trim() : '')
      };

      try {
        const result = await this.client.submitDemoRequest(formData);

        // Populate summary in modal
        const summaryBox = document.getElementById('modalSummary');
        if (summaryBox && result.lead) {
          summaryBox.innerHTML = `
            <div class="summary-line"><span>Reference:</span><strong>${result.lead.id}</strong></div>
            <div class="summary-line"><span>Restaurant:</span><strong>${result.lead.restaurantName}</strong></div>
            <div class="summary-line"><span>Contact:</span><strong>${result.lead.yourName}</strong></div>
            <div class="summary-line"><span>Email:</span><strong>${result.lead.email}</strong></div>
            <div class="summary-line"><span>WhatsApp:</span><strong>${result.lead.whatsapp}</strong></div>
            <div class="summary-line"><span>Interests:</span><strong>${result.lead.interests.join(', ')}</strong></div>
          `;
        }

        if (this.modal) {
          this.modal.classList.add('open');
        }

        this.form.reset();
        document.querySelectorAll('.interest-pill').forEach(p => p.classList.remove('selected'));
      } catch (err) {
        alert(err.message || "An error occurred while submitting.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RequestDemoForm();
});
