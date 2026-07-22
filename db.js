/**
 * DB Data Layer Service
 * Supports Node.js Express REST API with automatic LocalStorage fallback
 */
const DB = (function () {
  const LOCAL_STORAGE_KEY = 'grocery_shop_db_v1';

  const defaultSeedData = {
    users: [
      { id: 1, username: 'admin', password: 'password123' }
    ],
    categories: [
      { id: 1, category_name: 'Rice', description: 'Basmati, Sona Masoori, Raw & Parboiled Rice' },
      { id: 2, category_name: 'Oil', description: 'Cooking Oil, Mustard Oil, Sunflower & Olive Oil' },
      { id: 3, category_name: 'Biscuits', description: 'Cookies, Cream Biscuits, Digestives & Crackers' },
      { id: 4, category_name: 'Beverages', description: 'Tea, Coffee, Fruit Juices & Soft Drinks' },
      { id: 5, category_name: 'Vegetables', description: 'Fresh Farm Produce, Onions, Potatoes & Greens' },
      { id: 6, category_name: 'Fruits', description: 'Fresh Apples, Bananas, Mangoes & Berries' },
      { id: 7, category_name: 'Dairy', description: 'Milk, Butter, Cheese, Curd & Paneer' },
      { id: 8, category_name: 'Snacks', description: 'Chips, Namkeen, Nuts & Chocolates' },
      { id: 9, category_name: 'Cleaning Products', description: 'Detergents, Dishwashers & Disinfectants' },
      { id: 10, category_name: 'Personal Care', description: 'Soaps, Shampoos, Toothpastes & Lotions' }
    ],
    suppliers: [
      { id: 1, name: 'Fresh Grain Co-op', phone: '+1 800-555-0199', email: 'orders@freshgrain.com', address: '12 Harvest Lane, Valley Farms' },
      { id: 2, name: 'SunGold Oils & Agro', phone: '+1 800-555-0244', email: 'sales@sungold.com', address: '45 Industrial Park, Sector 4' },
      { id: 3, name: 'DairyFresh Foods Ltd', phone: '+1 800-555-0812', email: 'supply@dairyfresh.com', address: '88 Milkway Blvd, Pasture City' },
      { id: 4, name: 'BakeWell FMCG', phone: '+1 800-555-0377', email: 'contact@bakewell.com', address: '102 Confectionery St, Sweetland' }
    ],
    products: [
      {
        id: 101,
        product_name: 'Royal Basmati Rice 5kg',
        category_id: 1,
        category_name: 'Rice',
        brand: 'Royal Agro',
        purchase_price: 12.50,
        selling_price: 16.99,
        quantity: 150,
        min_stock_level: 30,
        unit: 'Kg',
        supplier: 'Fresh Grain Co-op',
        expiry_date: '2027-12-31',
        barcode: '8901234567890',
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 102,
        product_name: 'Fortune Sunflower Oil 1L',
        category_id: 2,
        category_name: 'Oil',
        brand: 'Fortune',
        purchase_price: 3.20,
        selling_price: 4.50,
        quantity: 85,
        min_stock_level: 20,
        unit: 'Litre',
        supplier: 'SunGold Oils & Agro',
        expiry_date: '2027-06-30',
        barcode: '8901234567891',
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 103,
        product_name: 'Oreo Chocolate Biscuits 120g',
        category_id: 3,
        category_name: 'Biscuits',
        brand: 'Cadbury',
        purchase_price: 0.80,
        selling_price: 1.25,
        quantity: 200,
        min_stock_level: 40,
        unit: 'Packet',
        supplier: 'BakeWell FMCG',
        expiry_date: '2026-11-15',
        barcode: '8901234567892',
        image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 104,
        product_name: 'Tropicana Orange Juice 1L',
        category_id: 4,
        category_name: 'Beverages',
        brand: 'Tropicana',
        purchase_price: 2.10,
        selling_price: 2.99,
        quantity: 12,
        min_stock_level: 15,
        unit: 'Tetra Pack',
        supplier: 'BakeWell FMCG',
        expiry_date: '2026-08-28',
        barcode: '8901234567893',
        image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 105,
        product_name: 'Farm Fresh Organic Milk 1L',
        category_id: 7,
        category_name: 'Dairy',
        brand: 'DairyFresh',
        purchase_price: 1.10,
        selling_price: 1.65,
        quantity: 5,
        min_stock_level: 15,
        unit: 'Litre',
        supplier: 'DairyFresh Foods Ltd',
        expiry_date: '2026-07-26',
        barcode: '8901234567894',
        image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 106,
        product_name: 'Fresh Red Apples 1kg',
        category_id: 6,
        category_name: 'Fruits',
        brand: 'Washington Orchards',
        purchase_price: 2.50,
        selling_price: 3.99,
        quantity: 0,
        min_stock_level: 10,
        unit: 'Kg',
        supplier: 'Fresh Grain Co-op',
        expiry_date: '2026-08-05',
        barcode: '8901234567895',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 107,
        product_name: 'Lysol Surface Cleaner 500ml',
        category_id: 9,
        category_name: 'Cleaning Products',
        brand: 'Lysol',
        purchase_price: 3.50,
        selling_price: 4.99,
        quantity: 45,
        min_stock_level: 10,
        unit: 'Bottle',
        supplier: 'SunGold Oils & Agro',
        expiry_date: '2028-01-01',
        barcode: '8901234567896',
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      }
    ],
    sales: [
      {
        id: 1001,
        product_id: 101,
        product_name: 'Royal Basmati Rice 5kg',
        category_name: 'Rice',
        quantity_sold: 25,
        unit_price: 16.99,
        total_price: 424.75,
        date: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 1002,
        product_id: 102,
        product_name: 'Fortune Sunflower Oil 1L',
        category_name: 'Oil',
        quantity_sold: 15,
        unit_price: 4.50,
        total_price: 67.50,
        date: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ]
  };

  function getLocalStore() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSeedData));
        return defaultSeedData;
      }
      return JSON.parse(stored);
    } catch (e) {
      return defaultSeedData;
    }
  }

  function saveLocalStore(data) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to write LocalStorage", e);
    }
  }

  async function apiFetch(endpoint, options = {}) {
    try {
      const res = await fetch('/api' + endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`API Error: ${res.statusText}`);
    } catch (err) {
      // Fallback mode using LocalStorage
      return null;
    }
  }

  return {
    // Categories
    async getCategories() {
      const apiRes = await apiFetch('/categories');
      if (apiRes) return apiRes;
      return getLocalStore().categories;
    },

    async addCategory(catData) {
      const apiRes = await apiFetch('/categories', { method: 'POST', body: JSON.stringify(catData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const newCat = { id: Date.now(), ...catData };
      store.categories.push(newCat);
      saveLocalStore(store);
      return newCat;
    },

    async updateCategory(id, catData) {
      const apiRes = await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(catData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const index = store.categories.findIndex(c => c.id == id);
      if (index !== -1) {
        store.categories[index] = { ...store.categories[index], ...catData };
        saveLocalStore(store);
        return store.categories[index];
      }
      return null;
    },

    async deleteCategory(id) {
      const apiRes = await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      if (apiRes) return true;

      const store = getLocalStore();
      store.categories = store.categories.filter(c => c.id != id);
      saveLocalStore(store);
      return true;
    },

    // Products
    async getProducts() {
      const apiRes = await apiFetch('/products');
      if (apiRes) return apiRes;
      return getLocalStore().products;
    },

    async addProduct(pData) {
      const apiRes = await apiFetch('/products', { method: 'POST', body: JSON.stringify(pData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const category = store.categories.find(c => c.id == pData.category_id);
      const newProd = {
        id: Date.now(),
        product_name: pData.product_name,
        category_id: pData.category_id,
        category_name: category ? category.category_name : 'General',
        brand: pData.brand || 'Generic',
        purchase_price: parseFloat(pData.purchase_price) || 0,
        selling_price: parseFloat(pData.selling_price) || 0,
        quantity: parseFloat(pData.quantity) || 0,
        min_stock_level: parseFloat(pData.min_stock_level) || 10,
        unit: pData.unit || 'Piece',
        supplier: pData.supplier || 'N/A',
        expiry_date: pData.expiry_date || '',
        barcode: pData.barcode || String(Math.floor(100000000000 + Math.random() * 900000000000)),
        image_url: pData.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=60'
      };
      store.products.push(newProd);
      saveLocalStore(store);
      return newProd;
    },

    async updateProduct(id, pData) {
      const apiRes = await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(pData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const index = store.products.findIndex(p => p.id == id);
      if (index !== -1) {
        const updated = { ...store.products[index], ...pData };
        if (pData.category_id) {
          const cat = store.categories.find(c => c.id == pData.category_id);
          if (cat) updated.category_name = cat.category_name;
        }
        store.products[index] = updated;
        saveLocalStore(store);
        return updated;
      }
      return null;
    },

    async deleteProduct(id) {
      const apiRes = await apiFetch(`/products/${id}`, { method: 'DELETE' });
      if (apiRes) return true;

      const store = getLocalStore();
      store.products = store.products.filter(p => p.id != id);
      saveLocalStore(store);
      return true;
    },

    // Sales & Calculator
    async getSales() {
      const apiRes = await apiFetch('/sales');
      if (apiRes) return apiRes;
      return getLocalStore().sales;
    },

    async recordSale(saleData) {
      const apiRes = await apiFetch('/sales', { method: 'POST', body: JSON.stringify(saleData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const pIndex = store.products.findIndex(p => p.id == saleData.product_id);
      if (pIndex === -1) throw new Error('Product not found');

      const prod = store.products[pIndex];
      const qty = parseFloat(saleData.quantity_sold);
      if (prod.quantity < qty) throw new Error('Insufficient stock!');

      prod.quantity -= qty;
      const sale = {
        id: Date.now(),
        product_id: prod.id,
        product_name: prod.product_name,
        category_name: prod.category_name,
        quantity_sold: qty,
        unit_price: parseFloat(saleData.unit_price || prod.selling_price),
        total_price: qty * parseFloat(saleData.unit_price || prod.selling_price),
        date: new Date().toISOString()
      };

      store.sales.unshift(sale);
      saveLocalStore(store);
      return { success: true, sale, updated_product: prod };
    },

    // Suppliers
    async getSuppliers() {
      const apiRes = await apiFetch('/suppliers');
      if (apiRes) return apiRes;
      return getLocalStore().suppliers;
    },

    async addSupplier(supData) {
      const apiRes = await apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(supData) });
      if (apiRes) return apiRes;

      const store = getLocalStore();
      const newSup = { id: Date.now(), ...supData };
      store.suppliers.push(newSup);
      saveLocalStore(store);
      return newSup;
    },

    // Full Export & Restore
    getFullData() {
      return getLocalStore();
    },

    restoreFullData(data) {
      if (!data.products || !data.categories) throw new Error('Invalid Backup structure');
      saveLocalStore(data);
      return true;
    }
  };
})();
