/**
 * ==============================================================================
 * RestoOS — Centralized Restaurant Data Store (Stage 2A)
 * ==============================================================================
 * Pure Vanilla JavaScript Data Layer
 *
 * Architecture Flow:
 *   Dashboard UI / LUMÉ Customer Site
 *              ↓
 *       RestaurantStore API
 *              ↓
 *      localStorage ('restoos.restaurant.lume')
 *              ↓
 *   (Future: Swappable with Plain PHP / MySQL REST API without UI rewrites)
 * ==============================================================================
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'restoos.restaurant.lume';

  /**
   * Canonical LUMÉ Default Dataset
   * Serves as the fallback and baseline template.
   */
  const DEFAULT_LUME_DATA = {
    restaurant: {
      id: 'lume',
      name: 'LUMÉ',
      tagline: 'Modern Mediterranean Dining',
      eyebrow: 'Beirut, Lebanon',
      currency: '$',
      description: 'Seasonal ingredients, open fire cooking, and a table that feels like home — reimagined for tonight.',
      contact: {
        address: 'Rue Gouraud, Gemmayzeh, Beirut',
        phone: '+961 1 234 567',
        phoneRaw: '+9611234567',
        whatsapp: '+961 1 234 567',
        whatsappUrl: 'https://wa.me/9611234567?text=Hello%20LUM%C3%89%2C%20I%20would%20like%20to%20reserve%20a%20table',
        directionsUrl: 'https://maps.google.com/?q=Rue+Gouraud,+Gemmayzeh,+Beirut',
        email: 'reservations@lume-restaurant.com',
        instagramUrl: 'https://instagram.com',
        facebookUrl: 'https://facebook.com'
      },
      hours: [
        { days: 'Monday – Thursday', time: '12:00 PM – 11:00 PM' },
        { days: 'Friday – Sunday', time: '12:00 PM – 12:00 AM' }
      ]
    },
    featuredDishId: 2,
    websiteContent: {
      hero: {
        eyebrow: 'Beirut, Lebanon',
        heading: 'LUMÉ',
        tagline: 'Modern Mediterranean Dining',
        description: 'Seasonal ingredients, open fire cooking, and a table that feels like home — reimagined for tonight.',
        primaryButtonEnabled: true,
        primaryButtonText: 'View Menu',
        primaryButtonLink: '#menu',
        secondaryButtonEnabled: true,
        secondaryButtonText: 'Reserve a Table',
        secondaryButtonLink: '#contact'
      },
      menuSection: {
        eyebrow: 'Our Menu',
        heading: 'Simple ingredients. Bold flavors.'
      },
      about: {
        eyebrow: 'About LUMÉ',
        heading: 'A table shaped by the Mediterranean',
        intro: 'LUMÉ brings together the warmth of Mediterranean hospitality and contemporary cuisine.',
        description: 'Founded by a small team of cooks who grew up between coastal kitchens and family tables, LUMÉ is built around fire, citrus, and patience. Every dish begins with what\'s in season and ends on a plate meant to be shared.'
      },
      aboutStats: [
        {
          id: 'experience',
          value: '15+',
          label: 'Years of Experience'
        },
        {
          id: 'dishes',
          value: '40+',
          label: 'Signature Dishes'
        }
      ],
      featured: {
        eyebrow: 'Chef\'s Choice',
        heading: 'Charcoal Grilled Sea Bass',
        description: 'Whole sea bass, slow-charred over an open flame and finished with lemon herb butter, served alongside vegetables pulled straight from the coals.',
        menuItemId: 2,
        buttonText: 'Discover the Dish',
        buttonLink: '#featured'
      },
      finalCta: {
        eyebrow: 'Reservations',
        heading: 'Good food deserves good company.',
        description: 'Join us for dinner.',
        buttonText: 'Back To Menu',
        buttonLink: '#menu'
      }
    },
    tagLibrary: {
      dietary: [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'Nut-Free',
        'Halal'
      ],
      labels: [
        'Popular',
        'Most Ordered',
        'Our Special',
        'Chef\'s Choice',
        'New',
        'Seasonal',
        'Recommended',
        'Signature',
        'Spicy'
      ]
    },
    categories: [
      { id: 'starters', label: 'Starters' },
      { id: 'mains',    label: 'Mains' },
      { id: 'pizza',    label: 'Pizza' },
      { id: 'desserts', label: 'Desserts' },
      { id: 'drinks',   label: 'Drinks' }
    ],
    menu: [
      {
        id: 1,
        category: 'starters',
        name: 'Burrata',
        description: 'Creamy burrata, heirloom tomatoes, basil oil',
        ingredients: 'Burrata, heirloom tomato, basil oil, sea salt, olive crostini',
        dietaryTags: ['Vegetarian'],
        tags: ['Vegetarian'],
        labels: ['Popular'],
        price: 12,
        image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=900&auto=format&fit=crop',
        popular: true,
        available: true,
        sortOrder: 1
      },
      {
        id: 2,
        category: 'mains',
        name: 'Grilled Sea Bass',
        description: 'Charred vegetables, lemon herb butter',
        ingredients: 'Whole sea bass, seasonal vegetables, lemon, herb butter',
        dietaryTags: ['Gluten-Free'],
        tags: ['Gluten-Free'],
        labels: [],
        price: 24,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 1
      },
      {
        id: 3,
        category: 'pizza',
        name: 'Truffle Pizza',
        description: 'Mozzarella, mushrooms, parmesan, truffle oil',
        ingredients: 'San Marzano base, mozzarella, wild mushrooms, parmesan, truffle oil',
        dietaryTags: ['Vegetarian'],
        tags: ['Vegetarian'],
        labels: ['Popular', 'Chef\'s Choice'],
        price: 19,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=900&auto=format&fit=crop',
        popular: true,
        available: true,
        sortOrder: 1
      },
      {
        id: 4,
        category: 'desserts',
        name: 'Pistachio Tiramisu',
        description: 'Classic tiramisu with pistachio cream',
        ingredients: 'Mascarpone, espresso, pistachio cream, ladyfingers, cocoa',
        dietaryTags: ['Vegetarian'],
        tags: ['Vegetarian'],
        labels: ['Our Special'],
        price: 10,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 1
      },
      {
        id: 5,
        category: 'starters',
        name: 'Grilled Octopus',
        description: 'Smoked paprika, fingerling potatoes, aioli',
        ingredients: 'Octopus, fingerling potato, smoked paprika, garlic aioli',
        dietaryTags: ['Gluten-Free'],
        tags: ['Gluten-Free'],
        labels: [],
        price: 16,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 2
      },
      {
        id: 6,
        category: 'mains',
        name: 'Lamb Kofta',
        description: 'Charred lamb, tahini, pickled onion, flatbread',
        ingredients: 'Lamb, tahini, sumac onion, herbs, flatbread',
        dietaryTags: ['Halal'],
        tags: ['Halal'],
        labels: ['Popular'],
        price: 22,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=900&auto=format&fit=crop',
        popular: true,
        available: true,
        sortOrder: 2
      },
      {
        id: 7,
        category: 'pizza',
        name: 'Margherita',
        description: 'San Marzano tomato, fior di latte, basil',
        ingredients: 'San Marzano tomato, fior di latte, fresh basil, olive oil',
        dietaryTags: ['Vegetarian'],
        tags: ['Vegetarian'],
        labels: [],
        price: 16,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 2
      },
      {
        id: 8,
        category: 'drinks',
        name: 'Citrus Spritz',
        description: 'Blood orange, rosemary, sparkling wine',
        ingredients: 'Blood orange, rosemary syrup, sparkling wine, soda',
        dietaryTags: [],
        tags: [],
        labels: ['Seasonal'],
        price: 13,
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 1
      },
      {
        id: 9,
        category: 'desserts',
        name: 'Orange Blossom Baklava',
        description: 'Walnuts, orange blossom syrup, pistachio dust',
        ingredients: 'Phyllo, walnut, orange blossom syrup, pistachio',
        dietaryTags: ['Vegetarian'],
        tags: ['Vegetarian'],
        labels: [],
        price: 9,
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=900&auto=format&fit=crop',
        popular: false,
        available: true,
        sortOrder: 2
      }
    ]
  };

  /**
   * Helper: Deep clone JSON-serializable objects
   */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Helper: Build clean WhatsApp URL from raw phone string and restaurant name
   */
  function formatWhatsAppUrl(phoneStr, restName) {
    const digitsOnly = (phoneStr || '').replace(/\D/g, '');
    const encodedName = encodeURIComponent(restName || 'Restaurant');
    return `https://wa.me/${digitsOnly}?text=Hello%20${encodedName}%2C%20I%20would%20like%20to%20reserve%20a%20table`;
  }

  class RestaurantStoreService {
    constructor() {
      this.storageKey = STORAGE_KEY;
    }

    /**
     * Retrieve complete restaurant dataset
     * Reads from localStorage; falls back to DEFAULT_LUME_DATA if empty or invalid.
     * @returns {Object} Restaurant dataset
     */
    getRestaurant() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.restaurant && Array.isArray(parsed.menu)) {
            let needsWrite = false;

            // Ensure tagLibrary exists
            if (!parsed.tagLibrary || !Array.isArray(parsed.tagLibrary.dietary) || !Array.isArray(parsed.tagLibrary.labels)) {
              parsed.tagLibrary = deepClone(DEFAULT_LUME_DATA.tagLibrary);
              needsWrite = true;
            }

            // Ensure websiteContent exists & normalize sections (Backward Compatibility)
            if (!parsed.websiteContent || typeof parsed.websiteContent !== 'object') {
              parsed.websiteContent = deepClone(DEFAULT_LUME_DATA.websiteContent);
              needsWrite = true;
            } else {
              const defContent = DEFAULT_LUME_DATA.websiteContent;
              const curContent = parsed.websiteContent;

              ['hero', 'menuSection', 'about', 'featured', 'finalCta'].forEach((sectionKey) => {
                if (!curContent[sectionKey] || typeof curContent[sectionKey] !== 'object') {
                  curContent[sectionKey] = deepClone(defContent[sectionKey]);
                  needsWrite = true;
                } else {
                  Object.keys(defContent[sectionKey]).forEach((propKey) => {
                    if (curContent[sectionKey][propKey] === undefined) {
                      curContent[sectionKey][propKey] = defContent[sectionKey][propKey];
                      needsWrite = true;
                    }
                  });
                }
              });

              if (!Array.isArray(curContent.aboutStats)) {
                curContent.aboutStats = deepClone(defContent.aboutStats);
                needsWrite = true;
              } else {
                curContent.aboutStats.forEach((stat, idx) => {
                  if (!stat.id) {
                    stat.id = `stat-${idx + 1}`;
                    needsWrite = true;
                  }
                  if (stat.value === undefined) {
                    stat.value = '';
                    needsWrite = true;
                  }
                  if (stat.label === undefined) {
                    stat.label = '';
                    needsWrite = true;
                  }
                });
              }
            }

            // Sync legacy root featuredDishId with websiteContent.featured.menuItemId
            if (parsed.websiteContent && parsed.websiteContent.featured) {
              if (parsed.websiteContent.featured.menuItemId === undefined || parsed.websiteContent.featured.menuItemId === null) {
                parsed.websiteContent.featured.menuItemId = parsed.featuredDishId || DEFAULT_LUME_DATA.websiteContent.featured.menuItemId;
                needsWrite = true;
              }
              parsed.featuredDishId = parsed.websiteContent.featured.menuItemId;
            }

            // Normalize menu items for dietaryTags, labels, and tags/popular mirrors
            parsed.menu.forEach((item) => {
              if (!Array.isArray(item.dietaryTags)) {
                item.dietaryTags = Array.isArray(item.tags) ? item.tags.slice() : [];
                needsWrite = true;
              }
              item.tags = item.dietaryTags; // mirror for LUMÉ backward compatibility

              if (!Array.isArray(item.labels)) {
                item.labels = item.popular ? ['Popular'] : [];
                needsWrite = true;
              }
              item.popular = item.labels.some(l => l.toLowerCase() === 'popular');
            });

            // Ensure category-specific sequential sortOrder (1..N within each category)
            const categories = parsed.categories || DEFAULT_LUME_DATA.categories;
            categories.forEach(cat => {
              const catItems = parsed.menu.filter(m => m.category === cat.id);
              catItems.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
              catItems.forEach((m, idx) => {
                if (m.sortOrder !== idx + 1) {
                  m.sortOrder = idx + 1;
                  needsWrite = true;
                }
              });
            });

            if (needsWrite) {
              this._writeToStorage(parsed, false);
            }
            return parsed;
          }
        }
      } catch (err) {
        console.warn('[RestaurantStore] Error reading localStorage, using defaults:', err);
      }

      // Initialize storage with defaults if not present
      const initial = this.getDefaultData();
      this._writeToStorage(initial, false);
      return initial;
    }

    /**
     * Return default canonical dataset (deep copy)
     */
    getDefaultData() {
      return deepClone(DEFAULT_LUME_DATA);
    }

    /**
     * Return list of supported dietary tags from library
     */
    getDietaryTagLibrary() {
      const data = this.getRestaurant();
      return (data.tagLibrary && data.tagLibrary.dietary) ? data.tagLibrary.dietary.slice() : [];
    }

    /**
     * Return list of supported dietary tags (legacy helper)
     */
    getAvailableDietaryTags() {
      return this.getDietaryTagLibrary();
    }

    /**
     * Add a new dietary tag to the restaurant's library
     * @param {string} tag 
     * @returns {boolean} true if added, false if duplicate or invalid
     */
    addDietaryTag(tag) {
      const cleanTag = String(tag || '').trim();
      if (!cleanTag) return false;
      const data = this.getRestaurant();
      data.tagLibrary = data.tagLibrary || { dietary: [], labels: [] };
      data.tagLibrary.dietary = data.tagLibrary.dietary || [];

      const exists = data.tagLibrary.dietary.some(t => t.toLowerCase() === cleanTag.toLowerCase());
      if (!exists) {
        data.tagLibrary.dietary.push(cleanTag);
        this._writeToStorage(data, true);
        return true;
      }
      return false;
    }

    /**
     * Return list of dish labels from library
     */
    getLabelLibrary() {
      const data = this.getRestaurant();
      return (data.tagLibrary && data.tagLibrary.labels) ? data.tagLibrary.labels.slice() : [];
    }

    /**
     * Add a new dish label to the restaurant's library
     * @param {string} label 
     * @returns {boolean} true if added, false if duplicate or invalid
     */
    addLabel(label) {
      const cleanLabel = String(label || '').trim();
      if (!cleanLabel) return false;
      const data = this.getRestaurant();
      data.tagLibrary = data.tagLibrary || { dietary: [], labels: [] };
      data.tagLibrary.labels = data.tagLibrary.labels || [];

      const exists = data.tagLibrary.labels.some(l => l.toLowerCase() === cleanLabel.toLowerCase());
      if (!exists) {
        data.tagLibrary.labels.push(cleanLabel);
        this._writeToStorage(data, true);
        return true;
      }
      return false;
    }

    /**
     * Internal writer to persist data and broadcast events
     */
    _writeToStorage(data, dispatchEvent = true) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        if (dispatchEvent && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('restoos:data-updated', {
            detail: data
          }));
        }
        return true;
      } catch (err) {
        console.error('[RestaurantStore] Failed to write to localStorage:', err);
        return false;
      }
    }

    /**
     * Save the entire restaurant dataset
     * @param {Object} data 
     */
    saveRestaurant(data) {
      if (!data || !data.restaurant || !Array.isArray(data.menu)) {
        throw new Error('Invalid restaurant dataset structure.');
      }
      return this._writeToStorage(data, true);
    }

    /**
     * Update restaurant profile fields
     * @param {Object} profileUpdates - Partial or full restaurant fields
     */
    updateProfile(profileUpdates) {
      const data = this.getRestaurant();
      
      // Update restaurant identity
      if (profileUpdates.name !== undefined) {
        const oldName = data.restaurant.name;
        const newName = String(profileUpdates.name).trim();
        data.restaurant.name = newName;
        if (data.websiteContent && data.websiteContent.hero && (data.websiteContent.hero.heading === oldName || !data.websiteContent.hero.heading)) {
          data.websiteContent.hero.heading = newName;
        }
      }
      if (profileUpdates.tagline !== undefined) {
        const oldTagline = data.restaurant.tagline;
        const newTagline = String(profileUpdates.tagline).trim();
        data.restaurant.tagline = newTagline;
        if (data.websiteContent && data.websiteContent.hero && (data.websiteContent.hero.tagline === oldTagline || !data.websiteContent.hero.tagline)) {
          data.websiteContent.hero.tagline = newTagline;
        }
      }
      if (profileUpdates.eyebrow !== undefined) {
        const oldEyebrow = data.restaurant.eyebrow;
        const newEyebrow = String(profileUpdates.eyebrow).trim();
        data.restaurant.eyebrow = newEyebrow;
        if (data.websiteContent && data.websiteContent.hero && (data.websiteContent.hero.eyebrow === oldEyebrow || !data.websiteContent.hero.eyebrow)) {
          data.websiteContent.hero.eyebrow = newEyebrow;
        }
      }
      if (profileUpdates.description !== undefined) {
        const oldDesc = data.restaurant.description;
        const newDesc = String(profileUpdates.description).trim();
        data.restaurant.description = newDesc;
        if (data.websiteContent && data.websiteContent.hero && (data.websiteContent.hero.description === oldDesc || !data.websiteContent.hero.description)) {
          data.websiteContent.hero.description = newDesc;
        }
      }
      if (profileUpdates.currency !== undefined) data.restaurant.currency = String(profileUpdates.currency).trim();

      // Ensure contact object exists
      data.restaurant.contact = data.restaurant.contact || {};

      if (profileUpdates.address !== undefined) data.restaurant.contact.address = String(profileUpdates.address).trim();
      if (profileUpdates.phone !== undefined) {
        const phone = String(profileUpdates.phone).trim();
        data.restaurant.contact.phone = phone;
        data.restaurant.contact.phoneRaw = phone.replace(/\D/g, '');
      }
      if (profileUpdates.whatsapp !== undefined) {
        const wa = String(profileUpdates.whatsapp).trim();
        data.restaurant.contact.whatsapp = wa;
        data.restaurant.contact.whatsappUrl = formatWhatsAppUrl(wa, data.restaurant.name);
      }
      if (profileUpdates.email !== undefined) data.restaurant.contact.email = String(profileUpdates.email).trim();
      if (profileUpdates.directionsUrl !== undefined) data.restaurant.contact.directionsUrl = String(profileUpdates.directionsUrl).trim();

      this._writeToStorage(data, true);
      return data;
    }

    /* --------------------------------------------------------------------------
       Website Content Configuration API
       -------------------------------------------------------------------------- */

    /**
     * Retrieve website content configuration
     * @returns {Object} Deep copy of websiteContent
     */
    getWebsiteContent() {
      const data = this.getRestaurant();
      return deepClone(data.websiteContent);
    }

    /**
     * Update website content configuration
     * Merges section updates into existing websiteContent and writes to storage.
     * Preserves profile, menu items, categories, tags, labels, and ordering.
     * @param {Object} updates - Partial or full websiteContent object
     * @returns {Object} Updated websiteContent
     */
    updateWebsiteContent(updates) {
      if (!updates || typeof updates !== 'object') {
        throw new Error('Invalid website content updates object.');
      }

      const data = this.getRestaurant();
      data.websiteContent = data.websiteContent || deepClone(DEFAULT_LUME_DATA.websiteContent);

      // Hero section
      if (updates.hero && typeof updates.hero === 'object') {
        data.websiteContent.hero = data.websiteContent.hero || {};
        if (updates.hero.eyebrow !== undefined) data.websiteContent.hero.eyebrow = String(updates.hero.eyebrow).trim();
        if (updates.hero.heading !== undefined) data.websiteContent.hero.heading = String(updates.hero.heading).trim();
        if (updates.hero.tagline !== undefined) data.websiteContent.hero.tagline = String(updates.hero.tagline).trim();
        if (updates.hero.description !== undefined) data.websiteContent.hero.description = String(updates.hero.description).trim();
        if (updates.hero.primaryButtonEnabled !== undefined) data.websiteContent.hero.primaryButtonEnabled = Boolean(updates.hero.primaryButtonEnabled);
        if (updates.hero.primaryButtonText !== undefined) data.websiteContent.hero.primaryButtonText = String(updates.hero.primaryButtonText).trim();
        if (updates.hero.primaryButtonLink !== undefined) data.websiteContent.hero.primaryButtonLink = String(updates.hero.primaryButtonLink).trim();
        if (updates.hero.secondaryButtonEnabled !== undefined) data.websiteContent.hero.secondaryButtonEnabled = Boolean(updates.hero.secondaryButtonEnabled);
        if (updates.hero.secondaryButtonText !== undefined) data.websiteContent.hero.secondaryButtonText = String(updates.hero.secondaryButtonText).trim();
        if (updates.hero.secondaryButtonLink !== undefined) data.websiteContent.hero.secondaryButtonLink = String(updates.hero.secondaryButtonLink).trim();
      }

      // Menu section
      if (updates.menuSection && typeof updates.menuSection === 'object') {
        data.websiteContent.menuSection = data.websiteContent.menuSection || {};
        if (updates.menuSection.eyebrow !== undefined) data.websiteContent.menuSection.eyebrow = String(updates.menuSection.eyebrow).trim();
        if (updates.menuSection.heading !== undefined) data.websiteContent.menuSection.heading = String(updates.menuSection.heading).trim();
      }

      // About section
      if (updates.about && typeof updates.about === 'object') {
        data.websiteContent.about = data.websiteContent.about || {};
        if (updates.about.eyebrow !== undefined) data.websiteContent.about.eyebrow = String(updates.about.eyebrow).trim();
        if (updates.about.heading !== undefined) data.websiteContent.about.heading = String(updates.about.heading).trim();
        if (updates.about.intro !== undefined) data.websiteContent.about.intro = String(updates.about.intro).trim();
        if (updates.about.description !== undefined) data.websiteContent.about.description = String(updates.about.description).trim();
      }

      // About stats
      if (Array.isArray(updates.aboutStats)) {
        data.websiteContent.aboutStats = updates.aboutStats.map((st, idx) => ({
          id: String(st.id || `stat-${idx + 1}`).trim(),
          value: String(st.value !== undefined ? st.value : '').trim(),
          label: String(st.label !== undefined ? st.label : '').trim()
        }));
      }

      // Featured section
      if (updates.featured && typeof updates.featured === 'object') {
        data.websiteContent.featured = data.websiteContent.featured || {};
        if (updates.featured.eyebrow !== undefined) data.websiteContent.featured.eyebrow = String(updates.featured.eyebrow).trim();
        if (updates.featured.heading !== undefined) data.websiteContent.featured.heading = String(updates.featured.heading).trim();
        if (updates.featured.description !== undefined) data.websiteContent.featured.description = String(updates.featured.description).trim();
        if (updates.featured.buttonText !== undefined) data.websiteContent.featured.buttonText = String(updates.featured.buttonText).trim();
        if (updates.featured.buttonLink !== undefined) data.websiteContent.featured.buttonLink = String(updates.featured.buttonLink).trim();
        if (updates.featured.menuItemId !== undefined) {
          const rawId = updates.featured.menuItemId;
          const parsedId = rawId === null ? null : Number(rawId);
          data.websiteContent.featured.menuItemId = parsedId;
          data.featuredDishId = parsedId;
        }
      }

      // Final CTA section
      if (updates.finalCta && typeof updates.finalCta === 'object') {
        data.websiteContent.finalCta = data.websiteContent.finalCta || {};
        if (updates.finalCta.eyebrow !== undefined) data.websiteContent.finalCta.eyebrow = String(updates.finalCta.eyebrow).trim();
        if (updates.finalCta.heading !== undefined) data.websiteContent.finalCta.heading = String(updates.finalCta.heading).trim();
        if (updates.finalCta.description !== undefined) data.websiteContent.finalCta.description = String(updates.finalCta.description).trim();
        if (updates.finalCta.buttonText !== undefined) data.websiteContent.finalCta.buttonText = String(updates.finalCta.buttonText).trim();
        if (updates.finalCta.buttonLink !== undefined) data.websiteContent.finalCta.buttonLink = String(updates.finalCta.buttonLink).trim();
      }

      this._writeToStorage(data, true);
      return deepClone(data.websiteContent);
    }

    /**
     * Update a single section of website content
     * @param {'hero'|'menuSection'|'about'|'aboutStats'|'featured'|'finalCta'} sectionName 
     * @param {Object|Array} values 
     * @returns {Object|Array} Updated section data
     */
    updateWebsiteContentSection(sectionName, values) {
      const validSections = ['hero', 'menuSection', 'about', 'aboutStats', 'featured', 'finalCta'];
      if (!validSections.includes(sectionName)) {
        throw new Error(`Unknown website content section: "${sectionName}". Must be one of: ${validSections.join(', ')}`);
      }
      const updated = this.updateWebsiteContent({ [sectionName]: values });
      return updated[sectionName];
    }

    /**
     * Reset only websiteContent to canonical LUMÉ defaults
     * Preserves restaurant profile, menu items, tags, categories, and sort order.
     * @returns {Object} Default websiteContent
     */
    resetWebsiteContent() {
      const data = this.getRestaurant();
      data.websiteContent = deepClone(DEFAULT_LUME_DATA.websiteContent);
      data.featuredDishId = DEFAULT_LUME_DATA.websiteContent.featured.menuItemId;
      this._writeToStorage(data, true);
      return deepClone(data.websiteContent);
    }

    /**
     * Retrieve the currently featured menu item
     * Resolves websiteContent.featured.menuItemId against the menu items list.
     * @returns {Object|null} Menu item object or null if not found
     */
    getFeaturedDish() {
      const data = this.getRestaurant();
      const id = (data.websiteContent && data.websiteContent.featured && data.websiteContent.featured.menuItemId) || data.featuredDishId;
      if (id === null || id === undefined) return null;
      return (data.menu || []).find(m => m.id === Number(id)) || null;
    }

    /**
     * Retrieve all menu items (sorted by category and sortOrder)
     * @returns {Array} Array of menu item objects
     */
    getMenuItems() {
      const data = this.getRestaurant();
      return (data.menu || []).slice().sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
    }

    /**
     * Retrieve single menu item by ID
     * @param {number|string} id 
     * @returns {Object|null}
     */
    getMenuItem(id) {
      const numericId = Number(id);
      const items = (this.getRestaurant().menu || []);
      return items.find(item => item.id === numericId) || null;
    }

    /**
     * Update an individual menu item
     * @param {number|string} id 
     * @param {Object} updates - Fields to update (name, price, available, category, dietaryTags, labels, sortOrder, image, description, ingredients)
     */
    updateMenuItem(id, updates) {
      const numericId = Number(id);
      const data = this.getRestaurant();
      const index = data.menu.findIndex(item => item.id === numericId);

      if (index === -1) {
        throw new Error(`Menu item with ID ${id} not found.`);
      }

      const item = data.menu[index];
      const oldCat = item.category;

      if (updates.name !== undefined) item.name = String(updates.name).trim();
      if (updates.description !== undefined) item.description = String(updates.description).trim();
      if (updates.ingredients !== undefined) item.ingredients = String(updates.ingredients).trim();
      if (updates.price !== undefined) {
        const p = parseFloat(updates.price);
        if (!isNaN(p) && p >= 0) item.price = p;
      }
      if (updates.available !== undefined) item.available = Boolean(updates.available);
      if (updates.image !== undefined) item.image = String(updates.image).trim();

      // Category Change handling
      if (updates.category !== undefined) {
        const newCat = String(updates.category).trim().toLowerCase();
        if (newCat !== oldCat) {
          item.category = newCat;
          // Assign new sortOrder at the end of destination category
          const destCatItems = data.menu.filter(m => m.id !== numericId && m.category === newCat);
          const maxOrder = destCatItems.reduce((max, m) => Math.max(max, m.sortOrder || 0), 0);
          item.sortOrder = maxOrder + 1;

          // Re-index remaining items in old category cleanly 1..N
          const oldCatItems = data.menu
            .filter(m => m.id !== numericId && m.category === oldCat)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          oldCatItems.forEach((m, i) => {
            m.sortOrder = i + 1;
          });
        }
      }

      // Dietary tags handling
      if (updates.dietaryTags !== undefined && Array.isArray(updates.dietaryTags)) {
        item.dietaryTags = updates.dietaryTags.map(t => String(t).trim()).filter(Boolean);
        item.tags = item.dietaryTags; // backward compatibility mirror
      } else if (updates.tags !== undefined && Array.isArray(updates.tags)) {
        item.dietaryTags = updates.tags.map(t => String(t).trim()).filter(Boolean);
        item.tags = item.dietaryTags;
      }

      // Labels handling
      if (updates.labels !== undefined && Array.isArray(updates.labels)) {
        item.labels = updates.labels.map(l => String(l).trim()).filter(Boolean);
        item.popular = item.labels.some(l => l.toLowerCase() === 'popular');
      }

      if (updates.sortOrder !== undefined) {
        const so = parseInt(updates.sortOrder, 10);
        if (!isNaN(so)) item.sortOrder = so;
      }

      data.menu[index] = item;
      this._writeToStorage(data, true);
      return item;
    }

    /**
     * Reorder menu items strictly within a specific category
     * @param {string} category - Category identifier (e.g. 'starters', 'mains')
     * @param {Array<number|string>} orderedIds - Array of item IDs in desired sequence
     * @returns {Array} Updated menu items
     */
    reorderCategoryItems(category, orderedIds) {
      if (!category || !Array.isArray(orderedIds)) {
        throw new Error('category and orderedIds array are required.');
      }
      const cat = String(category).trim().toLowerCase();
      const data = this.getRestaurant();
      const catItems = data.menu.filter(item => item.category === cat);

      const orderMap = new Map();
      orderedIds.forEach((id, idx) => {
        orderMap.set(Number(id), idx + 1);
      });

      catItems.forEach(item => {
        if (orderMap.has(item.id)) {
          item.sortOrder = orderMap.get(item.id);
        }
      });

      // Re-index cleanly 1..N within this category
      catItems.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      catItems.forEach((item, idx) => {
        item.sortOrder = idx + 1;
      });

      this._writeToStorage(data, true);
      return data.menu;
    }

    /**
     * Reorder menu items given an ordered array of IDs (global fallback)
     * @param {Array<number|string>} orderedIds - Array of item IDs in desired sequence
     * @returns {Array} Updated menu items
     */
    reorderMenuItems(orderedIds) {
      if (!Array.isArray(orderedIds)) {
        throw new Error('orderedIds must be an array of IDs.');
      }
      const data = this.getRestaurant();
      const orderMap = new Map();
      orderedIds.forEach((id, idx) => {
        orderMap.set(Number(id), idx + 1);
      });

      data.menu.forEach(item => {
        if (orderMap.has(item.id)) {
          item.sortOrder = orderMap.get(item.id);
        }
      });

      this._writeToStorage(data, true);
      return data.menu;
    }

    /**
     * Move a menu item up or down relative to items in its own category
     * @param {number|string} id 
     * @param {'up'|'down'} direction 
     */
    moveMenuItem(id, direction) {
      const numericId = Number(id);
      const data = this.getRestaurant();
      const item = data.menu.find(m => m.id === numericId);
      if (!item) throw new Error(`Item ${id} not found.`);

      const cat = item.category;
      const catItems = data.menu
        .filter(m => m.category === cat)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const idx = catItems.findIndex(m => m.id === numericId);
      if (idx === -1) return data.menu;

      if (direction === 'up' && idx > 0) {
        const temp = catItems[idx];
        catItems[idx] = catItems[idx - 1];
        catItems[idx - 1] = temp;
      } else if (direction === 'down' && idx < catItems.length - 1) {
        const temp = catItems[idx];
        catItems[idx] = catItems[idx + 1];
        catItems[idx + 1] = temp;
      } else {
        return data.menu; // Boundary reached
      }

      // Reassign sequential sortOrder 1..N within this category
      catItems.forEach((m, i) => {
        m.sortOrder = i + 1;
      });

      this._writeToStorage(data, true);
      return data.menu;
    }

    /**
     * Toggle availability status of a menu item
     * @param {number|string} id 
     * @param {boolean} [forcedState] Optional explicit boolean
     */
    toggleItemAvailability(id, forcedState) {
      const item = this.getMenuItem(id);
      if (!item) throw new Error(`Menu item ${id} not found.`);
      const newState = forcedState !== undefined ? Boolean(forcedState) : !item.available;
      return this.updateMenuItem(id, { available: newState });
    }

    /**
     * Reset data to canonical default LUMÉ dataset
     * Restores original state in localStorage and dispatches event.
     */
    resetDemoData() {
      const defaults = this.getDefaultData();
      this._writeToStorage(defaults, true);
      return defaults;
    }
  }

  // Export singleton instance to window
  const restaurantStore = new RestaurantStoreService();
  window.RestaurantStore = restaurantStore;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RestaurantStore: restaurantStore, RestaurantStoreService };
  }
})(typeof window !== 'undefined' ? window : global);
