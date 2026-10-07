import prod1 from '../assets/inventory/prod_001.jpeg';
import prod2 from '../assets/inventory/prod_002.jpeg';
import prod3 from '../assets/inventory/prod_003.jpeg';
import prod4 from '../assets/inventory/prod_004.jpeg';
import prod5 from '../assets/inventory/prod_005.jpeg';
import prod6 from '../assets/inventory/prod_006.jpeg';
import prod7 from '../assets/inventory/prod_007.jpeg';
import prod8 from '../assets/inventory/prod_008.jpeg';
import prod9 from '../assets/inventory/prod_009.jpeg';
import prod10 from '../assets/inventory/prod_010.jpeg';
import prod11 from '../assets/inventory/prod_011.jpeg';

const STORAGE_KEYS = {
  PRODUCTS: 'allipos_products',
  SALES: 'allipos_sales',
  CATALOG_VERSION: 'allipos_catalog_version'
};

// Incrementa esta versión en el código cada vez que modifiques INITIAL_PRODUCTS para auto-actualizar el LocalStorage
const CURRENT_CATALOG_VERSION = '2026.10.06.allipos_v1';

// SVG default images generator for placeholder snacks if base64 isn't provided
function createDefaultSVG(emoji, bg = '#ffe3ad') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="30" fill="${bg}"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="100">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial seed data for Allipos items
const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Gelatinas',
    price: 18.00,
    image: prod1
  },
  {
    id: 'prod_2',
    name: 'Gelatina de Refresco',
    price: 12.00,
    image: prod2
  },
  {
    id: 'prod_3',
    name: 'Aguas Frescas',
    price: 10.00,
    image: prod3
  },
  {
    id: 'prod_4',
    name: 'Gomitas Enchiladas',
    price: 15.00,
    image: prod4
  },
  {
    id: 'prod_5',
    name: 'Garapiñados',
    price: 10.00,
    image: prod5
  },
  /*{
    id: 'prod_6',
    name: 'Producto 6',
    price: 20.00,
    image: prod6
  },*/
  {
    id: 'prod_7',
    name: 'Chocoretas',
    price: 10.00,
    image: prod7
  },
  {
    id: 'prod_8',
    name: 'Manzanas',
    price: 35.00,
    image: prod8
  },
  {
    id: 'prod_9',
    name: 'Cakes Pops',
    price: 25.00,
    image: prod9
  },
  {
    id: 'prod_10',
    name: 'Carlota de Limon',
    price: 25.00,
    image: prod10
  },
  {
    id: 'prod_11',
    name: 'Flan',
    price: 25.00,
    image: prod11
  }
];

export const Store = {
  // Initialize storage if empty or if catalog version changed
  init() {
    const existing = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const savedVersion = localStorage.getItem(STORAGE_KEYS.CATALOG_VERSION);

    // Si no hay productos, o si aún tenía SVGs antiguos, o si la versión del código cambió:
    if (!existing || existing.includes('data:image/svg+xml') || savedVersion !== CURRENT_CATALOG_VERSION) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.CATALOG_VERSION, CURRENT_CATALOG_VERSION);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      const oldSales = localStorage.getItem('kermes_sales');
      localStorage.setItem(STORAGE_KEYS.SALES, oldSales || JSON.stringify({
        totalSales: 0,
        history: []
      }));
    }
  },

  // Restablecer catálogo forzadamente desde INITIAL_PRODUCTS
  resetToDefaultProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATALOG_VERSION, CURRENT_CATALOG_VERSION);
    return INITIAL_PRODUCTS;
  },

  // Products CRUD
  getProducts() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image || createDefaultSVG('🍿', '#e2afff')
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  updateProduct(id, updatedFields) {
    let products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name: updatedFields.name,
        price: parseFloat(updatedFields.price),
        image: updatedFields.image || products[index].image
      };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[index];
    }
    return null;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Sales CRUD
  getSales() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES)) || { totalSales: 0, history: [] };
    } catch (e) {
      return { totalSales: 0, history: [] };
    }
  },

  addSale(saleData) {
    const sales = this.getSales();
    const newSale = {
      id: `sale_${Date.now()}`,
      timestamp: new Date().toISOString(),
      productId: saleData.productId,
      productName: saleData.productName,
      quantity: saleData.quantity,
      totalPayable: parseFloat(saleData.totalPayable),
      amountPaid: parseFloat(saleData.amountPaid),
      changeReturned: parseFloat(saleData.changeReturned)
    };

    sales.history.unshift(newSale); // newest first
    sales.totalSales = parseFloat((sales.totalSales + newSale.totalPayable).toFixed(2));

    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    return newSale;
  },

  clearSales() {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify({
      totalSales: 0,
      history: []
    }));
  }
};
