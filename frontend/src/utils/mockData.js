// Store/Company Details for Invoice Receipt
export const COMPANY_DETAILS = {
  name: "STYLE CLOTHING STORE",
  address: "Shop 12, Main Market, Indore, M.P.",
  phone: "+91 9876543210",
  gstin: "23AAAAA0000A1Z5",
  logoUrl: "https://via.placeholder.com/150?text=Store+Logo",
  terms: "1. Goods once sold cannot be refunded.\n2. Exchange within 7 days with valid bill."
};

// Two Types of Customers Sample Data
export const INITIAL_CUSTOMERS = [
  {
    id: 1,
    type: "REGULAR", // REGULAR vs OCCASIONAL
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul@gmail.com",
    address: "Vijay Nagar, Indore",
    default_discount: 10, // 10% Auto discount
    credit_limit: 10000, // Max Udhaar limit
    current_balance: 1800, // Current pending Udhaar
    purchase_history: [
      { invoice_no: "INV-1001", date: "2026-09-15", total: 1800, payment_mode: "CREDIT_UDHAAR" }
    ]
  },
  {
    id: 2,
    type: "OCCASIONAL",
    name: "Amit Verma",
    mobile: "9123456789",
    email: "",
    address: "Palasia, Indore",
    default_discount: 0,
    credit_limit: 0,
    current_balance: 0,
    purchase_history: [
      { invoice_no: "INV-1002", date: "2026-10-01", total: 2520, payment_mode: "CASH" }
    ]
  }
];

// Product with Min/Max limits, SKU & Supplier tagging
export const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: 'Slim Fit Cotton Shirt',
    sku: 'SHI-BLU-MED-101',
    barcode: '8901234567891',
    category: 'Casual Shirts',
    size: 'M',
    color: 'Blue',
    selling_price: 1200,
    cost_price: 700,
    total_stock: 12,
    sold_qty: 4,
    min_sale_limit: 1,
    max_sale_limit: 5,
  },
  {
    id: 102,
    name: 'Regular Denim Jeans',
    sku: 'JEA-DAR-320-102',
    barcode: '8901234567892',
    category: 'Jeans',
    size: '32',
    color: 'Dark Blue',
    selling_price: 1800,
    cost_price: 1100,
    total_stock: 8,
    sold_qty: 2,
    min_sale_limit: 1,
    max_sale_limit: 3,
  },
  {
    id: 103,
    name: 'Classic White Formal Shirt',
    sku: 'SHI-WHI-LRG-103',
    barcode: '8901234567893',
    category: 'Formal Shirts',
    size: 'L',
    color: 'White',
    selling_price: 1499,
    cost_price: 850,
    total_stock: 15,
    sold_qty: 6,
    min_sale_limit: 1,
    max_sale_limit: 10,
  },
  {
    id: 104,
    name: 'Graphic Print Crewneck Tee',
    sku: 'TSH-BLK-MED-104',
    barcode: '8901234567894',
    category: 'T-Shirts',
    size: 'M',
    color: 'Black',
    selling_price: 699,
    cost_price: 350,
    total_stock: 25,
    sold_qty: 12,
    min_sale_limit: 1,
    max_sale_limit: 10,
  },
  {
    id: 105,
    name: 'Slim Fit Formal Trousers',
    sku: 'TRO-GRY-320-105',
    barcode: '8901234567895',
    category: 'Trousers & Chinos',
    size: '32',
    color: 'Grey',
    selling_price: 1599,
    cost_price: 900,
    total_stock: 6,
    sold_qty: 3,
    min_sale_limit: 1,
    max_sale_limit: 5,
  },
  {
    id: 106,
    name: 'Puffer Winter Jacket',
    sku: 'JAC-NVY-LRG-106',
    barcode: '8901234567896',
    category: 'Jackets & Blazers',
    size: 'L',
    color: 'Navy Blue',
    selling_price: 2999,
    cost_price: 1800,
    total_stock: 4,
    sold_qty: 1,
    min_sale_limit: 1,
    max_sale_limit: 2,
  },
  {
    id: 107,
    name: 'Fleece Pullover Hoodie',
    sku: 'HOD-BLK-XL-107',
    barcode: '8901234567897',
    category: 'Hoodies & Sweatshirts',
    size: 'XL',
    color: 'Black',
    selling_price: 1899,
    cost_price: 1050,
    total_stock: 10,
    sold_qty: 5,
    min_sale_limit: 1,
    max_sale_limit: 4,
  },
  {
    id: 108,
    name: 'Festive Silk Kurta Set',
    sku: 'ETH-GLD-LRG-108',
    barcode: '8901234567898',
    category: 'Ethnic & Kurta',
    size: 'L',
    color: 'Gold',
    selling_price: 2499,
    cost_price: 1300,
    total_stock: 7,
    sold_qty: 2,
    min_sale_limit: 1,
    max_sale_limit: 3,
  },
];

// Suppliers & Purchase History Data
export const INITIAL_SUPPLIERS = [
  {
    id: 1,
    name: "Vardhman Textiles Ltd",
    contact_person: "Ramesh Kumar",
    phone: "9822011223",
    company: "Fabric Supplier",
    address: "Mill Area, Ahmedabad",
    purchase_history: [
      { id: "PO-501", date: "2026-08-10", item: "Cotton Shirts Stock", qty: 50, cost_price: 700, total_amount: 35000, status: "PAID" }
    ]
  },
  {
    id: 2,
    name: "Raymond Retail Wholesaler",
    contact_person: "Suresh Patel",
    phone: "9765432100",
    company: "Shirt & Jeans Distributor",
    address: "Textile Market, Surat",
    purchase_history: [
      { id: "PO-502", date: "2026-09-01", item: "Denim Jeans Stock", qty: 30, cost_price: 1100, total_amount: 33000, status: "PENDING" }
    ]
  }
];