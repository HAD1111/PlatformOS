/**
 * ==============================================================================
 * Restaurant Digital Platform — API Client Abstraction Layer
 * ==============================================================================
 * Architectural Purpose:
 * Decouples the frontend UI from the concrete data source.
 * Currently resolves local mock data via simulated asynchronous Promises.
 * When the PHP/MySQL backend is implemented later, this client is swapped
 * to perform real fetch() calls to REST/JSON endpoints without altering UI code.
 * ==============================================================================
 */

class ApiClient {
  constructor() {
    this.simulatedDelayMs = 80;
  }

  get _data() {
    if (typeof window !== "undefined" && window.PLATFORM_DATA) {
      return window.PLATFORM_DATA;
    }
    return {};
  }

  _simulateNetwork(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(JSON.parse(JSON.stringify(data || {})));
      }, this.simulatedDelayMs);
    });
  }

  async getCompanyInfo() {
    return this._simulateNetwork(this._data.company);
  }

  async getFeatures() {
    return this._simulateNetwork(this._data.features);
  }

  async getHowItWorks() {
    return this._simulateNetwork(this._data.howItWorks);
  }

  async getShowcase() {
    return this._simulateNetwork(this._data.showcase);
  }

  async getDashboardMetrics() {
    return this._simulateNetwork(this._data.dashboardPreview);
  }

  async getPricing() {
    return this._simulateNetwork(this._data.pricing);
  }

  async getTestimonials() {
    return this._simulateNetwork(this._data.testimonials);
  }

  async getFaqs() {
    return this._simulateNetwork(this._data.faqs);
  }

  /**
   * Submits a frontend demo request
   * Validates payload and stores in local session for demo persistence
   */
  async submitDemoRequest(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!formData.restaurantName || !formData.email || !formData.phone) {
          reject(new Error("Please complete all required fields."));
          return;
        }

        const simulatedLead = {
          id: "LEAD-" + Math.floor(100000 + Math.random() * 900000),
          ...formData,
          createdAt: new Date().toISOString(),
          status: "Demo Simulated (No server submission)"
        };

        try {
          const stored = JSON.parse(sessionStorage.getItem("restoos_demo_leads") || "[]");
          stored.push(simulatedLead);
          sessionStorage.setItem("restoos_demo_leads", JSON.stringify(stored));
        } catch (e) {
          console.warn("Session storage not available:", e);
        }

        resolve({
          success: true,
          lead: simulatedLead,
          message: "Demo request recorded successfully in simulation mode."
        });
      }, 350);
    });
  }

  /**
   * Submits an interactive schedule simulation
   * Explicitly flagged as simulation (no external calendar sync)
   */
  async submitScheduleBooking(bookingData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!bookingData.date || !bookingData.timeSlot || !bookingData.email) {
          reject(new Error("Please select a date, time slot, and provide your email."));
          return;
        }

        const simulatedBooking = {
          bookingReference: "BK-" + Math.floor(100000 + Math.random() * 900000),
          ...bookingData,
          bookedAt: new Date().toISOString(),
          isSimulation: true,
          notice: "Demo simulation only. No actual calendar appointment was scheduled."
        };

        try {
          sessionStorage.setItem("restoos_last_booking", JSON.stringify(simulatedBooking));
        } catch (e) {
          console.warn("Session storage error:", e);
        }

        resolve({
          success: true,
          booking: simulatedBooking
        });
      }, 400);
    });
  }

  /**
   * Simulates Partner Portal Login
   * Accepts demo credentials or valid mock credentials
   */
  async partnerLogin(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = (email || "").trim().toLowerCase();
        
        if (cleanEmail === "demo@restaurant.com" || cleanEmail.includes("@")) {
          const session = {
            restaurantId: "lume-beirut",
            restaurantName: "LUMÉ",
            ownerName: "Karim Mansour",
            ownerEmail: cleanEmail,
            role: "Owner / Head Chef",
            plan: "Professional Partner",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isMockSession: true
          };

          try {
            sessionStorage.setItem("restoos_partner_session", JSON.stringify(session));
            if (rememberMe) {
              localStorage.setItem("restoos_partner_remembered", cleanEmail);
            }
          } catch (e) {
            console.warn("Storage warning:", e);
          }

          resolve({
            success: true,
            session,
            redirectTo: "dashboard-preview.html"
          });
        } else {
          reject(new Error("Invalid email or password. You can use 'demo@restaurant.com' for instant testing."));
        }
      }, 300);
    });
  }

  async getPartnerSession() {
    return new Promise((resolve) => {
      try {
        const session = JSON.parse(sessionStorage.getItem("restoos_partner_session"));
        resolve(session || null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async partnerLogout() {
    return new Promise((resolve) => {
      try {
        sessionStorage.removeItem("restoos_partner_session");
      } catch (e) {}
      resolve({ success: true });
    });
  }
}

const apiClient = new ApiClient();

if (typeof window !== "undefined") {
  window.apiClient = apiClient;
  window.ApiClient = ApiClient;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { apiClient, ApiClient };
}
