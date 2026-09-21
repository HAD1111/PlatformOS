/**
 * ==============================================================================
 * RestoOS — Functional Partner Dashboard Controller (Stage 2A)
 * ==============================================================================
 * Pure Vanilla JavaScript — Zero Framework Dependencies
 *
 * Architecture Flow:
 *   Dashboard UI Events
 *            ↓
 *     RestaurantStore (Platform/js/restaurant-store.js)
 *            ↓
 *       localStorage
 *            ↓
 *   LUMÉ Customer Site (Live Cross-Tab Sync via Storage Events)
 * ==============================================================================
 */

(function () {
  'use strict';

  class PartnerDashboardApp {
    constructor() {
      this.store = window.RestaurantStore;
      this.currentView = 'overview';
      this.activeCategoryFilter = 'all';
      this.searchQuery = '';
      this.reorderMode = false;
      this.draggedRowId = null;
      this.lastFocusedEl = null;

      // Tag & Label Picker State
      this.currentEditingItemId = null;
      this.currentEditingDietaryTags = [];
      this.currentEditingDishLabels = [];
      this.tagPickerType = null; // 'dietary' | 'label'
      this.tagPickerSearchQuery = '';
      this.tagPickerOpenerEl = null;

      // Cache DOM Elements
      this.dom = {
        // Navigation & Views
        sidebar: document.getElementById('dashSidebar'),
        sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
        sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
        sidebarScrim: document.getElementById('sidebarScrim'),
        topbarName: document.getElementById('dashTopbarName'),
        logoutBtn: document.getElementById('logoutBtn'),
        navItems: document.querySelectorAll('.dash-nav-item[data-view-target]'),
        previewNavItems: document.querySelectorAll('.dash-nav-item[data-preview-msg]'),
        views: {
          overview: document.getElementById('viewOverview'),
          'menu-items': document.getElementById('viewMenuItems'),
          profile: document.getElementById('viewProfile'),
          'website-content': document.getElementById('viewWebsiteContent')
        },

        // Overview
        overviewGreeting: document.getElementById('overviewGreeting'),
        overviewRestaurantName: document.getElementById('overviewRestaurantName'),
        metricActiveItems: document.getElementById('metricActiveItems'),
        metricCategoriesCount: document.getElementById('metricCategoriesCount'),
        overviewMenuTbody: document.getElementById('overviewMenuTbody'),
        quickRestName: document.getElementById('quickRestName'),
        quickRestAddress: document.getElementById('quickRestAddress'),
        quickRestWhatsapp: document.getElementById('quickRestWhatsapp'),
        btnQuickEditMenu: document.getElementById('btnQuickEditMenu'),
        btnGoToFullMenu: document.getElementById('btnGoToFullMenu'),
        btnQuickEditProfile: document.getElementById('btnQuickEditProfile'),
        btnQuickActionMenu: document.getElementById('btnQuickActionMenu'),
        btnQuickActionProfile: document.getElementById('btnQuickActionProfile'),
        btnQuickActionReset: document.getElementById('btnQuickActionReset'),
        sidebarResetBtn: document.getElementById('sidebarResetBtn'),

        // Menu Management
        categoryFilterContainer: document.getElementById('categoryFilterContainer'),
        menuSearchInput: document.getElementById('menuSearchInput'),
        btnToggleReorder: document.getElementById('btnToggleReorder'),
        btnToggleReorderText: document.getElementById('btnToggleReorderText'),
        reorderModeBanner: document.getElementById('reorderModeBanner'),
        btnDoneReorder: document.getElementById('btnDoneReorder'),
        fullMenuTable: document.getElementById('fullMenuTable'),
        fullMenuTbody: document.getElementById('fullMenuTbody'),
        menuEmptyNotice: document.getElementById('menuEmptyNotice'),
        btnResetSearchFilter: document.getElementById('btnResetSearchFilter'),

        // Restaurant Profile Form
        profileForm: document.getElementById('profileForm'),
        profName: document.getElementById('profName'),
        profTagline: document.getElementById('profTagline'),
        profEyebrow: document.getElementById('profEyebrow'),
        profCurrency: document.getElementById('profCurrency'),
        profDesc: document.getElementById('profDesc'),
        profAddress: document.getElementById('profAddress'),
        profPhone: document.getElementById('profPhone'),
        profWhatsapp: document.getElementById('profWhatsapp'),
        profEmail: document.getElementById('profEmail'),
        profDirections: document.getElementById('profDirections'),
        btnDiscardProfile: document.getElementById('btnDiscardProfile'),
        btnProfileCancel: document.getElementById('btnProfileCancel'),
        btnProfileResetDemo: document.getElementById('btnProfileResetDemo'),

        // Website Content Editor
        formContentHero: document.getElementById('formContentHero'),
        heroEyebrowInput: document.getElementById('heroEyebrowInput'),
        heroHeadingInput: document.getElementById('heroHeadingInput'),
        heroTaglineInput: document.getElementById('heroTaglineInput'),
        heroDescInput: document.getElementById('heroDescInput'),
        heroPrimaryEnabled: document.getElementById('heroPrimaryEnabled'),
        heroPrimaryTextInput: document.getElementById('heroPrimaryTextInput'),
        heroPrimaryLinkInput: document.getElementById('heroPrimaryLinkInput'),
        heroSecondaryEnabled: document.getElementById('heroSecondaryEnabled'),
        heroSecondaryTextInput: document.getElementById('heroSecondaryTextInput'),
        heroSecondaryLinkInput: document.getElementById('heroSecondaryLinkInput'),
        btnSaveHero: document.getElementById('btnSaveHero'),

        formContentMenuSection: document.getElementById('formContentMenuSection'),
        menuEyebrowInput: document.getElementById('menuEyebrowInput'),
        menuHeadingInput: document.getElementById('menuHeadingInput'),
        btnSaveMenuSection: document.getElementById('btnSaveMenuSection'),

        formContentAbout: document.getElementById('formContentAbout'),
        aboutEyebrowInput: document.getElementById('aboutEyebrowInput'),
        aboutHeadingInput: document.getElementById('aboutHeadingInput'),
        aboutIntroInput: document.getElementById('aboutIntroInput'),
        aboutDescInput: document.getElementById('aboutDescInput'),
        btnSaveAbout: document.getElementById('btnSaveAbout'),

        formContentAboutStats: document.getElementById('formContentAboutStats'),
        btnAddAboutStat: document.getElementById('btnAddAboutStat'),
        aboutStatsList: document.getElementById('aboutStatsList'),
        statsCounterNotice: document.getElementById('statsCounterNotice'),
        btnSaveAboutStats: document.getElementById('btnSaveAboutStats'),

        formContentFeatured: document.getElementById('formContentFeatured'),
        featuredDishSelect: document.getElementById('featuredDishSelect'),
        featuredDishPreviewWrap: document.getElementById('featuredDishPreviewWrap'),
        featuredEyebrowInput: document.getElementById('featuredEyebrowInput'),
        featuredHeadingInput: document.getElementById('featuredHeadingInput'),
        featuredDescInput: document.getElementById('featuredDescInput'),
        featuredButtonTextInput: document.getElementById('featuredButtonTextInput'),
        featuredButtonLinkInput: document.getElementById('featuredButtonLinkInput'),
        btnSaveFeatured: document.getElementById('btnSaveFeatured'),

        formContentFinalCta: document.getElementById('formContentFinalCta'),
        ctaEyebrowInput: document.getElementById('ctaEyebrowInput'),
        ctaHeadingInput: document.getElementById('ctaHeadingInput'),
        ctaDescInput: document.getElementById('ctaDescInput'),
        ctaButtonTextInput: document.getElementById('ctaButtonTextInput'),
        ctaButtonLinkInput: document.getElementById('ctaButtonLinkInput'),
        btnSaveFinalCta: document.getElementById('btnSaveFinalCta'),

        // Edit Item Modal
        editModalScrim: document.getElementById('editModalScrim'),
        editItemModal: document.getElementById('editItemModal'),
        editItemForm: document.getElementById('editItemForm'),
        editItemId: document.getElementById('editItemId'),
        editItemPhotoPreview: document.getElementById('editItemPhotoPreview'),
        btnChangePhoto: document.getElementById('btnChangePhoto'),
        editItemName: document.getElementById('editItemName'),
        editItemPrice: document.getElementById('editItemPrice'),
        editItemCategory: document.getElementById('editItemCategory'),
        editItemDesc: document.getElementById('editItemDesc'),
        editItemIngredients: document.getElementById('editItemIngredients'),
        editItemDietaryTags: document.getElementById('editItemDietaryTags'),
        btnAddDietaryTag: document.getElementById('btnAddDietaryTag'),
        editItemDishLabels: document.getElementById('editItemDishLabels'),
        btnAddDishLabel: document.getElementById('btnAddDishLabel'),
        editItemAvailable: document.getElementById('editItemAvailable'),
        btnEditModalClose: document.getElementById('btnEditModalClose'),
        btnEditModalCancel: document.getElementById('btnEditModalCancel'),

        // Tag Picker Modal
        tagPickerScrim: document.getElementById('tagPickerScrim'),
        tagPickerModal: document.getElementById('tagPickerModal'),
        tagPickerTitle: document.getElementById('tagPickerTitle'),
        btnTagPickerClose: document.getElementById('btnTagPickerClose'),
        btnTagPickerCancel: document.getElementById('btnTagPickerCancel'),
        tagPickerSearchInput: document.getElementById('tagPickerSearchInput'),
        tagPickerList: document.getElementById('tagPickerList'),
        tagPickerCreateWrap: document.getElementById('tagPickerCreateWrap'),
        btnTagPickerCreate: document.getElementById('btnTagPickerCreate'),
        tagPickerCreateName: document.getElementById('tagPickerCreateName'),

        // Reset Demo Data Modal
        resetModalScrim: document.getElementById('resetModalScrim'),
        resetModal: document.getElementById('resetModal'),
        btnResetModalClose: document.getElementById('btnResetModalClose'),
        btnResetModalCancel: document.getElementById('btnResetModalCancel'),
        btnResetModalConfirm: document.getElementById('btnResetModalConfirm'),

        // Toast
        toast: document.getElementById('dashToast'),
        toastIcon: document.getElementById('dashToastIcon'),
        toastMessage: document.getElementById('dashToastMessage')
      };

      this.init();
    }

    init() {
      if (!this.store) {
        console.error('[PartnerDashboard] RestaurantStore not loaded.');
        return;
      }

      this.setupNavigation();
      this.setupOverview();
      this.setupMenuManagement();
      this.setupProfileEditor();
      this.setupWebsiteContentEditor();
      this.setupModals();
      this.setupStorageSync();

      // Render initial state
      this.refreshAll();

      // Check initial URL hash (e.g. #menu-items or #profile)
      this.handleInitialHash();
    }

    /* --------------------------------------------------------------------------
       1. View Navigation
       -------------------------------------------------------------------------- */
    setupNavigation() {
      // Sidebar tab switching
      this.dom.navItems.forEach(item => {
        item.addEventListener('click', () => {
          const targetView = item.getAttribute('data-view-target');
          if (targetView) {
            this.switchView(targetView);
            this.closeMobileSidebar();
          }
        });
      });

      // Preview tabs toast
      this.dom.previewNavItems.forEach(item => {
        item.addEventListener('click', () => {
          const msg = item.getAttribute('data-preview-msg') || 'Coming Soon: This feature is currently under development and will be available in a future update.';
          this.showToast(msg, 'info');
          this.closeMobileSidebar();
        });
      });

      // Mobile sidebar burger toggle
      if (this.dom.sidebarToggleBtn && this.dom.sidebar) {
        this.dom.sidebarToggleBtn.addEventListener('click', () => {
          if (this.dom.sidebar.classList.contains('open')) {
            this.closeMobileSidebar();
          } else {
            this.openMobileSidebar();
          }
        });
      }

      // Mobile sidebar close button
      if (this.dom.sidebarCloseBtn) {
        this.dom.sidebarCloseBtn.addEventListener('click', () => {
          this.closeMobileSidebar();
          if (this.dom.sidebarToggleBtn) this.dom.sidebarToggleBtn.focus();
        });
      }

      // Mobile sidebar backdrop overlay click
      if (this.dom.sidebarScrim) {
        this.dom.sidebarScrim.addEventListener('click', () => {
          this.closeMobileSidebar();
        });
      }

      // Logout handler
      if (this.dom.logoutBtn) {
        this.dom.logoutBtn.addEventListener('click', async () => {
          if (window.apiClient) await window.apiClient.partnerLogout();
          window.location.href = 'index.html';
        });
      }

      // Quick navigation shortcuts
      if (this.dom.btnQuickEditMenu) {
        this.dom.btnQuickEditMenu.addEventListener('click', () => this.switchView('menu-items'));
      }
      if (this.dom.btnGoToFullMenu) {
        this.dom.btnGoToFullMenu.addEventListener('click', () => this.switchView('menu-items'));
      }
      if (this.dom.btnQuickActionMenu) {
        this.dom.btnQuickActionMenu.addEventListener('click', () => this.switchView('menu-items'));
      }
      if (this.dom.btnQuickEditProfile) {
        this.dom.btnQuickEditProfile.addEventListener('click', () => this.switchView('profile'));
      }
      if (this.dom.btnQuickActionProfile) {
        this.dom.btnQuickActionProfile.addEventListener('click', () => this.switchView('profile'));
      }
      if (this.dom.btnQuickActionReset) {
        this.dom.btnQuickActionReset.addEventListener('click', () => this.openResetModal());
      }
      if (this.dom.sidebarResetBtn) {
        this.dom.sidebarResetBtn.addEventListener('click', () => {
          this.closeMobileSidebar();
          this.openResetModal();
        });
      }
    }

    openMobileSidebar() {
      if (!this.dom.sidebar) return;
      this.dom.sidebar.classList.add('open');
      if (this.dom.sidebarScrim) {
        this.dom.sidebarScrim.classList.add('is-open');
        this.dom.sidebarScrim.setAttribute('aria-hidden', 'false');
      }
      if (this.dom.sidebarToggleBtn) {
        this.dom.sidebarToggleBtn.setAttribute('aria-expanded', 'true');
        this.dom.sidebarToggleBtn.setAttribute('aria-label', 'Close navigation');
      }
      if (this.dom.sidebarCloseBtn) {
        setTimeout(() => this.dom.sidebarCloseBtn.focus(), 50);
      }
    }

    closeMobileSidebar() {
      if (!this.dom.sidebar) return;
      this.dom.sidebar.classList.remove('open');
      if (this.dom.sidebarScrim) {
        this.dom.sidebarScrim.classList.remove('is-open');
        this.dom.sidebarScrim.setAttribute('aria-hidden', 'true');
      }
      if (this.dom.sidebarToggleBtn) {
        this.dom.sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        this.dom.sidebarToggleBtn.setAttribute('aria-label', 'Open navigation');
      }
    }

    handleInitialHash() {
      const hash = (window.location.hash || '').replace('#', '').trim();
      if (['menu-items', 'profile', 'overview', 'website-content'].includes(hash)) {
        this.switchView(hash);
      }
    }

    switchView(viewName) {
      if (!this.dom.views[viewName]) return;

      // Update active view class
      Object.keys(this.dom.views).forEach(k => {
        if (this.dom.views[k]) {
          this.dom.views[k].classList.toggle('active', k === viewName);
        }
      });

      // Update sidebar nav active state
      this.dom.navItems.forEach(item => {
        const target = item.getAttribute('data-view-target');
        item.classList.toggle('active', target === viewName);
      });

      this.currentView = viewName;
      window.location.hash = viewName;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Refresh data for the active view
      if (viewName === 'overview') this.renderOverview();
      if (viewName === 'menu-items') this.renderMenuList();
      if (viewName === 'profile') this.populateProfileForm();
      if (viewName === 'website-content') this.populateWebsiteContentForms();
    }

    /* --------------------------------------------------------------------------
       2. Overview Management
       -------------------------------------------------------------------------- */
    setupOverview() {
      // Event delegation for Edit button in Overview table
      if (this.dom.overviewMenuTbody) {
        this.dom.overviewMenuTbody.addEventListener('click', (e) => {
          const editBtn = e.target.closest('.btn-edit-item');
          if (editBtn) {
            const id = editBtn.getAttribute('data-id');
            if (id) this.openEditItemModal(id);
          }
        });
      }
    }

    renderOverview() {
      const data = this.store.getRestaurant();
      const restaurant = data.restaurant;
      const menu = data.menu || [];
      const categories = data.categories || [];

      // Topbar & Header
      if (this.dom.topbarName) {
        this.dom.topbarName.textContent = `${restaurant.name} — ${restaurant.eyebrow || 'Beirut'}`;
      }
      if (this.dom.overviewGreeting) {
        this.dom.overviewGreeting.textContent = `Welcome back, Chef Karim`;
      }
      if (this.dom.overviewRestaurantName) {
        this.dom.overviewRestaurantName.textContent = restaurant.name;
      }

      // Metrics
      const activeCount = menu.filter(item => item.available !== false).length;
      if (this.dom.metricActiveItems) {
        this.dom.metricActiveItems.textContent = `${activeCount}`;
      }
      if (this.dom.metricCategoriesCount) {
        this.dom.metricCategoriesCount.textContent = `${categories.length} categories active`;
      }

      // Quick identity card
      if (this.dom.quickRestName) this.dom.quickRestName.textContent = restaurant.name;
      if (this.dom.quickRestAddress) this.dom.quickRestAddress.textContent = restaurant.contact.address || '—';
      if (this.dom.quickRestWhatsapp) this.dom.quickRestWhatsapp.textContent = restaurant.contact.whatsapp || '—';

      // Live Menu Highlights Table (First 5 dishes)
      if (this.dom.overviewMenuTbody) {
        const previewDishes = menu.slice(0, 5);
        this.dom.overviewMenuTbody.innerHTML = previewDishes.map(item => {
          const isAvailable = item.available !== false;
          const statusBadge = isAvailable
            ? `<span class="badge badge-emerald">In Stock</span>`
            : `<span class="badge badge-subtle" style="color:var(--accent-rose);">86'd / Sold Out</span>`;

          return `
            <tr>
              <td>
                <div class="dish-cell-info">
                  <img src="${item.image}" alt="${item.name}" class="dish-thumb" loading="lazy">
                  <div class="dish-cell-text">
                    <span class="dish-cell-name">${item.name}</span>
                    <span class="dish-cell-sub">${item.ingredients || item.description}</span>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-subtle">${this.capitalize(item.category)}</span></td>
              <td><strong>${restaurant.currency || '$'}${item.price.toFixed(2)}</strong></td>
              <td>${statusBadge}</td>
              <td style="text-align:right;">
                <button type="button" class="btn btn-line btn-sm btn-edit-item" data-id="${item.id}">
                  Edit
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    /* --------------------------------------------------------------------------
       3. Menu Management
       -------------------------------------------------------------------------- */
    setupMenuManagement() {
      // Category filter pills
      if (this.dom.categoryFilterContainer) {
        this.dom.categoryFilterContainer.addEventListener('click', (e) => {
          const pill = e.target.closest('.category-pill');
          if (!pill) return;

          this.dom.categoryFilterContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');

          this.activeCategoryFilter = pill.getAttribute('data-category') || 'all';
          if (this.activeCategoryFilter === 'all' && this.reorderMode) {
            this.reorderMode = false;
          }
          this.updateReorderModeState();
          this.renderMenuList();
        });
      }

      // Reorder Mode Toggle button
      if (this.dom.btnToggleReorder) {
        this.dom.btnToggleReorder.addEventListener('click', () => {
          if (this.activeCategoryFilter === 'all') return;
          this.reorderMode = !this.reorderMode;
          this.updateReorderModeState();
        });
      }

      // Reorder Mode Done button
      if (this.dom.btnDoneReorder) {
        this.dom.btnDoneReorder.addEventListener('click', () => {
          this.reorderMode = false;
          this.updateReorderModeState();
        });
      }

      // Live Search
      if (this.dom.menuSearchInput) {
        this.dom.menuSearchInput.addEventListener('input', (e) => {
          this.searchQuery = (e.target.value || '').trim().toLowerCase();
          this.renderMenuList();
        });
      }

      // Reset search filter button
      if (this.dom.btnResetSearchFilter) {
        this.dom.btnResetSearchFilter.addEventListener('click', () => {
          this.searchQuery = '';
          this.activeCategoryFilter = 'all';
          this.reorderMode = false;
          this.updateReorderModeState();
          if (this.dom.menuSearchInput) this.dom.menuSearchInput.value = '';
          if (this.dom.categoryFilterContainer) {
            this.dom.categoryFilterContainer.querySelectorAll('.category-pill').forEach(p => {
              p.classList.toggle('active', p.getAttribute('data-category') === 'all');
            });
          }
          this.renderMenuList();
        });
      }

      // Event delegation for actions in full menu table
      if (this.dom.fullMenuTbody) {
        this.dom.fullMenuTbody.addEventListener('click', (e) => {
          // Edit button
          const editBtn = e.target.closest('.btn-edit-item');
          if (editBtn) {
            const id = editBtn.getAttribute('data-id');
            if (id) this.openEditItemModal(id);
            return;
          }

          // Toggle availability button
          const toggleBtn = e.target.closest('.btn-toggle-availability');
          if (toggleBtn) {
            const id = toggleBtn.getAttribute('data-id');
            if (id) {
              const updated = this.store.toggleItemAvailability(id);
              this.refreshAll();
              const stateText = updated.available ? 'marked In Stock' : 'marked Sold Out (86\'d)';
              this.showToast(`"${updated.name}" ${stateText} & synced to LUMÉ.`);
            }
            return;
          }

          // Move Up button
          const moveUpBtn = e.target.closest('.btn-move-up');
          if (moveUpBtn) {
            const id = Number(moveUpBtn.getAttribute('data-id'));
            this.handleMoveItem(id, 'up');
            return;
          }

          // Move Down button
          const moveDownBtn = e.target.closest('.btn-move-down');
          if (moveDownBtn) {
            const id = Number(moveDownBtn.getAttribute('data-id'));
            this.handleMoveItem(id, 'down');
            return;
          }
        });

        // HTML5 Drag and Drop events for reordering (scoped to active category)
        this.dom.fullMenuTbody.addEventListener('dragstart', (e) => {
          if (this.activeCategoryFilter === 'all') {
            e.preventDefault();
            return;
          }
          const row = e.target.closest('tr.dish-row');
          if (!row) return;
          this.draggedRowId = Number(row.getAttribute('data-id'));
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(this.draggedRowId));
          setTimeout(() => row.classList.add('is-dragging'), 10);
        });

        this.dom.fullMenuTbody.addEventListener('dragover', (e) => {
          if (this.activeCategoryFilter === 'all') return;
          const targetRow = e.target.closest('tr.dish-row');
          if (!targetRow || !this.draggedRowId) return;
          const targetId = Number(targetRow.getAttribute('data-id'));
          if (targetId === this.draggedRowId) return;

          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';

          const rect = targetRow.getBoundingClientRect();
          const isTopHalf = (e.clientY - rect.top) < (rect.height / 2);

          targetRow.classList.toggle('drag-over-top', isTopHalf);
          targetRow.classList.toggle('drag-over-bottom', !isTopHalf);
        });

        this.dom.fullMenuTbody.addEventListener('dragleave', (e) => {
          const targetRow = e.target.closest('tr.dish-row');
          if (targetRow) {
            targetRow.classList.remove('drag-over-top', 'drag-over-bottom');
          }
        });

        this.dom.fullMenuTbody.addEventListener('drop', (e) => {
          e.preventDefault();
          if (this.activeCategoryFilter === 'all') return;

          const targetRow = e.target.closest('tr.dish-row');
          if (!targetRow || !this.draggedRowId) return;

          const targetId = Number(targetRow.getAttribute('data-id'));
          const isTopHalf = targetRow.classList.contains('drag-over-top');
          this.cleanDragStates();

          if (targetId !== this.draggedRowId) {
            const position = isTopHalf ? 'before' : 'after';
            this.reorderItemsInCategory(this.draggedRowId, targetId, position);
          }
        });

        this.dom.fullMenuTbody.addEventListener('dragend', () => {
          this.cleanDragStates();
          this.draggedRowId = null;
        });
      }
    }

    updateReorderModeState() {
      if (this.activeCategoryFilter === 'all') {
        this.reorderMode = false;
      }
      if (this.dom.reorderModeBanner) {
        this.dom.reorderModeBanner.classList.toggle('active', this.reorderMode);
      }
      if (this.dom.btnToggleReorder) {
        this.dom.btnToggleReorder.setAttribute('aria-pressed', this.reorderMode ? 'true' : 'false');
      }
      if (this.dom.btnToggleReorderText) {
        this.dom.btnToggleReorderText.textContent = this.reorderMode ? 'Done Reordering' : 'Reorder Menu';
      }
    }

    cleanDragStates() {
      if (!this.dom.fullMenuTbody) return;
      this.dom.fullMenuTbody.querySelectorAll('tr.dish-row').forEach(row => {
        row.classList.remove('is-dragging', 'drag-over-top', 'drag-over-bottom');
      });
    }

    handleMoveItem(id, direction) {
      if (this.activeCategoryFilter === 'all') return;
      const data = this.store.getRestaurant();
      let categoryItems = (data.menu || [])
        .filter(item => item.category === this.activeCategoryFilter)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const currentIdx = categoryItems.findIndex(item => item.id === id);
      if (currentIdx === -1) return;

      const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
      if (targetIdx < 0 || targetIdx >= categoryItems.length) return;

      const [movedItem] = categoryItems.splice(currentIdx, 1);
      categoryItems.splice(targetIdx, 0, movedItem);

      const orderedIds = categoryItems.map(item => item.id);
      this.store.reorderCategoryItems(this.activeCategoryFilter, orderedIds);
      this.refreshAll();
      this.showToast(`"${movedItem.name}" moved to position #${targetIdx + 1} in ${this.capitalize(this.activeCategoryFilter)} & synced to LUMÉ!`);
    }

    reorderItemsInCategory(draggedId, targetId, insertPosition = 'before') {
      if (this.activeCategoryFilter === 'all') return;
      const data = this.store.getRestaurant();
      let categoryItems = (data.menu || [])
        .filter(item => item.category === this.activeCategoryFilter)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const draggedItem = categoryItems.find(item => item.id === draggedId);
      if (!draggedItem) return;

      const withoutDragged = categoryItems.filter(item => item.id !== draggedId);
      const targetIdx = withoutDragged.findIndex(item => item.id === targetId);
      if (targetIdx === -1) return;

      const insertIdx = insertPosition === 'before' ? targetIdx : targetIdx + 1;
      withoutDragged.splice(insertIdx, 0, draggedItem);

      const orderedIds = withoutDragged.map(item => item.id);
      this.store.reorderCategoryItems(this.activeCategoryFilter, orderedIds);
      this.refreshAll();

      const newPosition = withoutDragged.findIndex(item => item.id === draggedId) + 1;
      this.showToast(`"${draggedItem.name}" moved to position #${newPosition} in ${this.capitalize(this.activeCategoryFilter)} & synced to LUMÉ!`);
      return draggedItem;
    }

    renderMenuList() {
      if (!this.dom.fullMenuTbody) return;

      const data = this.store.getRestaurant();
      const currency = data.restaurant.currency || '$';
      let items = (data.menu || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const isViewOnly = (this.activeCategoryFilter === 'all');

      // Update table view-only state and reorder button disabled state
      if (this.dom.fullMenuTable) {
        this.dom.fullMenuTable.classList.toggle('is-view-only', isViewOnly);
      }
      if (this.dom.btnToggleReorder) {
        this.dom.btnToggleReorder.disabled = isViewOnly;
        this.dom.btnToggleReorder.title = isViewOnly
          ? 'Select a specific category to reorder dishes'
          : 'Toggle menu reordering mode';
      }
      if (isViewOnly && this.reorderMode) {
        this.reorderMode = false;
        this.updateReorderModeState();
      }

      // Filter by Category
      if (!isViewOnly) {
        items = items.filter(item => item.category === this.activeCategoryFilter);
      }

      // Filter by Search Query
      if (this.searchQuery) {
        items = items.filter(item => {
          const matchName = (item.name || '').toLowerCase().includes(this.searchQuery);
          const matchDesc = (item.description || '').toLowerCase().includes(this.searchQuery);
          const matchIng = (item.ingredients || '').toLowerCase().includes(this.searchQuery);
          return matchName || matchDesc || matchIng;
        });
      }

      // Empty State Check
      if (items.length === 0) {
        this.dom.fullMenuTbody.innerHTML = '';
        if (this.dom.menuEmptyNotice) this.dom.menuEmptyNotice.style.display = 'block';
        return;
      }

      if (this.dom.menuEmptyNotice) this.dom.menuEmptyNotice.style.display = 'none';

      this.dom.fullMenuTbody.innerHTML = items.map((item, index) => {
        const isAvailable = item.available !== false;
        const statusBadge = isAvailable
          ? `<span class="badge badge-emerald">In Stock</span>`
          : `<span class="badge badge-subtle" style="color:var(--accent-rose); border-color:rgba(244,63,94,0.3);">86'd / Out of Stock</span>`;

        const toggleBtnText = isAvailable ? 'Mark Sold Out' : 'Mark Available';

        // Dietary tags
        const tags = (Array.isArray(item.dietaryTags) && item.dietaryTags.length) ? item.dietaryTags : (item.tags || []);
        const tagsHtml = tags.map(t => `<span class="badge badge-subtle" style="font-size:0.65rem;">${this.escapeHtml(t)}</span>`).join(' ');

        // Dish labels
        const labels = Array.isArray(item.labels) && item.labels.length > 0 ? item.labels : (item.popular ? ['Popular'] : []);
        const labelsHtml = labels.map(lbl => `<span class="badge-dish-label" title="${this.escapeHtml(lbl)}">${this.escapeHtml(lbl)}</span>`).join('');

        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        // Order cell HTML
        const orderCellHtml = isViewOnly
          ? `<div class="order-cell-wrap"><span class="order-badge" title="Order #${item.sortOrder || (index + 1)}">#${item.sortOrder || (index + 1)}</span></div>`
          : `
            <div class="order-cell-wrap">
              <span class="drag-handle" title="Drag to reorder" aria-label="Drag handle for ${this.escapeHtml(item.name)}" tabindex="0">⠿</span>
              <span class="order-badge" title="Order #${item.sortOrder || (index + 1)}">${item.sortOrder || (index + 1)}</span>
              <div class="order-btn-group">
                <button type="button" class="btn-move-order btn-move-up" data-id="${item.id}" title="Move up" aria-label="Move ${this.escapeHtml(item.name)} up" ${isFirst ? 'disabled' : ''}>▲</button>
                <button type="button" class="btn-move-order btn-move-down" data-id="${item.id}" title="Move down" aria-label="Move ${this.escapeHtml(item.name)} down" ${isLast ? 'disabled' : ''}>▼</button>
              </div>
            </div>
          `;

        return `
          <tr class="dish-row" draggable="${!isViewOnly}" data-id="${item.id}" data-order="${item.sortOrder || (index + 1)}">
            <td>${orderCellHtml}</td>
            <td>
              <div class="dish-cell-info">
                <img src="${item.image}" alt="${this.escapeHtml(item.name)}" class="dish-thumb" loading="lazy">
                <div class="dish-cell-text">
                  <span class="dish-cell-name">${this.escapeHtml(item.name)}</span>
                  ${labelsHtml ? `<div class="dish-cell-labels">${labelsHtml}</div>` : ''}
                  <span class="dish-cell-sub">${this.escapeHtml(item.ingredients || item.description)}</span>
                </div>
              </div>
            </td>
            <td><span class="badge badge-subtle">${this.capitalize(item.category)}</span></td>
            <td><strong>${currency}${item.price.toFixed(2)}</strong></td>
            <td>${tagsHtml || '<span style="color:var(--text-muted); font-size:0.75rem;">—</span>'}</td>
            <td>
              <div style="display:flex; align-items:center; gap:var(--space-2);">
                ${statusBadge}
                <button type="button" class="btn btn-ghost btn-sm btn-toggle-availability" data-id="${item.id}" style="font-size:0.7rem; padding:0.2rem 0.5rem;" title="Click to toggle availability">
                  ${toggleBtnText}
                </button>
              </div>
            </td>
            <td style="text-align:right;">
              <button type="button" class="btn btn-line btn-sm btn-edit-item" data-id="${item.id}">
                Edit Dish
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    /* --------------------------------------------------------------------------
       4. Restaurant Profile Editor
       -------------------------------------------------------------------------- */
    setupProfileEditor() {
      // Discard buttons
      if (this.dom.btnDiscardProfile) {
        this.dom.btnDiscardProfile.addEventListener('click', () => {
          this.populateProfileForm();
          this.showToast('Profile edits discarded.', 'info');
        });
      }
      if (this.dom.btnProfileCancel) {
        this.dom.btnProfileCancel.addEventListener('click', () => {
          this.populateProfileForm();
          this.showToast('Profile edits discarded.', 'info');
        });
      }

      // Reset Demo from Profile tab
      if (this.dom.btnProfileResetDemo) {
        this.dom.btnProfileResetDemo.addEventListener('click', () => this.openResetModal());
      }

      // Form submission
      if (this.dom.profileForm) {
        this.dom.profileForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveProfile();
        });
      }
    }

    populateProfileForm() {
      const data = this.store.getRestaurant();
      const r = data.restaurant || {};
      const c = r.contact || {};

      if (this.dom.profName) this.dom.profName.value = r.name || '';
      if (this.dom.profTagline) this.dom.profTagline.value = r.tagline || '';
      if (this.dom.profEyebrow) this.dom.profEyebrow.value = r.eyebrow || '';
      if (this.dom.profCurrency) this.dom.profCurrency.value = r.currency || '$';
      if (this.dom.profDesc) this.dom.profDesc.value = r.description || '';
      if (this.dom.profAddress) this.dom.profAddress.value = c.address || '';
      if (this.dom.profPhone) this.dom.profPhone.value = c.phone || '';
      if (this.dom.profWhatsapp) this.dom.profWhatsapp.value = c.whatsapp || c.phone || '';
      if (this.dom.profEmail) this.dom.profEmail.value = c.email || '';
      if (this.dom.profDirections) this.dom.profDirections.value = c.directionsUrl || '';

      // Clear any validation errors
      this.dom.profileForm.querySelectorAll('.form-control').forEach(ctrl => ctrl.classList.remove('error'));
    }

    saveProfile() {
      let hasError = false;

      const name = this.dom.profName.value.trim();
      const address = this.dom.profAddress.value.trim();
      const phone = this.dom.profPhone.value.trim();
      const whatsapp = this.dom.profWhatsapp.value.trim();

      // Basic validation
      if (!name) {
        this.dom.profName.classList.add('error');
        hasError = true;
      } else {
        this.dom.profName.classList.remove('error');
      }

      if (!address) {
        this.dom.profAddress.classList.add('error');
        hasError = true;
      } else {
        this.dom.profAddress.classList.remove('error');
      }

      if (!phone) {
        this.dom.profPhone.classList.add('error');
        hasError = true;
      } else {
        this.dom.profPhone.classList.remove('error');
      }

      if (!whatsapp) {
        this.dom.profWhatsapp.classList.add('error');
        hasError = true;
      } else {
        this.dom.profWhatsapp.classList.remove('error');
      }

      if (hasError) {
        this.showToast('Please fill in all required fields.', 'error');
        return;
      }

      const updates = {
        name,
        tagline: this.dom.profTagline.value.trim(),
        eyebrow: this.dom.profEyebrow.value.trim(),
        currency: this.dom.profCurrency.value.trim() || '$',
        description: this.dom.profDesc.value.trim(),
        address,
        phone,
        whatsapp,
        email: this.dom.profEmail.value.trim(),
        directionsUrl: this.dom.profDirections.value.trim()
      };

      this.store.updateProfile(updates);
      this.refreshAll();
      this.showToast('Restaurant profile saved & synchronized to LUMÉ!');
    }

    /* --------------------------------------------------------------------------
       4b. Website Content Editor
       -------------------------------------------------------------------------- */
    setupWebsiteContentEditor() {
      // 1. Hero Form Submit
      if (this.dom.formContentHero) {
        this.dom.formContentHero.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveHeroSection();
        });
      }

      // 2. Menu Section Form Submit
      if (this.dom.formContentMenuSection) {
        this.dom.formContentMenuSection.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveMenuSectionContent();
        });
      }

      // 3. About Section Form Submit
      if (this.dom.formContentAbout) {
        this.dom.formContentAbout.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveAboutSection();
        });
      }

      // 4. About Statistics Form Submit
      if (this.dom.formContentAboutStats) {
        this.dom.formContentAboutStats.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveAboutStats();
        });
      }

      // Add Statistic Button Click
      if (this.dom.btnAddAboutStat) {
        this.dom.btnAddAboutStat.addEventListener('click', () => {
          this.handleAddAboutStat();
        });
      }

      // Remove Statistic Button Delegation
      if (this.dom.aboutStatsList) {
        this.dom.aboutStatsList.addEventListener('click', (e) => {
          const removeBtn = e.target.closest('.btn-remove-stat');
          if (removeBtn) {
            this.handleRemoveAboutStat(removeBtn);
          }
        });
      }

      // 5. Featured Dish Select Change
      if (this.dom.featuredDishSelect) {
        this.dom.featuredDishSelect.addEventListener('change', (e) => {
          const selectedId = e.target.value ? Number(e.target.value) : null;
          this.renderFeaturedDishPreview(selectedId);
          if (selectedId) {
            const dish = this.store.getMenuItem(selectedId);
            if (dish) {
              if (this.dom.featuredHeadingInput) {
                this.dom.featuredHeadingInput.value = dish.name || '';
              }
              if (this.dom.featuredDescInput) {
                this.dom.featuredDescInput.value = dish.description || '';
              }
            }
          }
        });
      }

      // Featured Dish Form Submit
      if (this.dom.formContentFeatured) {
        this.dom.formContentFeatured.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveFeaturedSection();
        });
      }

      // 6. Final CTA Form Submit
      if (this.dom.formContentFinalCta) {
        this.dom.formContentFinalCta.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveFinalCtaSection();
        });
      }
    }

    populateWebsiteContentForms() {
      const content = this.store.getWebsiteContent();
      const hero = content.hero || {};
      const menuSection = content.menuSection || {};
      const about = content.about || {};
      const aboutStats = content.aboutStats || [];
      const featured = content.featured || {};
      const finalCta = content.finalCta || {};

      // 1. Hero
      if (this.dom.heroEyebrowInput) this.dom.heroEyebrowInput.value = hero.eyebrow || '';
      if (this.dom.heroHeadingInput) this.dom.heroHeadingInput.value = hero.heading || '';
      if (this.dom.heroTaglineInput) this.dom.heroTaglineInput.value = hero.tagline || '';
      if (this.dom.heroDescInput) this.dom.heroDescInput.value = hero.description || '';
      if (this.dom.heroPrimaryEnabled) this.dom.heroPrimaryEnabled.checked = hero.primaryButtonEnabled !== false;
      if (this.dom.heroPrimaryTextInput) this.dom.heroPrimaryTextInput.value = hero.primaryButtonText || '';
      if (this.dom.heroPrimaryLinkInput) this.dom.heroPrimaryLinkInput.value = hero.primaryButtonLink || '';
      if (this.dom.heroSecondaryEnabled) this.dom.heroSecondaryEnabled.checked = hero.secondaryButtonEnabled !== false;
      if (this.dom.heroSecondaryTextInput) this.dom.heroSecondaryTextInput.value = hero.secondaryButtonText || '';
      if (this.dom.heroSecondaryLinkInput) this.dom.heroSecondaryLinkInput.value = hero.secondaryButtonLink || '';

      // 2. Menu Section
      if (this.dom.menuEyebrowInput) this.dom.menuEyebrowInput.value = menuSection.eyebrow || '';
      if (this.dom.menuHeadingInput) this.dom.menuHeadingInput.value = menuSection.heading || '';

      // 3. About Section
      if (this.dom.aboutEyebrowInput) this.dom.aboutEyebrowInput.value = about.eyebrow || '';
      if (this.dom.aboutHeadingInput) this.dom.aboutHeadingInput.value = about.heading || '';
      if (this.dom.aboutIntroInput) this.dom.aboutIntroInput.value = about.intro || '';
      if (this.dom.aboutDescInput) this.dom.aboutDescInput.value = about.description || '';

      // 4. About Stats
      this.renderAboutStatsList(aboutStats);

      // 5. Featured Dish
      this.populateFeaturedDishSelect(featured.menuItemId);
      this.renderFeaturedDishPreview(featured.menuItemId);
      if (this.dom.featuredEyebrowInput) this.dom.featuredEyebrowInput.value = featured.eyebrow || '';
      if (this.dom.featuredHeadingInput) this.dom.featuredHeadingInput.value = featured.heading || '';
      if (this.dom.featuredDescInput) this.dom.featuredDescInput.value = featured.description || '';
      if (this.dom.featuredButtonTextInput) this.dom.featuredButtonTextInput.value = featured.buttonText || '';
      if (this.dom.featuredButtonLinkInput) this.dom.featuredButtonLinkInput.value = featured.buttonLink || '';

      // 6. Final CTA
      if (this.dom.ctaEyebrowInput) this.dom.ctaEyebrowInput.value = finalCta.eyebrow || '';
      if (this.dom.ctaHeadingInput) this.dom.ctaHeadingInput.value = finalCta.heading || '';
      if (this.dom.ctaDescInput) this.dom.ctaDescInput.value = finalCta.description || '';
      if (this.dom.ctaButtonTextInput) this.dom.ctaButtonTextInput.value = finalCta.buttonText || '';
      if (this.dom.ctaButtonLinkInput) this.dom.ctaButtonLinkInput.value = finalCta.buttonLink || '';
    }

    populateFeaturedDishSelect(currentDishId) {
      if (!this.dom.featuredDishSelect) return;
      const menu = this.store.getMenuItems() || [];
      const restaurant = this.store.getRestaurant().restaurant || {};
      const currency = restaurant.currency || '$';

      const options = ['<option value="">-- None Selected --</option>'];
      menu.forEach(item => {
        const isSelected = Number(currentDishId) === Number(item.id) ? ' selected' : '';
        options.push(`<option value="${item.id}"${isSelected}>${this.escapeHtml(item.name)} (${currency}${Number(item.price).toFixed(2)})</option>`);
      });

      this.dom.featuredDishSelect.innerHTML = options.join('');
    }

    renderFeaturedDishPreview(dishId) {
      if (!this.dom.featuredDishPreviewWrap) return;

      const numId = dishId ? Number(dishId) : null;
      const dish = numId ? this.store.getMenuItem(numId) : null;

      if (!dish) {
        this.dom.featuredDishPreviewWrap.innerHTML = `
          <div style="font-size: var(--fs-xs); color: var(--text-muted); font-style: italic; padding: var(--space-2) 0;">
            No featured dish selected
          </div>
        `;
        return;
      }

      const restaurant = this.store.getRestaurant().restaurant || {};
      const currency = restaurant.currency || '$';
      const imgSrc = dish.image || '';

      this.dom.featuredDishPreviewWrap.innerHTML = `
        ${imgSrc ? `<img src="${this.escapeHtml(imgSrc)}" alt="${this.escapeHtml(dish.name)}" class="featured-dish-preview-thumb" onerror="this.style.display='none'">` : ''}
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 2px; flex-wrap: wrap;">
            <strong style="font-size: var(--fs-sm); color: var(--text-primary);">${this.escapeHtml(dish.name)}</strong>
            <span class="badge ${dish.available !== false ? 'badge-available' : 'badge-unavailable'}">
              ${dish.available !== false ? 'Available' : 'Unavailable'}
            </span>
            ${Array.isArray(dish.dietaryTags) && dish.dietaryTags.length > 0 ? dish.dietaryTags.map(t => `<span class="badge" style="background: rgba(200, 150, 62, 0.15); color: var(--accent-brass);">${this.escapeHtml(t)}</span>`).join('') : ''}
          </div>
          <div style="font-size: var(--fs-xs); color: var(--accent-brass); font-weight: 600; margin-bottom: 4px;">
            ${currency}${Number(dish.price).toFixed(2)}
          </div>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${this.escapeHtml(dish.description || '')}
          </p>
        </div>
      `;
    }

    renderAboutStatsList(stats) {
      if (!this.dom.aboutStatsList) return;

      if (!stats) {
        const content = this.store.getWebsiteContent();
        stats = content.aboutStats || [];
      }

      this.dom.aboutStatsList.innerHTML = '';

      if (stats.length === 0) {
        this.dom.aboutStatsList.innerHTML = `
          <div style="font-size: var(--fs-xs); color: var(--text-muted); font-style: italic; padding: var(--space-3); text-align: center; border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm);">
            No statistics configured. This section will be hidden on the live website.
          </div>
        `;
      } else {
        stats.forEach((st, idx) => {
          const row = document.createElement('div');
          row.className = 'stat-builder-row';
          row.setAttribute('data-stat-id', st.id || `stat-${idx + 1}`);
          row.innerHTML = `
            <div class="stat-builder-val">
              <input type="text" class="form-control stat-input-value" value="${this.escapeHtml(st.value)}" placeholder="e.g. 15+" aria-label="Statistic value">
            </div>
            <div class="stat-builder-label">
              <input type="text" class="form-control stat-input-label" value="${this.escapeHtml(st.label)}" placeholder="e.g. Years of Experience" aria-label="Statistic label">
            </div>
            <button type="button" class="btn btn-outline btn-sm btn-remove-stat" aria-label="Remove statistic" title="Remove statistic" style="padding: 6px 10px; color: var(--accent-rose); border-color: rgba(220,53,69,0.3);">✕</button>
          `;
          this.dom.aboutStatsList.appendChild(row);
        });
      }

      if (this.dom.statsCounterNotice) {
        this.dom.statsCounterNotice.textContent = `${stats.length} / 4 statistics configured`;
      }

      if (this.dom.btnAddAboutStat) {
        this.dom.btnAddAboutStat.disabled = stats.length >= 4;
      }
    }

    handleAddAboutStat() {
      if (!this.dom.aboutStatsList) return;
      const currentRows = this.dom.aboutStatsList.querySelectorAll('.stat-builder-row');
      if (currentRows.length >= 4) {
        this.showToast('Maximum of 4 statistics allowed.', 'info');
        return;
      }

      const stats = [];
      currentRows.forEach((row, idx) => {
        const valInput = row.querySelector('.stat-input-value');
        const labelInput = row.querySelector('.stat-input-label');
        const statId = row.getAttribute('data-stat-id') || `stat-${idx + 1}`;
        stats.push({
          id: statId,
          value: valInput ? valInput.value : '',
          label: labelInput ? labelInput.value : ''
        });
      });

      stats.push({
        id: `stat-${Date.now()}`,
        value: '',
        label: ''
      });

      this.renderAboutStatsList(stats);
      const newRow = this.dom.aboutStatsList.querySelector('.stat-builder-row:last-child .stat-input-value');
      if (newRow) newRow.focus();
    }

    handleRemoveAboutStat(btn) {
      const row = btn.closest('.stat-builder-row');
      if (!row || !this.dom.aboutStatsList) return;

      const remainingRows = Array.from(this.dom.aboutStatsList.querySelectorAll('.stat-builder-row')).filter(r => r !== row);
      const stats = remainingRows.map((r, idx) => {
        const valInput = r.querySelector('.stat-input-value');
        const labelInput = r.querySelector('.stat-input-label');
        return {
          id: r.getAttribute('data-stat-id') || `stat-${idx + 1}`,
          value: valInput ? valInput.value : '',
          label: labelInput ? labelInput.value : ''
        };
      });

      this.renderAboutStatsList(stats);
    }

    saveHeroSection() {
      const updates = {
        eyebrow: this.dom.heroEyebrowInput ? this.dom.heroEyebrowInput.value.trim() : '',
        heading: this.dom.heroHeadingInput ? this.dom.heroHeadingInput.value.trim() : '',
        tagline: this.dom.heroTaglineInput ? this.dom.heroTaglineInput.value.trim() : '',
        description: this.dom.heroDescInput ? this.dom.heroDescInput.value.trim() : '',
        primaryButtonEnabled: this.dom.heroPrimaryEnabled ? this.dom.heroPrimaryEnabled.checked : true,
        primaryButtonText: this.dom.heroPrimaryTextInput ? this.dom.heroPrimaryTextInput.value.trim() : '',
        primaryButtonLink: this.dom.heroPrimaryLinkInput ? this.dom.heroPrimaryLinkInput.value.trim() : '',
        secondaryButtonEnabled: this.dom.heroSecondaryEnabled ? this.dom.heroSecondaryEnabled.checked : true,
        secondaryButtonText: this.dom.heroSecondaryTextInput ? this.dom.heroSecondaryTextInput.value.trim() : '',
        secondaryButtonLink: this.dom.heroSecondaryLinkInput ? this.dom.heroSecondaryLinkInput.value.trim() : ''
      };

      this.store.updateWebsiteContentSection('hero', updates);
      this.showToast('Hero section updated successfully');
    }

    saveMenuSectionContent() {
      const updates = {
        eyebrow: this.dom.menuEyebrowInput ? this.dom.menuEyebrowInput.value.trim() : '',
        heading: this.dom.menuHeadingInput ? this.dom.menuHeadingInput.value.trim() : ''
      };

      this.store.updateWebsiteContentSection('menuSection', updates);
      this.showToast('Menu section updated successfully');
    }

    saveAboutSection() {
      const updates = {
        eyebrow: this.dom.aboutEyebrowInput ? this.dom.aboutEyebrowInput.value.trim() : '',
        heading: this.dom.aboutHeadingInput ? this.dom.aboutHeadingInput.value.trim() : '',
        intro: this.dom.aboutIntroInput ? this.dom.aboutIntroInput.value.trim() : '',
        description: this.dom.aboutDescInput ? this.dom.aboutDescInput.value.trim() : ''
      };

      this.store.updateWebsiteContentSection('about', updates);
      this.showToast('About section updated successfully');
    }

    saveAboutStats() {
      if (!this.dom.aboutStatsList) return;

      const rowEls = this.dom.aboutStatsList.querySelectorAll('.stat-builder-row');
      const stats = [];
      rowEls.forEach((row, idx) => {
        const valInput = row.querySelector('.stat-input-value');
        const labelInput = row.querySelector('.stat-input-label');
        const statId = row.getAttribute('data-stat-id') || `stat-${idx + 1}`;
        const value = valInput ? valInput.value.trim() : '';
        const label = labelInput ? labelInput.value.trim() : '';
        if (value || label) {
          stats.push({ id: statId, value, label });
        }
      });

      this.store.updateWebsiteContentSection('aboutStats', stats);
      this.showToast('About statistics updated successfully');
      this.renderAboutStatsList(stats);
    }

    saveFeaturedSection() {
      const rawId = this.dom.featuredDishSelect ? this.dom.featuredDishSelect.value : '';
      const menuItemId = rawId ? Number(rawId) : null;
      const updates = {
        menuItemId,
        eyebrow: this.dom.featuredEyebrowInput ? this.dom.featuredEyebrowInput.value.trim() : '',
        heading: this.dom.featuredHeadingInput ? this.dom.featuredHeadingInput.value.trim() : '',
        description: this.dom.featuredDescInput ? this.dom.featuredDescInput.value.trim() : '',
        buttonText: this.dom.featuredButtonTextInput ? this.dom.featuredButtonTextInput.value.trim() : '',
        buttonLink: this.dom.featuredButtonLinkInput ? this.dom.featuredButtonLinkInput.value.trim() : ''
      };

      this.store.updateWebsiteContentSection('featured', updates);
      this.showToast('Featured dish section updated successfully');
      this.renderFeaturedDishPreview(menuItemId);
    }

    saveFinalCtaSection() {
      const updates = {
        eyebrow: this.dom.ctaEyebrowInput ? this.dom.ctaEyebrowInput.value.trim() : '',
        heading: this.dom.ctaHeadingInput ? this.dom.ctaHeadingInput.value.trim() : '',
        description: this.dom.ctaDescInput ? this.dom.ctaDescInput.value.trim() : '',
        buttonText: this.dom.ctaButtonTextInput ? this.dom.ctaButtonTextInput.value.trim() : '',
        buttonLink: this.dom.ctaButtonLinkInput ? this.dom.ctaButtonLinkInput.value.trim() : ''
      };

      this.store.updateWebsiteContentSection('finalCta', updates);
      this.showToast('Call to action section updated successfully');
    }

    /* --------------------------------------------------------------------------
       5. Modals Controller
       -------------------------------------------------------------------------- */
    setupModals() {
      // Edit Item Modal Close Handlers
      if (this.dom.btnEditModalClose) {
        this.dom.btnEditModalClose.addEventListener('click', () => this.closeEditItemModal());
      }
      if (this.dom.btnEditModalCancel) {
        this.dom.btnEditModalCancel.addEventListener('click', () => this.closeEditItemModal());
      }
      if (this.dom.editModalScrim) {
        this.dom.editModalScrim.addEventListener('click', () => this.closeEditItemModal());
      }

      // Edit Item Form Submit
      if (this.dom.editItemForm) {
        this.dom.editItemForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveEditItem();
        });
      }

      // Photo Manager Controls (Placeholder)
      if (this.dom.btnChangePhoto) {
        this.dom.btnChangePhoto.addEventListener('click', () => {
          this.showToast('Coming Soon: This feature is currently under development and will be available in a future update.', 'info');
        });
      }

      // Tag & Label Picker Openers
      if (this.dom.btnAddDietaryTag) {
        this.dom.btnAddDietaryTag.addEventListener('click', () => {
          this.openTagPicker('dietary', this.dom.btnAddDietaryTag);
        });
      }
      if (this.dom.btnAddDishLabel) {
        this.dom.btnAddDishLabel.addEventListener('click', () => {
          this.openTagPicker('label', this.dom.btnAddDishLabel);
        });
      }

      // Assigned Tags & Labels Removal via Event Delegation
      if (this.dom.editItemDietaryTags) {
        this.dom.editItemDietaryTags.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn-remove-assigned-tag');
          if (!btn) return;
          const idx = Number(btn.getAttribute('data-tag-idx'));
          this.removeAssignedDietaryTag(idx);
        });
      }
      if (this.dom.editItemDishLabels) {
        this.dom.editItemDishLabels.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn-remove-assigned-tag');
          if (!btn) return;
          const idx = Number(btn.getAttribute('data-tag-idx'));
          this.removeAssignedDishLabel(idx);
        });
      }

      // Tag Picker Modal Controls
      if (this.dom.btnTagPickerClose) {
        this.dom.btnTagPickerClose.addEventListener('click', () => this.closeTagPicker());
      }
      if (this.dom.btnTagPickerCancel) {
        this.dom.btnTagPickerCancel.addEventListener('click', () => this.closeTagPicker());
      }
      if (this.dom.tagPickerScrim) {
        this.dom.tagPickerScrim.addEventListener('click', () => this.closeTagPicker());
      }
      if (this.dom.tagPickerSearchInput) {
        this.dom.tagPickerSearchInput.addEventListener('input', (e) => {
          this.tagPickerSearchQuery = e.target.value.trim();
          this.renderTagPickerList();
        });
        this.dom.tagPickerSearchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleTagPickerCreate();
          }
        });
      }
      if (this.dom.btnTagPickerCreate) {
        this.dom.btnTagPickerCreate.addEventListener('click', () => this.handleTagPickerCreate());
      }
      if (this.dom.tagPickerList) {
        this.dom.tagPickerList.addEventListener('click', (e) => {
          const itemBtn = e.target.closest('.tag-picker-item');
          if (itemBtn) {
            const tag = itemBtn.getAttribute('data-tag');
            this.handleSelectTagPickerItem(tag);
          }
        });
      }

      // Reset Modal Handlers
      if (this.dom.btnResetModalClose) {
        this.dom.btnResetModalClose.addEventListener('click', () => this.closeResetModal());
      }
      if (this.dom.btnResetModalCancel) {
        this.dom.btnResetModalCancel.addEventListener('click', () => this.closeResetModal());
      }
      if (this.dom.resetModalScrim) {
        this.dom.resetModalScrim.addEventListener('click', () => this.closeResetModal());
      }
      if (this.dom.btnResetModalConfirm) {
        this.dom.btnResetModalConfirm.addEventListener('click', () => this.confirmResetDemoData());
      }

      // Escape key to close open dialogs and mobile sidebar
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.dom.tagPickerModal && this.dom.tagPickerModal.classList.contains('is-open')) {
            this.closeTagPicker();
            return;
          }
          if (this.dom.sidebar && this.dom.sidebar.classList.contains('open')) {
            this.closeMobileSidebar();
            if (this.dom.sidebarToggleBtn) this.dom.sidebarToggleBtn.focus();
            return;
          }
          if (this.dom.editItemModal && this.dom.editItemModal.classList.contains('is-open')) {
            this.closeEditItemModal();
            return;
          }
          if (this.dom.resetModal && this.dom.resetModal.classList.contains('is-open')) {
            this.closeResetModal();
            return;
          }
        }
      });
    }


    /* --------------------------------------------------------------------------
       Assigned Dietary Tags & Dish Labels (In Edit Modal)
       -------------------------------------------------------------------------- */
    renderAssignedDietaryTags() {
      if (!this.dom.editItemDietaryTags) return;
      this.dom.editItemDietaryTags.innerHTML = this.currentEditingDietaryTags.map((tag, idx) => `
        <span class="assigned-tag-pill">
          <span class="assigned-tag-text">${this.escapeHtml(tag)}</span>
          <button type="button" class="btn-remove-assigned-tag" data-tag-type="dietary" data-tag-idx="${idx}" aria-label="Remove ${this.escapeHtml(tag)} tag">&times;</button>
        </span>
      `).join('');
    }

    removeAssignedDietaryTag(idx) {
      if (idx >= 0 && idx < this.currentEditingDietaryTags.length) {
        const removed = this.currentEditingDietaryTags.splice(idx, 1)[0];
        this.renderAssignedDietaryTags();
        this.showToast(`Removed tag "${removed}".`, 'info');
      }
    }

    renderAssignedDishLabels() {
      if (!this.dom.editItemDishLabels) return;
      this.dom.editItemDishLabels.innerHTML = this.currentEditingDishLabels.map((lbl, idx) => `
        <span class="assigned-tag-pill label-pill">
          <span class="assigned-tag-text">${this.escapeHtml(lbl)}</span>
          <button type="button" class="btn-remove-assigned-tag" data-tag-type="label" data-tag-idx="${idx}" aria-label="Remove ${this.escapeHtml(lbl)} label">&times;</button>
        </span>
      `).join('');
    }

    removeAssignedDishLabel(idx) {
      if (idx >= 0 && idx < this.currentEditingDishLabels.length) {
        const removed = this.currentEditingDishLabels.splice(idx, 1)[0];
        this.renderAssignedDishLabels();
        this.showToast(`Removed label "${removed}".`, 'info');
      }
    }

    /* --------------------------------------------------------------------------
       Reusable Searchable Tag & Label Picker Popup
       -------------------------------------------------------------------------- */
    openTagPicker(type, openerEl) {
      this.tagPickerType = type;
      this.tagPickerOpenerEl = openerEl || document.activeElement;
      this.tagPickerSearchQuery = '';

      if (this.dom.tagPickerTitle) {
        this.dom.tagPickerTitle.textContent = type === 'dietary' ? 'Add Dietary Tag' : 'Add Dish Label';
      }
      if (this.dom.tagPickerSearchInput) {
        this.dom.tagPickerSearchInput.value = '';
        this.dom.tagPickerSearchInput.placeholder = type === 'dietary' ? 'Search or type dietary tag...' : 'Search or type dish label...';
      }

      this.renderTagPickerList();

      if (this.dom.tagPickerScrim && this.dom.tagPickerModal) {
        this.dom.tagPickerScrim.classList.add('is-open');
        this.dom.tagPickerModal.classList.add('is-open');
        this.dom.tagPickerScrim.setAttribute('aria-hidden', 'false');
        this.dom.tagPickerModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
          if (this.dom.tagPickerSearchInput) this.dom.tagPickerSearchInput.focus();
        }, 100);
      }
    }

    closeTagPicker() {
      if (this.dom.tagPickerScrim && this.dom.tagPickerModal) {
        this.dom.tagPickerScrim.classList.remove('is-open');
        this.dom.tagPickerModal.classList.remove('is-open');
        this.dom.tagPickerScrim.setAttribute('aria-hidden', 'true');
        this.dom.tagPickerModal.setAttribute('aria-hidden', 'true');
      }
      if (this.tagPickerOpenerEl && typeof this.tagPickerOpenerEl.focus === 'function') {
        this.tagPickerOpenerEl.focus();
      }
    }

    renderTagPickerList() {
      if (!this.dom.tagPickerList) return;

      const isDietary = this.tagPickerType === 'dietary';
      const library = isDietary ? this.store.getDietaryTagLibrary() : this.store.getLabelLibrary();
      const assigned = isDietary ? this.currentEditingDietaryTags : this.currentEditingDishLabels;
      const query = (this.tagPickerSearchQuery || '').trim().toLowerCase();

      // Available items in library not already assigned to this dish
      const unassigned = library.filter(tag => !assigned.some(a => a.toLowerCase() === tag.toLowerCase()));
      const filtered = query
        ? unassigned.filter(tag => tag.toLowerCase().includes(query))
        : unassigned;

      if (filtered.length === 0) {
        this.dom.tagPickerList.innerHTML = `<div class="tag-picker-empty">${query ? 'No matching library tags.' : 'All tags are currently assigned.'}</div>`;
      } else {
        this.dom.tagPickerList.innerHTML = filtered.map(tag => `
          <button type="button" class="tag-picker-item" data-tag="${this.escapeHtml(tag)}">
            <span>${this.escapeHtml(tag)}</span>
            <span class="item-add-icon">+</span>
          </button>
        `).join('');
      }

      // Show "Create New" option if query is non-empty and not already assigned
      if (this.dom.tagPickerCreateWrap && this.dom.tagPickerCreateName) {
        const rawQuery = (this.tagPickerSearchQuery || '').trim();
        const alreadyAssigned = assigned.some(a => a.toLowerCase() === rawQuery.toLowerCase());

        if (rawQuery.length > 0 && !alreadyAssigned) {
          this.dom.tagPickerCreateWrap.style.display = 'block';
          this.dom.tagPickerCreateName.textContent = `"${rawQuery}"`;
        } else {
          this.dom.tagPickerCreateWrap.style.display = 'none';
        }
      }
    }

    handleSelectTagPickerItem(tag) {
      if (!tag) return;
      if (this.tagPickerType === 'dietary') {
        if (!this.currentEditingDietaryTags.some(t => t.toLowerCase() === tag.toLowerCase())) {
          this.currentEditingDietaryTags.push(tag);
          this.renderAssignedDietaryTags();
        }
      } else {
        if (!this.currentEditingDishLabels.some(l => l.toLowerCase() === tag.toLowerCase())) {
          this.currentEditingDishLabels.push(tag);
          this.renderAssignedDishLabels();
        }
      }
      this.closeTagPicker();
    }

    handleTagPickerCreate() {
      const rawQuery = (this.tagPickerSearchQuery || '').trim();
      if (!rawQuery) return;

      if (this.tagPickerType === 'dietary') {
        this.store.addDietaryTag(rawQuery);
        if (!this.currentEditingDietaryTags.some(t => t.toLowerCase() === rawQuery.toLowerCase())) {
          this.currentEditingDietaryTags.push(rawQuery);
          this.renderAssignedDietaryTags();
        }
        this.showToast(`Added dietary tag "${rawQuery}".`, 'info');
      } else {
        this.store.addLabel(rawQuery);
        if (!this.currentEditingDishLabels.some(l => l.toLowerCase() === rawQuery.toLowerCase())) {
          this.currentEditingDishLabels.push(rawQuery);
          this.renderAssignedDishLabels();
        }
        this.showToast(`Added dish label "${rawQuery}".`, 'info');
      }
      this.closeTagPicker();
    }

    openEditItemModal(itemId) {
      const item = this.store.getMenuItem(itemId);
      if (!item) return;

      this.lastFocusedEl = document.activeElement;
      this.currentEditingItemId = item.id;

      this.dom.editItemId.value = item.id;
      this.dom.editItemName.value = item.name;
      this.dom.editItemPrice.value = item.price;
      if (this.dom.editItemCategory) {
        this.dom.editItemCategory.value = item.category || 'starters';
      }
      this.dom.editItemDesc.value = item.description || '';
      this.dom.editItemIngredients.value = item.ingredients || '';
      this.dom.editItemAvailable.checked = item.available !== false;

      // Photo preview placeholder
      if (this.dom.editItemPhotoPreview) {
        this.dom.editItemPhotoPreview.src = item.image || '';
        this.dom.editItemPhotoPreview.alt = item.name;
      }

      // Populate dietary tags and dish labels
      this.currentEditingDietaryTags = [...(Array.isArray(item.dietaryTags) ? item.dietaryTags : (item.tags || []))];
      this.renderAssignedDietaryTags();

      this.currentEditingDishLabels = [...(Array.isArray(item.labels) ? item.labels : (item.popular ? ['Popular'] : []))];
      this.renderAssignedDishLabels();

      // Clear errors
      this.dom.editItemName.classList.remove('error');
      this.dom.editItemPrice.classList.remove('error');

      // Open modal
      this.dom.editModalScrim.classList.add('is-open');
      this.dom.editItemModal.classList.add('is-open');
      this.dom.editModalScrim.setAttribute('aria-hidden', 'false');
      this.dom.editItemModal.setAttribute('aria-hidden', 'false');

      setTimeout(() => this.dom.editItemPrice.focus(), 100);
    }

    closeEditItemModal() {
      this.dom.editModalScrim.classList.remove('is-open');
      this.dom.editItemModal.classList.remove('is-open');
      this.dom.editModalScrim.setAttribute('aria-hidden', 'true');
      this.dom.editItemModal.setAttribute('aria-hidden', 'true');

      if (this.lastFocusedEl) {
        this.lastFocusedEl.focus();
        this.lastFocusedEl = null;
      }
    }

    saveEditItem() {
      const id = Number(this.dom.editItemId.value);
      const name = this.dom.editItemName.value.trim();
      const price = parseFloat(this.dom.editItemPrice.value);
      const category = this.dom.editItemCategory ? this.dom.editItemCategory.value.trim().toLowerCase() : 'starters';
      const desc = this.dom.editItemDesc.value.trim();
      const ingredients = this.dom.editItemIngredients.value.trim();
      const available = this.dom.editItemAvailable.checked;

      let hasError = false;
      if (!name) {
        this.dom.editItemName.classList.add('error');
        hasError = true;
      } else {
        this.dom.editItemName.classList.remove('error');
      }

      if (isNaN(price) || price < 0) {
        this.dom.editItemPrice.classList.add('error');
        hasError = true;
      } else {
        this.dom.editItemPrice.classList.remove('error');
      }

      if (hasError) return;

      const originalItem = this.store.getMenuItem(id);
      const categoryChanged = originalItem && originalItem.category !== category;

      const updates = {
        name,
        price,
        category,
        dietaryTags: [...this.currentEditingDietaryTags],
        tags: [...this.currentEditingDietaryTags], // mirror for backwards compatibility
        labels: [...this.currentEditingDishLabels],
        popular: this.currentEditingDishLabels.some(l => l.toLowerCase() === 'popular'),
        description: desc,
        ingredients,
        available
      };

      // Preserve canonical dish image
      if (originalItem && originalItem.image) {
        updates.image = originalItem.image;
      }

      const updated = this.store.updateMenuItem(id, updates);

      this.closeEditItemModal();
      this.refreshAll();

      if (categoryChanged) {
        this.showToast(`Moved "${updated.name}" to ${this.capitalize(updated.category)} (Position #${updated.sortOrder}) & synced to LUMÉ!`);
      } else {
        this.showToast(`Updated "${updated.name}" (${this.capitalize(updated.category)}) & synced to LUMÉ!`);
      }
    }

    openResetModal() {
      this.lastFocusedEl = document.activeElement;
      this.dom.resetModalScrim.classList.add('is-open');
      this.dom.resetModal.classList.add('is-open');
      this.dom.resetModalScrim.setAttribute('aria-hidden', 'false');
      this.dom.resetModal.setAttribute('aria-hidden', 'false');

      setTimeout(() => this.dom.btnResetModalCancel.focus(), 100);
    }

    closeResetModal() {
      this.dom.resetModalScrim.classList.remove('is-open');
      this.dom.resetModal.classList.remove('is-open');
      this.dom.resetModalScrim.setAttribute('aria-hidden', 'true');
      this.dom.resetModal.setAttribute('aria-hidden', 'true');

      if (this.lastFocusedEl) {
        this.lastFocusedEl.focus();
        this.lastFocusedEl = null;
      }
    }

    confirmResetDemoData() {
      this.store.resetDemoData();
      this.closeResetModal();
      this.refreshAll();
      this.showToast('All demo data restored to original LUMÉ defaults.', 'success');
    }

    /* --------------------------------------------------------------------------
       6. Storage Synchronization & Refresh
       -------------------------------------------------------------------------- */
    setupStorageSync() {
      // Listen for cross-tab updates or internal store updates
      window.addEventListener('storage', (e) => {
        if (e.key === this.store.storageKey) {
          this.refreshAll();
        }
      });

      window.addEventListener('restoos:data-updated', () => {
        this.refreshAll();
      });
    }

    refreshAll() {
      this.renderOverview();
      this.renderMenuList();
      this.populateProfileForm();
      this.populateWebsiteContentForms();
    }

    /* --------------------------------------------------------------------------
       7. Utilities & Toast
       -------------------------------------------------------------------------- */
    escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showToast(message, type = 'success') {
      if (!this.dom.toast) return;

      this.dom.toast.className = `dash-toast ${type} show`;
      this.dom.toastMessage.textContent = message;

      if (this.dom.toastIcon) {
        if (type === 'success') this.dom.toastIcon.textContent = '✓';
        else if (type === 'error') this.dom.toastIcon.textContent = '✕';
        else this.dom.toastIcon.textContent = 'ℹ';
      }

      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.dom.toast.classList.remove('show');
      }, 3500);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.dashboardApp = new PartnerDashboardApp();
    });
  } else {
    window.dashboardApp = new PartnerDashboardApp();
  }
})();
