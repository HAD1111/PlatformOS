/**
 * ==============================================================================
 * RestoOS — Schedule Meeting Controller (Frontend Simulation)
 * ==============================================================================
 * Generates an interactive date grid and time slots.
 * Submits to apiClient simulation layer and presents a confirmation modal.
 * ==============================================================================
 */

class ScheduleBooking {
  constructor() {
    this.selectedDate = null;
    this.selectedSlot = null;
    this.dateGrid = document.getElementById('calendarDaysGrid');
    this.slotsGrid = document.getElementById('timeSlotsGrid');
    this.form = document.getElementById('scheduleForm');
    this.modal = document.getElementById('bookingSuccessModal');
    this.closeModalBtn = document.getElementById('bookingCloseBtn');

    this.init();
  }

  get client() {
    return window.apiClient;
  }

  init() {
    this.generateDays();
    this.generateTimeSlots();
    this.setupForm();

    if (this.closeModalBtn && this.modal) {
      this.closeModalBtn.addEventListener('click', () => {
        this.modal.classList.remove('open');
      });
    }
  }

  generateDays() {
    if (!this.dateGrid) return;
    this.dateGrid.innerHTML = '';

    const days = [];
    const today = new Date();

    // Generate next 14 calendar days
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }

    days.forEach((day, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar-day-btn';
      if (index === 0) {
        btn.classList.add('selected');
        this.selectedDate = day;
        this.updateDateDisplay(day);
      }

      const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = day.getDate();

      btn.innerHTML = `
        <span style="font-size:0.65rem; text-transform:uppercase; color:inherit; opacity:0.8;">${dayName}</span>
        <span style="font-size:1rem; font-weight:700;">${dayNum}</span>
      `;

      btn.addEventListener('click', () => {
        this.dateGrid.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedDate = day;
        this.updateDateDisplay(day);
      });

      this.dateGrid.appendChild(btn);
    });
  }

  updateDateDisplay(date) {
    const el = document.getElementById('selectedDateLabel');
    if (el) {
      el.textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  }

  generateTimeSlots() {
    if (!this.slotsGrid) return;
    const slots = [
      '10:00 AM', '11:00 AM', '11:30 AM', 
      '01:30 PM', '02:30 PM', '03:30 PM', 
      '04:30 PM', '05:30 PM'
    ];

    this.slotsGrid.innerHTML = '';
    slots.forEach((slot, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot-btn';
      if (index === 1) {
        btn.classList.add('selected');
        this.selectedSlot = slot;
      }

      btn.textContent = slot;
      btn.addEventListener('click', () => {
        this.slotsGrid.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedSlot = slot;
      });

      this.slotsGrid.appendChild(btn);
    });
  }

  setupForm() {
    if (!this.form) return;

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value.trim();
      const email = document.getElementById('bookingEmail').value.trim();
      const restaurant = document.getElementById('bookingRestaurant').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const timezone = document.getElementById('bookingTimezone').value;

      if (!name || !email || !restaurant || !this.selectedDate || !this.selectedSlot) {
        alert("Please complete all required fields and select a date & time slot.");
        return;
      }

      const submitBtn = this.form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Simulating Booking...</span>`;

      const bookingPayload = {
        name,
        email,
        restaurant,
        phone,
        timezone,
        date: this.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
        timeSlot: this.selectedSlot
      };

      try {
        const res = await this.client.submitScheduleBooking(bookingPayload);

        const summaryBox = document.getElementById('bookingModalSummary');
        if (summaryBox && res.booking) {
          summaryBox.innerHTML = `
            <div class="summary-line"><span>Reference:</span><strong>${res.booking.bookingReference}</strong></div>
            <div class="summary-line"><span>Date:</span><strong>${res.booking.date}</strong></div>
            <div class="summary-line"><span>Time:</span><strong>${res.booking.timeSlot} (${res.booking.timezone})</strong></div>
            <div class="summary-line"><span>Restaurant:</span><strong>${res.booking.restaurant}</strong></div>
            <div class="summary-line"><span>Host:</span><strong>RestoOS Hospitality Lead</strong></div>
          `;
        }

        if (this.modal) {
          this.modal.classList.add('open');
        }

        this.form.reset();
      } catch (err) {
        alert(err.message || "Booking simulation failed.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScheduleBooking();
});
