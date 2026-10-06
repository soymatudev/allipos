// State & LocalStorage Management for Kermés POS

const STORAGE_KEYS = {
  PRODUCTS: 'kermes_products',
  SALES: 'kermes_sales'
};

// SVG default images generator for placeholder snacks if base64 isn't provided
function createDefaultSVG(emoji, bg = '#ffe3ad') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="30" fill="${bg}"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="100">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial seed data for standard school kermés items
const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Flan de Vainilla',
    price: 15.00,
    image: createDefaultSVG('🍮', '#ffd166')
  },
  {
    id: 'prod_2',
    name: 'Taco de Guisado',
    price: 25.00,
    image: createDefaultSVG('🌮', '#ff9f1c')
  },
  {
    id: 'prod_3',
    name: 'Agua Fresca',
    price: 12.00,
    image: createDefaultSVG('🥤', '#4ea8de')
  },
  {
    id: 'prod_4',
    name: 'Paleta de Hielo',
    price: 10.00,
    image: createDefaultSVG('🍧', '#ff4d6d')
  },
  {
    id: 'prod_5',
    name: 'Hot Dog',
    price: 20.00,
    image: createDefaultSVG('🌭', '#ffb703')
  },
  {
    id: 'prod_6',
    name: 'Refresco',
    price: 18.00,
    image: createDefaultSVG('🥤', '#e63946')
  }
];

export const Store = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify({
        totalSales: 0,
        history: []
      }));
    }
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
