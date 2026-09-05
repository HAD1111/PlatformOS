/* ===========================================================
   LUMÉ — Application Architecture
   
   Architecture Flow:
   Data Source (loadRestaurantData)
          ↓
   AppState (Restaurant Data + Cart State)
          ↓
   Rendering Functions (Pure/Separated UI renderers)
          ↓
   DOM Insertion & Event Delegation
          ↓
   User Interaction Handlers
   =========================================================== */

/* ===========================================================
   1. Data Layer (Demo / Fallback Data)
   =========================================================== */
const DEMO_DATA = {
  restaurant: {
    name: "LUMÉ",
    tagline: "Modern Mediterranean Dining",
    eyebrow: "Beirut, Lebanon",
    currency: "$",
    description: "Seasonal ingredients, open fire cooking, and a table that feels like home — reimagined for tonight.",
    contact: {
      address: "Rue Gouraud, Gemmayzeh, Beirut",
      phone: "+961 1 234 567",
      phoneRaw: "+9611234567",
      whatsappUrl: "https://wa.me/9611234567?text=Hello%20LUM%C3%89%2C%20I%20would%20like%20to%20reserve%20a%20table",
      directionsUrl: "https://maps.google.com/?q=Rue+Gouraud,+Gemmayzeh,+Beirut",
      instagramUrl: "https://instagram.com",
      facebookUrl: "https://facebook.com"
    },
    hours: [
      { days: "Monday – Thursday", time: "12:00 PM – 11:00 PM" },
      { days: "Friday – Sunday", time: "12:00 PM – 12:00 AM" }
    ]
  },
  featuredDishId: 2,
  categories: [
    { id: "starters", label: "Starters" },
    { id: "mains",    label: "Mains" },
    { id: "pizza",    label: "Pizza" },
    { id: "desserts", label: "Desserts" },
    { id: "drinks",   label: "Drinks" }
  ],
  menu: [
    {
      id: 1,
      category: "starters",
      name: "Burrata",
      description: "Creamy burrata, heirloom tomatoes, basil oil",
      ingredients: "Burrata, heirloom tomato, basil oil, sea salt, olive crostini",
      tags: ["Vegetarian"],
      price: 12,
      image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=900&auto=format&fit=crop",
      popular: true
    },
    {
      id: 2,
      category: "mains",
      name: "Grilled Sea Bass",
      description: "Charred vegetables, lemon herb butter",
      ingredients: "Whole sea bass, seasonal vegetables, lemon, herb butter",
      tags: ["Gluten-Free"],
      price: 24,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop",
      popular: false
    },
    {
      id: 3,
      category: "pizza",
      name: "Truffle Pizza",
      description: "Mozzarella, mushrooms, parmesan, truffle oil",
      ingredients: "San Marzano base, mozzarella, wild mushrooms, parmesan, truffle oil",
      tags: ["Vegetarian"],
      price: 19,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=900&auto=format&fit=crop",
      popular: true
    },
    {
      id: 4,
      category: "desserts",
      name: "Pistachio Tiramisu",
      description: "Classic tiramisu with pistachio cream",
      ingredients: "Mascarpone, espresso, pistachio cream, ladyfingers, cocoa",
      tags: ["Vegetarian"],
      price: 10,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=900&auto=format&fit=crop",
      popular: false
    },
    {
      id: 5,
      category: "starters",
      name: "Grilled Octopus",
      description: "Smoked paprika, fingerling potatoes, aioli",
      ingredients: "Octopus, fingerling potato, smoked paprika, garlic aioli",
      tags: ["Gluten-Free"],
      price: 16,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=900&auto=format&fit=crop",
      popular: false
    },
    {
      id: 6,
      category: "mains",
      name: "Lamb Kofta",
      description: "Charred lamb, tahini, pickled onion, flatbread",
      ingredients: "Lamb, tahini, sumac onion, herbs, flatbread",
      tags: [],
      price: 22,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=900&auto=format&fit=crop",
      popular: true
    },
    {
      id: 7,
      category: "pizza",
      name: "Margherita",
      description: "San Marzano tomato, fior di latte, basil",
      ingredients: "San Marzano tomato, fior di latte, fresh basil, olive oil",
      tags: ["Vegetarian"],
      price: 16,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=900&auto=format&fit=crop",
      popular: false
    },
    {
      id: 8,
      category: "drinks",
      name: "Citrus Spritz",
      description: "Blood orange, rosemary, sparkling wine",
      ingredients: "Blood orange, rosemary syrup, sparkling wine, soda",
      tags: [],
      price: 13,
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=900&auto=format&fit=crop",
      popular: false
    },
    {
      id: 9,
      category: "desserts",
      name: "Orange Blossom Baklava",
      description: "Walnuts, orange blossom syrup, pistachio dust",
      ingredients: "Phyllo, walnut, orange blossom syrup, pistachio",
      tags: ["Vegetarian"],
      price: 9,
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=900&auto=format&fit=crop",
      popular: false
    }
  ]
};

/**
 * Dedicated Data-Loading Layer
 * Currently returns local demo data.
 * To switch to menu.json in the next phase, replace the return statement with:
 *   const response = await fetch("./data/menu.json");
 *   return await response.json();
 */
async function loadRestaurantData() {
  return DEMO_DATA;
}

/* ===========================================================
   2. Cart Storage & Application State
   =========================================================== */
const CART_STORAGE_KEY = "lume_cart_v1";

const AppState = {
  data: null,
  activeCategory: "",
  currentModalItem: null,
  currentQty: 1,
  lastFocusedEl: null,
  cart: []
};

function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(AppState.cart));
  } catch (e) {
    console.warn("Unable to save cart to localStorage", e);
  }
}

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => 
        item && 
        typeof item.id === "number" && 
        typeof item.price === "number" && 
        typeof item.quantity === "number" && 
        item.quantity > 0
      );
    }
  } catch (e) {
    console.warn("Corrupted cart data in localStorage, resetting cart", e);
  }
  return [];
}

/* ===========================================================
   3. DOM Elements Cache
   =========================================================== */
const DOM = {
  menuTabs: document.getElementById("menuTabs"),
  menuGrid: document.getElementById("menuGrid"),
  modal: document.getElementById("foodModal"),
  modalScrim: document.getElementById("modalScrim"),
  modalImage: document.getElementById("modalImage"),
  modalCategory: document.getElementById("modalCategory"),
  modalTitle: document.getElementById("modalTitle"),
  modalDesc: document.getElementById("modalDesc"),
  modalIngredients: document.getElementById("modalIngredients"),
  modalTags: document.getElementById("modalTags"),
  modalPrice: document.getElementById("modalPrice"),
  qtyValue: document.getElementById("qtyValue"),
  qtyMinus: document.getElementById("qtyMinus"),
  qtyPlus: document.getElementById("qtyPlus"),
  addToOrderBtn: document.getElementById("addToOrderBtn"),
  modalClose: document.getElementById("modalClose"),
  discoverBtn: document.getElementById("discoverBtn"),
  toast: document.getElementById("toast"),
  nav: document.getElementById("nav"),
  cartBtn: document.getElementById("cartBtn"),
  cartBadge: document.getElementById("cartBadge"),
  drawerCartBtn: document.getElementById("drawerCartBtn"),
  drawerCartBadge: document.getElementById("drawerCartBadge"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartScrim: document.getElementById("cartScrim"),
  cartClose: document.getElementById("cartClose"),
  cartBody: document.getElementById("cartBody"),
  cartFooter: document.getElementById("cartFooter"),
  cartHeaderCount: document.getElementById("cartHeaderCount"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  burgerBtn: document.getElementById("burgerBtn"),
  drawer: document.getElementById("mobileDrawer"),
  drawerScrim: document.getElementById("drawerScrim"),
  scrollIndicator: document.getElementById("scrollIndicator")
};

/* ===========================================================
   4. Menu Rendering Functions (Pure UI Layer)
   =========================================================== */
function renderTabs(categories, activeCategoryId) {
  if (!DOM.menuTabs) return;
  DOM.menuTabs.innerHTML = categories.map(cat => `
    <button class="menu-tab"
            role="tab"
            id="tab-${cat.id}"
            aria-selected="${cat.id === activeCategoryId}"
            aria-controls="menuGrid"
            tabindex="${cat.id === activeCategoryId ? '0' : '-1'}"
            data-category="${cat.id}">
      ${cat.label}
    </button>
  `).join("");
}

function renderGrid(menuItems, activeCategoryId, currency) {
  if (!DOM.menuGrid) return;
  const items = menuItems.filter(item => item.category === activeCategoryId);
  DOM.menuGrid.setAttribute("aria-labelledby", `tab-${activeCategoryId}`);

  DOM.menuGrid.innerHTML = items.map((item, i) => `
    <button class="dish-card"
            data-id="${item.id}"
            style="animation-delay:${i * 60}ms"
            aria-label="${item.name}, ${currency}${item.price}. ${item.description}">
      <span class="dish-card__frame">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.popular ? '<span class="dish-card__badge">Popular</span>' : ""}
      </span>
      <span class="dish-card__row">
        <span class="dish-card__name">${item.name}</span>
        <span class="dish-card__price">${currency}${item.price}</span>
      </span>
      <span class="dish-card__desc">${item.description}</span>
    </button>
  `).join("");
}

function selectCategory(categoryId, focusTab = false) {
  if (!AppState.data) return;
  const categoryExists = AppState.data.categories.some(c => c.id === categoryId);
  if (!categoryExists) return;

  AppState.activeCategory = categoryId;
  renderTabs(AppState.data.categories, AppState.activeCategory);
  renderGrid(AppState.data.menu, AppState.activeCategory, AppState.data.restaurant.currency);

  if (focusTab) {
    const activeTabEl = document.getElementById(`tab-${categoryId}`);
    if (activeTabEl) activeTabEl.focus();
  }
}

/* ===========================================================
   5. Cart Calculation & State Operations
   =========================================================== */
function getCartItemCount() {
  return AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function addToCart(dishItem, quantity = 1) {
  if (!dishItem || !dishItem.id) return;
  const existing = AppState.cart.find(c => c.id === dishItem.id);
  const addQty = Math.max(1, quantity);

  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + addQty);
  } else {
    AppState.cart.push({
      id: dishItem.id,
      name: dishItem.name,
      price: dishItem.price,
      image: dishItem.image,
      quantity: Math.min(20, addQty)
    });
  }

  saveCartToStorage();
  renderCart();
  renderCartBadge();
}

function updateCartItemQuantity(itemId, delta) {
  const item = AppState.cart.find(c => c.id === itemId);
  if (!item) return;

  const newQty = Math.max(1, Math.min(20, item.quantity + delta));
  item.quantity = newQty;

  saveCartToStorage();
  renderCart();
  renderCartBadge();
}

function removeFromCart(itemId) {
  AppState.cart = AppState.cart.filter(c => c.id !== itemId);
  saveCartToStorage();
  renderCart();
  renderCartBadge();
}

/* ===========================================================
   6. Cart UI Rendering
   =========================================================== */
function renderCartBadge() {
  const count = getCartItemCount();
  
  if (DOM.cartBadge) {
    if (count > 0) {
      DOM.cartBadge.removeAttribute("hidden");
      DOM.cartBadge.textContent = String(count);
    } else {
      DOM.cartBadge.setAttribute("hidden", "");
      DOM.cartBadge.textContent = "0";
    }
  }

  if (DOM.cartBtn) {
    DOM.cartBtn.setAttribute("aria-label", `View your order, ${count} item${count === 1 ? "" : "s"} in cart`);
  }

  if (DOM.drawerCartBadge) {
    DOM.drawerCartBadge.textContent = String(count);
  }
}

function renderCart() {
  if (!DOM.cartBody) return;
  const currency = AppState.data ? AppState.data.restaurant.currency : "$";
  const count = getCartItemCount();
  const subtotal = getCartSubtotal();

  if (DOM.cartHeaderCount) {
    DOM.cartHeaderCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }

  if (DOM.cartSubtotal) {
    DOM.cartSubtotal.textContent = `${currency}${subtotal}`;
  }

  if (AppState.cart.length === 0) {
    if (DOM.cartFooter) DOM.cartFooter.style.display = "none";
    DOM.cartBody.innerHTML = `
      <div class="cart-empty">
        <h3 class="cart-empty__title">Your order is empty</h3>
        <p class="cart-empty__sub">Add something delicious from our menu.</p>
        <button class="btn btn--line cart-empty__btn" id="cartEmptyViewMenuBtn">View Menu</button>
      </div>
    `;
  } else {
    if (DOM.cartFooter) DOM.cartFooter.style.display = "flex";
    DOM.cartBody.innerHTML = `
      <ul class="cart-items" aria-label="Order items">
        ${AppState.cart.map(item => `
          <li class="cart-item" data-id="${item.id}">
            <div class="cart-item__media">
              <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item__info">
              <div class="cart-item__top">
                <h3 class="cart-item__name">${item.name}</h3>
                <button class="cart-item__remove" 
                        aria-label="Remove ${item.name} from order" 
                        data-remove-id="${item.id}"
                        title="Remove item">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="cart-item__price">${currency}${item.price} each</div>
              <div class="cart-item__bottom">
                <div class="qty qty--cart" role="group" aria-label="Quantity for ${item.name}">
                  <button class="qty__btn" 
                          data-qty-delta="-1" 
                          data-id="${item.id}" 
                          aria-label="Decrease quantity of ${item.name}" 
                          ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                  <span class="qty__val" aria-live="polite">${item.quantity}</span>
                  <button class="qty__btn" 
                          data-qty-delta="1" 
                          data-id="${item.id}" 
                          aria-label="Increase quantity of ${item.name}" 
                          ${item.quantity >= 20 ? "disabled" : ""}>+</button>
                </div>
                <div class="cart-item__total">${currency}${item.price * item.quantity}</div>
              </div>
            </div>
          </li>
        `).join("")}
      </ul>
    `;
  }
}

/* ===========================================================
   7. Cart Drawer Open / Close / Checkout
   =========================================================== */
let lastCartFocusEl = null;

function openCart() {
  if (!DOM.cartDrawer || !DOM.cartScrim) return;

  // Close other overlays cleanly
  if (DOM.drawer && DOM.drawer.classList.contains("is-open")) {
    closeDrawer();
  }
  if (DOM.modal && DOM.modal.classList.contains("is-open")) {
    closeModal();
  }

  lastCartFocusEl = document.activeElement;
  renderCart();
  renderCartBadge();

  DOM.cartDrawer.classList.add("is-open");
  DOM.cartScrim.classList.add("is-open");
  DOM.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (DOM.cartClose) {
    DOM.cartClose.focus();
  }
}

function closeCart() {
  if (!DOM.cartDrawer || !DOM.cartScrim) return;

  DOM.cartDrawer.classList.remove("is-open");
  DOM.cartScrim.classList.remove("is-open");
  DOM.cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastCartFocusEl && typeof lastCartFocusEl.focus === "function" && document.contains(lastCartFocusEl)) {
    lastCartFocusEl.focus();
  }
}

function handleCheckout() {
  showToast("Online ordering will be available soon! Please call or WhatsApp us to place your order directly.");
}

/* ===========================================================
   8. Food Modal Logic & Quantity Management
   =========================================================== */
function updateModalQuantity(newQty) {
  if (!AppState.currentModalItem) return;
  AppState.currentQty = Math.max(1, Math.min(20, newQty));

  if (DOM.qtyValue) DOM.qtyValue.textContent = AppState.currentQty;
  if (DOM.qtyMinus) DOM.qtyMinus.disabled = (AppState.currentQty <= 1);
  if (DOM.qtyPlus) DOM.qtyPlus.disabled = (AppState.currentQty >= 20);

  const totalPrice = AppState.currentModalItem.price * AppState.currentQty;
  const currency = AppState.data ? AppState.data.restaurant.currency : "$";
  if (DOM.modalPrice) {
    DOM.modalPrice.textContent = `${currency}${totalPrice}`;
  }
}

function openModal(dishId) {
  if (!AppState.data) return;
  const item = AppState.data.menu.find(m => m.id === dishId);
  if (!item) return;

  // Close cart drawer if open
  if (DOM.cartDrawer && DOM.cartDrawer.classList.contains("is-open")) {
    closeCart();
  }

  AppState.currentModalItem = item;
  AppState.lastFocusedEl = document.activeElement;

  if (DOM.modalImage) {
    DOM.modalImage.src = item.image;
    DOM.modalImage.alt = item.name;
  }
  if (DOM.modalCategory) {
    const cat = AppState.data.categories.find(c => c.id === item.category);
    DOM.modalCategory.textContent = cat ? cat.label : "";
  }
  if (DOM.modalTitle) DOM.modalTitle.textContent = item.name;
  if (DOM.modalDesc) DOM.modalDesc.textContent = item.description;

  if (DOM.modalIngredients) {
    DOM.modalIngredients.textContent = item.ingredients || "";
  }

  if (DOM.modalTags) {
    DOM.modalTags.innerHTML = item.tags && item.tags.length
      ? item.tags.map(tag => `<span>${tag}</span>`).join("")
      : "";
  }

  updateModalQuantity(1);

  if (DOM.modal && DOM.modalScrim) {
    DOM.modal.classList.add("is-open");
    DOM.modalScrim.classList.add("is-open");
    DOM.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  if (DOM.modalClose) {
    DOM.modalClose.focus();
  }
}

function closeModal() {
  if (!DOM.modal || !DOM.modalScrim) return;
  DOM.modal.classList.remove("is-open");
  DOM.modalScrim.classList.remove("is-open");
  DOM.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  AppState.currentModalItem = null;

  if (AppState.lastFocusedEl && typeof AppState.lastFocusedEl.focus === "function" && document.contains(AppState.lastFocusedEl)) {
    AppState.lastFocusedEl.focus();
  }
}

function addToOrder() {
  if (!AppState.currentModalItem) return;
  const qty = AppState.currentQty;
  const item = AppState.currentModalItem;
  
  addToCart(item, qty);
  showToast(`Added ${qty} × ${item.name} to your order`);
  closeModal();
}

/* ===========================================================
   9. Mobile Drawer Logic
   =========================================================== */
let lastDrawerFocusEl = null;

function openDrawer() {
  if (!DOM.drawer || !DOM.drawerScrim || !DOM.burgerBtn) return;
  
  // Close cart drawer if open
  if (DOM.cartDrawer && DOM.cartDrawer.classList.contains("is-open")) {
    closeCart();
  }

  lastDrawerFocusEl = document.activeElement;
  DOM.drawer.classList.add("is-open");
  DOM.drawerScrim.classList.add("is-open");
  DOM.drawer.setAttribute("aria-hidden", "false");
  DOM.burgerBtn.setAttribute("aria-expanded", "true");
  DOM.burgerBtn.setAttribute("aria-label", "Close menu");
  document.body.style.overflow = "hidden";

  const firstLink = DOM.drawer.querySelector("a, button");
  if (firstLink) firstLink.focus();
}

function closeDrawer() {
  if (!DOM.drawer || !DOM.drawerScrim || !DOM.burgerBtn) return;
  DOM.drawer.classList.remove("is-open");
  DOM.drawerScrim.classList.remove("is-open");
  DOM.drawer.setAttribute("aria-hidden", "true");
  DOM.burgerBtn.setAttribute("aria-expanded", "false");
  DOM.burgerBtn.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";

  if (lastDrawerFocusEl && typeof lastDrawerFocusEl.focus === "function" && document.contains(lastDrawerFocusEl)) {
    lastDrawerFocusEl.focus();
  }
}

function toggleDrawer() {
  if (!DOM.drawer) return;
  DOM.drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
}

/* ===========================================================
   10. Toast Notification
   =========================================================== */
let toastTimer = null;

function showToast(message) {
  if (!DOM.toast) return;
  DOM.toast.textContent = message;
  DOM.toast.classList.remove("is-visible");
  
  // Force reflow to cleanly restart animation
  void DOM.toast.offsetWidth;
  
  DOM.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.toast.classList.remove("is-visible");
  }, 2600);
}

/* ===========================================================
   11. Scroll Handlers & Reveal Animations
   =========================================================== */
function handleScroll() {
  if (!DOM.nav) return;
  if (window.scrollY > 40) {
    DOM.nav.classList.add("is-scrolled");
  } else {
    DOM.nav.classList.remove("is-scrolled");
  }
}

function setupScrollReveals() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add("is-visible"));
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // Hero staggered entrance on initial load
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("is-visible"), 150 + i * 120);
  });
}

/* ===========================================================
   12. Event Delegation & Setup
   =========================================================== */
function attachEventDelegation() {
  // Category tabs click delegation
  if (DOM.menuTabs) {
    DOM.menuTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".menu-tab");
      if (tab && tab.dataset.category) {
        selectCategory(tab.dataset.category, false);
      }
    });

    // Keyboard navigation for WAI-ARIA tablist
    DOM.menuTabs.addEventListener("keydown", (e) => {
      if (!AppState.data) return;
      const cats = AppState.data.categories;
      const currentIndex = cats.findIndex(c => c.id === AppState.activeCategory);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % cats.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + cats.length) % cats.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = cats.length - 1;
      }

      if (nextIndex !== -1) {
        selectCategory(cats[nextIndex].id, true);
      }
    });
  }

  // Dish cards click delegation
  if (DOM.menuGrid) {
    DOM.menuGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".dish-card");
      if (card && card.dataset.id) {
        openModal(Number(card.dataset.id));
      }
    });
  }

  // Featured dish button
  if (DOM.discoverBtn) {
    DOM.discoverBtn.addEventListener("click", (e) => {
      const dishId = Number(e.currentTarget.dataset.id) || (AppState.data && AppState.data.featuredDishId) || 2;
      openModal(dishId);
    });
  }

  // Food modal controls
  if (DOM.modalClose) DOM.modalClose.addEventListener("click", closeModal);
  if (DOM.modalScrim) DOM.modalScrim.addEventListener("click", closeModal);
  if (DOM.qtyMinus) DOM.qtyMinus.addEventListener("click", () => updateModalQuantity(AppState.currentQty - 1));
  if (DOM.qtyPlus) DOM.qtyPlus.addEventListener("click", () => updateModalQuantity(AppState.currentQty + 1));
  if (DOM.addToOrderBtn) DOM.addToOrderBtn.addEventListener("click", addToOrder);

  // Modal focus trap & accessibility
  if (DOM.modal) {
    DOM.modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = DOM.modal.querySelectorAll("button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Cart button & drawer controls
  if (DOM.cartBtn) DOM.cartBtn.addEventListener("click", openCart);
  if (DOM.drawerCartBtn) {
    DOM.drawerCartBtn.addEventListener("click", () => {
      closeDrawer();
      openCart();
    });
  }
  if (DOM.cartClose) DOM.cartClose.addEventListener("click", closeCart);
  if (DOM.cartScrim) DOM.cartScrim.addEventListener("click", closeCart);
  if (DOM.checkoutBtn) DOM.checkoutBtn.addEventListener("click", handleCheckout);

  // Cart body delegation (quantity adjustment, remove, empty state button)
  if (DOM.cartBody) {
    DOM.cartBody.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-id]");
      if (removeBtn) {
        const id = Number(removeBtn.dataset.removeId);
        removeFromCart(id);
        return;
      }

      const qtyBtn = e.target.closest("[data-qty-delta]");
      if (qtyBtn) {
        const id = Number(qtyBtn.dataset.id);
        const delta = Number(qtyBtn.dataset.qtyDelta);
        updateCartItemQuantity(id, delta);
        return;
      }

      const viewMenuBtn = e.target.closest("#cartEmptyViewMenuBtn");
      if (viewMenuBtn) {
        closeCart();
        const menuSection = document.getElementById("menu");
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Focus trap inside Cart Drawer
  if (DOM.cartDrawer) {
    DOM.cartDrawer.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = DOM.cartDrawer.querySelectorAll("button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Mobile drawer controls
  if (DOM.burgerBtn) DOM.burgerBtn.addEventListener("click", toggleDrawer);
  if (DOM.drawerScrim) DOM.drawerScrim.addEventListener("click", closeDrawer);
  if (DOM.drawer) {
    DOM.drawer.querySelectorAll("a").forEach(link => link.addEventListener("click", closeDrawer));
    
    // Focus trap inside drawer
    DOM.drawer.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = DOM.drawer.querySelectorAll("a, button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Global Escape key handler (coordinating overlays)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (DOM.modal && DOM.modal.classList.contains("is-open")) {
        closeModal();
      } else if (DOM.cartDrawer && DOM.cartDrawer.classList.contains("is-open")) {
        closeCart();
      } else if (DOM.drawer && DOM.drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    }
  });

  // Hero scroll button
  if (DOM.scrollIndicator) {
    DOM.scrollIndicator.addEventListener("click", () => {
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Navbar scroll listener
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/* ===========================================================
   13. Application Initialization
   =========================================================== */
async function initApp() {
  try {
    const data = await loadRestaurantData();
    AppState.data = data;
    AppState.activeCategory = data.categories[0]?.id || "";
    AppState.cart = loadCartFromStorage();

    renderTabs(data.categories, AppState.activeCategory);
    renderGrid(data.menu, AppState.activeCategory, data.restaurant.currency);
    renderCartBadge();
    renderCart();

    attachEventDelegation();
    setupScrollReveals();
  } catch (error) {
    console.error("Failed to initialize LUMÉ restaurant application:", error);
  }
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

