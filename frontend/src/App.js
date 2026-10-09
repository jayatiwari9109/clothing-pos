import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Custom Modals, Utilities & Pages Import
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from './utils/mockData';
import CustomerModal from './components/CustomerModal';
import ProductAddModal from './components/ProductAddModal';
import PrintableInvoice from './components/PrintableInvoice';
import SupplierModal from './components/SupplierModal';
import Inventory from './pages/Inventory';
import CustomerLedger from './pages/CustomerLedger';
import SupplierManagement from './pages/SupplierManagement';
import Overview from './pages/Overview';
import ExpenseManagement from './pages/ExpenseManagement';
import Settings from './pages/Settings';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://clothing-pos-backend.vercel.app';

function App() {
  // Live Date, Day & Time State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic Store & Branding Configuration State
  const [storeConfig, setStoreConfig] = useState({
    storeName: 'URBANWEAR',
    subTitle: 'POS Billing System',
    currency: '₹',
    gstRate: 12,
    address: '123 Fashion Street, City Mall',
    phone: '+91 9876543210',
    logoUrl: '',
  });

  // Auth State
  const [user, setUser] = useState({ name: 'Rohit Sharma', role: 'Super Admin', email: 'admin@urbanwear.com' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('POS & Billing');

  // Master States
  const [products, setProducts] = useState(() => {
    return INITIAL_PRODUCTS.map((p) => ({
      ...p,
      sold_qty: p.sold_qty || 0,
      recent_added_stock: p.recent_added_stock || p.total_stock || 10,
      min_sale_limit: p.min_sale_limit || 1,
      max_sale_limit: p.max_sale_limit || 10,
    }));
  });

  const [customerList, setCustomerList] = useState(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);

  // Modals Visibility States
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // POS Billing Screen Local States
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Dashboard Metrics
  const [overviewMetrics, setOverviewMetrics] = useState({
    total_sales: 14250,
    total_orders: 16,
    total_udhaar: 3200,
    total_customers: 18,
    low_stock_count: 2,
  });

  const [recentInvoices, setRecentInvoices] = useState([
    { 
      invoice_number: 'INV-1002', 
      customer_name: 'Rahul Sharma', 
      grand_total: 2520, 
      payment_method: 'CASH', 
      date: new Date().toLocaleDateString(), 
      time: '02:15 PM' 
    },
    { 
      invoice_number: 'INV-1001', 
      customer_name: 'Amit Verma', 
      grand_total: 1800, 
      payment_method: 'CREDIT_UDHAAR', 
      date: new Date().toLocaleDateString(), 
      time: '11:40 AM' 
    },
  ]);

  // Tab Data Sync
  useEffect(() => {
    if (!user) return;
    if (activeTab === 'POS & Billing') fetchProducts();
    if (activeTab === 'Overview') fetchOverviewData();
    if (activeTab === 'Customer Ledger') fetchCustomerList();
  }, [activeTab, user]);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'admin@urbanwear.com' && loginPass === 'admin123') {
      setUser({ name: 'Rohit Sharma', role: 'Super Admin', email: loginEmail });
    } else {
      setUser({ name: 'Cashier Staff', role: 'Cashier', email: loginEmail || 'cashier@urbanwear.com' });
    }
  };

  // API Call Handlers
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      if (Array.isArray(res.data)) {
        setProducts(
          res.data.map((p) => ({
            ...p,
            sold_qty: p.sold_qty || 0,
            recent_added_stock: p.recent_added_stock || p.total_stock || 0,
            min_sale_limit: p.min_sale_limit || 1,
            max_sale_limit: p.max_sale_limit || 10,
          }))
        );
      }
    } catch (err) {
      console.warn('API Offline, using local state products');
    }
  };

  const fetchOverviewData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/overview/metrics`);
      if (res.data && res.data.metrics) {
        setOverviewMetrics(res.data.metrics);
        setRecentInvoices(res.data.recentInvoices || []);
      }
    } catch (err) {
      console.warn('API Offline, using default metrics');
    }
  };

  const fetchCustomerList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/customers`);
      if (Array.isArray(res.data)) setCustomerList(res.data);
    } catch (err) {
      console.warn('API Offline, using default customer list');
    }
  };

  // Actions & Updates
  const handleSaveCustomer = (newCustomer) => {
    const formatted = {
      ...newCustomer,
      created_at: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setCustomerList((prev) => [formatted, ...prev]);
    setSelectedCustomer(formatted);
    alert('Customer successfully added!');
  };

  const handleSaveProduct = (newProduct) => {
    const formattedProduct = {
      ...newProduct,
      sold_qty: 0,
      recent_added_stock: newProduct.total_stock,
      min_sale_limit: newProduct.min_sale_limit || 1,
      max_sale_limit: newProduct.max_sale_limit || 10,
      added_date: new Date().toLocaleDateString()
    };
    setProducts((prev) => [formattedProduct, ...prev]);
    alert('Product successfully added with unique Barcode/SKU!');
  };

  const handleSaveSupplier = (newSupplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleAddPurchaseLog = (supplierId, newLog) => {
    const formattedLog = {
      ...newLog,
      date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setSuppliers((prev) =>
      prev.map((s) => {
        if (String(s.id) === String(supplierId)) {
          return {
            ...s,
            purchase_history: [formattedLog, ...(s.purchase_history || [])],
          };
        }
        return s;
      })
    );
  };

  const updateProductStockAndSales = (productId, qtySold) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            total_stock: Math.max(0, p.total_stock - qtySold),
            sold_qty: (p.sold_qty || 0) + qtySold,
          };
        }
        return p;
      })
    );
  };

  const handleReceiveUdhaarPayment = (customerId, amount) => {
    setCustomerList((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const paymentLog = {
            id: `PAY-${Date.now().toString().slice(-4)}`,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount,
            type: 'UDHAAR_CLEARANCE'
          };
          return { 
            ...c, 
            current_balance: Math.max(0, (c.current_balance || 0) - amount),
            payment_history: [paymentLog, ...(c.payment_history || [])]
          };
        }
        return c;
      })
    );
  };

  // Cart Management
  const addToCart = (product) => {
    if (product.total_stock <= 0) return alert(`⚠️ "${product.name}" is Out of Stock!`);

    const existing = cart.find((item) => item.id === product.id);
    const minLimit = product.min_sale_limit || 1;
    const maxLimit = product.max_sale_limit || 10;

    if (existing) {
      const newQty = existing.qty + 1;
      if (newQty > maxLimit) {
        return alert(`⚠️ Sale Limit Alert: Max allowed quantity per bill is ${maxLimit}`);
      }
      if (newQty > product.total_stock) {
        return alert(`⚠️ Stock Alert: Only ${product.total_stock} units available!`);
      }
      updateQty(product.id, 1);
    } else {
      if (minLimit > product.total_stock) {
        return alert(`⚠️ Stock Alert: Insufficient stock for minimum sale limit of ${minLimit}`);
      }
      setCart([
        ...cart,
        {
          ...product,
          qty: minLimit,
          price: parseFloat(product.selling_price || 0),
          total: parseFloat(product.selling_price || 0) * minLimit,
        },
      ]);
    }
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return item;

          if (item.max_sale_limit && newQty > item.max_sale_limit) {
            alert(`⚠️ Max Sale Limit per bill is ${item.max_sale_limit}`);
            return item;
          }
          if (newQty > item.total_stock) {
            alert(`⚠️ Available Stock limit is ${item.total_stock}`);
            return item;
          }

          return { ...item, qty: newQty, total: newQty * item.price };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter' && barcodeInput.trim() !== '') {
      const found = products.find(
        (p) =>
          (p.barcode && p.barcode === barcodeInput.trim()) ||
          p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
      );
      if (found) {
        addToCart(found);
        setBarcodeInput('');
      } else {
        alert(`No product found with SKU/Barcode: "${barcodeInput}"`);
      }
    }
  };

  // Bill Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const custDiscountPercent = selectedCustomer ? selectedCustomer.default_discount || 0 : 0;
  const autoDiscountAmount = (subtotal * custDiscountPercent) / 100 + parseFloat(discount || 0);
  const taxableAmount = Math.max(0, subtotal - autoDiscountAmount);
  const gst = Math.round(taxableAmount * ((storeConfig.gstRate || 12) / 100));
  const grandTotal = taxableAmount + gst;

  // Checkout Execution
  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Cart empty hai!');

    if (paymentMethod === 'UDHAAR') {
      if (!selectedCustomer) return alert('Udhaar billing ke liye Customer tag karna zaroori hai!');
      if (selectedCustomer.type !== 'REGULAR') return alert('Udhaar facility sirf Regular Customers ke liye hai!');
      const newBal = (selectedCustomer.current_balance || 0) + grandTotal;
      if (selectedCustomer.credit_limit > 0 && newBal > selectedCustomer.credit_limit) {
        return alert(`Credit limit exceed ho rahi hai! Max Limit: ₹${selectedCustomer.credit_limit}`);
      }
    }

    const currentDateStr = new Date().toLocaleDateString();
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const invoiceObj = {
      invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: currentDateStr,
      time: currentTimeStr,
      customer: selectedCustomer || { name: 'Walk-in / Occasional Customer', mobile: 'N/A', current_balance: 0 },
      items: cart,
      subtotal,
      discount_amount: autoDiscountAmount,
      tax_amount: gst,
      grand_total: grandTotal,
      payment_mode: paymentMethod,
      storeConfig: storeConfig,
    };

    // Deduct stock & increment sold_qty
    cart.forEach((item) => updateProductStockAndSales(item.id, item.qty));

    setRecentInvoices((prev) => [
      {
        invoice_number: invoiceObj.invoice_number,
        customer_name: invoiceObj.customer.name,
        grand_total: grandTotal,
        payment_method: paymentMethod,
        date: currentDateStr,
        time: currentTimeStr,
      },
      ...prev,
    ]);

    setActiveInvoice(invoiceObj);
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
  };

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a3227', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {storeConfig.logoUrl && (
              <img src={storeConfig.logoUrl} alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
            )}
            <h2 style={{ margin: 0, color: '#0a3227', letterSpacing: '1px' }}>{storeConfig.storeName}</h2>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{storeConfig.subTitle}</span>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Email Address</label>
              <input type="email" required placeholder="admin@urbanwear.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Password</label>
              <input type="password" required placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0a3227', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Login to POS
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN APP WORKSPACE
  return (
    <div className="main-layout" style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <div className="sidebar-container" style={{ width: '240px', backgroundColor: '#0a3227', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
        <div>
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {storeConfig.logoUrl && (
              <img src={storeConfig.logoUrl} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain' }} />
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>{storeConfig.storeName}</h2>
              <span style={{ fontSize: '10px', color: '#82b3a5' }}>{storeConfig.subTitle}</span>
            </div>
          </div>

          <div className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'POS & Billing',
              'Overview',
              'Inventory & Stock Metrics',
              'Customer Ledger',
              'Supplier Management',
              'Expense Management',
              'Settings',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  textAlign: 'left',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === item ? '#154d3e' : 'transparent',
                  color: activeTab === item ? '#fff' : '#a2c7bc',
                  fontWeight: activeTab === item ? '600' : 'normal',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR FOOTER WITH LIVE CLOCK & DATE */}
        <div style={{ paddingTop: '15px', borderTop: '1px solid #1a4a3d' }}>
          
          <div style={{ marginBottom: '12px', background: '#07241c', padding: '8px 12px', borderRadius: '6px', border: '1px solid #134e3a' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
              🕒 {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
              📅 {currentDateTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: '#82b3a5' }}>{user.role}</div>
            </div>
            <button onClick={() => setUser(null)} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header Bar */}
        <div style={{ backgroundColor: '#fff', padding: '12px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#0a3227' }}>{activeTab}</h3>
            <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569', fontWeight: 'bold' }}>
              📅 {currentDateTime.toLocaleDateString()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowSupplierModal(true)} style={headerBtnStyle}>🏭 Suppliers</button>
            <button onClick={() => setShowAddCustomerModal(true)} style={headerBtnStyle}>👤 + Customer</button>
            <button onClick={() => setShowAddProductModal(true)} style={{ ...headerBtnStyle, background: '#0a3227', color: '#fff' }}>📦 + Product</button>
          </div>
        </div>

        {/* WORKSPACE TAB SWITCHING */}
        {activeTab === 'POS & Billing' ? (
          <div className="pos-container" style={{ flex: 1, display: 'flex', gap: '20px', padding: '20px', overflow: 'hidden' }}>
            
            {/* Left Billing Panel */}
            <div className="pos-cart-panel" style={{ flex: 3, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <select
                    value={selectedCustomer ? selectedCustomer.id : ''}
                    onChange={(e) => {
                      const found = customerList.find((c) => String(c.id) === e.target.value);
                      setSelectedCustomer(found || null);
                    }}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="">-- Walk-in / Occasional Customer --</option>
                    {customerList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type || 'OCCASIONAL'}{c.default_discount ? ` - ${c.default_discount}% Off` : ''})
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Scan Barcode / Enter SKU & Press Enter..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeKeyDown}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0a3227', backgroundColor: '#f0fdf4', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
                />

                {selectedCustomer && (
                  <div style={{ marginBottom: '12px', padding: '8px 12px', backgroundColor: '#e6f4f1', borderRadius: '6px', fontSize: '12px' }}>
                    Tagged: <strong>{selectedCustomer.name}</strong> | Type: {selectedCustomer.type || 'OCCASIONAL'}
                    {selectedCustomer.default_discount > 0 && ` (${selectedCustomer.default_discount}% Auto Discount)`}
                  </div>
                )}

                {/* Cart Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ paddingBottom: '8px' }}>ITEM</th>
                      <th style={{ paddingBottom: '8px' }}>SKU</th>
                      <th style={{ paddingBottom: '8px' }}>QTY</th>
                      <th style={{ paddingBottom: '8px' }}>PRICE</th>
                      <th style={{ paddingBottom: '8px' }}>TOTAL</th>
                      <th style={{ paddingBottom: '8px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>Cart is empty. Scan barcode or click item to add.</td></tr>
                    ) : (
                      cart.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{item.name}</td>
                          <td>{item.sku}</td>
                          <td>
                            <button onClick={() => updateQty(item.id, -1)} style={qtyBtnStyle}>-</button>
                            <span style={{ margin: '0 8px', fontWeight: 'bold' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} style={qtyBtnStyle}>+</button>
                          </td>
                          <td>{storeConfig.currency}{item.price}</td>
                          <td style={{ fontWeight: 'bold' }}>{storeConfig.currency}{item.total.toFixed(2)}</td>
                          <td><button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bill Calculations */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Subtotal:</span><span>{storeConfig.currency}{subtotal.toFixed(2)}</span>
                </div>
                {autoDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'green', marginBottom: '4px' }}>
                    <span>Discount:</span><span>- {storeConfig.currency}{autoDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
                  <span>GST ({storeConfig.gstRate}%):</span><span>+ {storeConfig.currency}{gst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                  <span>Grand Total:</span><span style={{ color: '#0a3227' }}>{storeConfig.currency}{grandTotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                  {['CASH', 'UPI', 'UDHAAR'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMethod(mode)}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: paymentMethod === mode ? '2px solid #000' : '1px solid #ccc',
                        background: paymentMethod === mode ? '#0a3227' : '#f8f9fa',
                        color: paymentMethod === mode ? '#fff' : '#333',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <button onClick={handleCheckout} style={{ width: '100%', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  💳 Complete Sale & Print Bill
                </button>
              </div>
            </div>

            {/* Right Product Grid */}
            <div className="pos-product-grid" style={{ flex: 2, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', overflowY: 'auto' }}>
              <div className="product-grid-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {products.map((p) => (
                  <div key={p.id} onClick={() => addToCart(p)} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>SKU: {p.sku} | Size: {p.size}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#28a745' }}>{storeConfig.currency}{p.selling_price}</span>
                      <span style={{ fontSize: '11px', color: p.total_stock <= 5 ? 'red' : 'green' }}>
                        Stock: {p.total_stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'Overview' ? (
          <Overview
            products={products}
            customers={customerList}
            recentInvoices={recentInvoices}
            overviewMetrics={overviewMetrics}
          />
        ) : activeTab === 'Inventory & Stock Metrics' ? (
          <Inventory
            products={products}
            suppliers={suppliers}
            onOpenAddProductModal={() => setShowAddProductModal(true)}
          />
        ) : activeTab === 'Customer Ledger' ? (
          <CustomerLedger
            customers={customerList}
            onReceivePayment={handleReceiveUdhaarPayment}
          />
        ) : activeTab === 'Supplier Management' ? (
          <SupplierManagement
            suppliers={suppliers}
            onOpenSupplierModal={() => setShowSupplierModal(true)}
          />
        ) : activeTab === 'Expense Management' ? (
          <ExpenseManagement />
        ) : activeTab === 'Settings' ? (
          <Settings
            storeConfig={storeConfig}
            onSaveConfig={(updated) => setStoreConfig(updated)}
          />
        ) : (
          <div style={{ padding: '30px' }}>Module View Under Development</div>
        )}

      </div>

      {/* MODALS */}
      <CustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSaveCustomer={handleSaveCustomer}
      />

      <ProductAddModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSaveProduct={handleSaveProduct}
        suppliers={suppliers}
      />

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSaveSupplier={handleSaveSupplier}
        onAddPurchaseLog={handleAddPurchaseLog}
        suppliers={suppliers}
      />

      {activeInvoice && (
        <PrintableInvoice
          invoiceData={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}

const headerBtnStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const qtyBtnStyle = {
  width: '22px',
  height: '22px',
  border: '1px solid #ccc',
  background: '#eee',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default App;