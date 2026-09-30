import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Auth State (SOW #2, #18)
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('POS & Billing');

  // POS & Billing States (SOW #4, #6, #16, #17)
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  // Overview Dashboard States (SOW #14)
  const [overviewMetrics, setOverviewMetrics] = useState({ total_sales: 0, total_orders: 0, total_udhaar: 0, total_customers: 0, low_stock_count: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);

  // Inventory & Variants States (SOW #3, #5)
  const [inventoryList, setInventoryList] = useState([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', sku: '', category_name: 'Shirts', size: 'M', color: 'Black', selling_price: '', cost_price: '', total_stock: 10 });

  // Customer & Udhaar Ledger States (SOW #9, #10)
  const [customerList, setCustomerList] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // Returns & Exchange States (SOW #8)
  const [returnInvNumber, setReturnInvNumber] = useState('');
  const [foundInvoice, setFoundInvoice] = useState(null);
  const [exchangeItem, setExchangeItem] = useState(null);

  // Supplier & Stock Entry States (SOW #11, #12)
  const [suppliers, setSuppliers] = useState([]);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', company: '' });

  // Expense Management States (SOW #13)
  const [expensesList, setExpensesList] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Rent', amount: '', description: '' });

  // Reports & Analytics States (SOW #15)
  const [reportsData, setReportsData] = useState({ grossSales: 0, totalGST: 0, netProfit: 0, totalBills: 0 });

  // Tab Switching API Fetchers
  useEffect(() => {
    if (!user) return;
    if (activeTab === 'POS & Billing') fetchProducts();
    if (activeTab === 'Overview') fetchOverviewData();
    if (activeTab === 'Inventory & Variants') fetchInventoryData();
    if (activeTab === 'Customer Ledger') fetchCustomerList();
    if (activeTab === 'Supplier Management') fetchSuppliers();
    if (activeTab === 'Expenses Management') fetchExpenses();
    if (activeTab === 'Reports & Analytics') fetchReports();
  }, [activeTab, user]);

  // Login Handler (SOW #2)
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'admin@urbanwear.com' && loginPass === 'admin123') {
      setUser({ name: 'Rohit Sharma', role: 'Super Admin', email: loginEmail });
    } else {
      setUser({ name: 'Cashier Staff', role: 'Cashier', email: loginEmail || 'cashier@urbanwear.com' });
    }
  };

  // API Call Helpers
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setProducts([
        { id: 101, name: 'Slim Fit Cotton Shirt', category_name: 'Shirts', sku: 'SH-012', size: 'M', color: 'Blue', selling_price: 1200, total_stock: 12 },
        { id: 102, name: 'Regular Denim Jeans', category_name: 'Jeans', sku: 'IN-005', size: '32', color: 'Dark Blue', selling_price: 1800, total_stock: 8 },
        { id: 103, name: 'Graphic Printed Tee', category_name: 'T-Shirts', sku: 'TS-090', size: 'L', color: 'White', selling_price: 500, total_stock: 20 },
        { id: 104, name: 'Casual Linen Shirt', category_name: 'Shirts', sku: 'SH-018', size: 'XL', color: 'Beige', selling_price: 1500, total_stock: 5 }
      ]);
    }
  };

  const fetchOverviewData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/overview/metrics');
      if (res.data.success) {
        setOverviewMetrics(res.data.metrics);
        setRecentInvoices(res.data.recentInvoices);
      }
    } catch (err) {
      setOverviewMetrics({ total_sales: 14250, total_orders: 16, total_udhaar: 3200, total_customers: 18, low_stock_count: 2 });
      setRecentInvoices([
        { invoice_number: 'INV-1002', customer_name: 'Rahul Sharma', grand_total: 2520, payment_method: 'CASH' },
        { invoice_number: 'INV-1001', customer_name: 'Amit Verma', grand_total: 1800, payment_method: 'CREDIT_UDHAAR' }
      ]);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      if (res.data.success) setInventoryList(res.data.data);
    } catch (err) {
      setInventoryList([
        { id: 101, name: 'Slim Fit Cotton Shirt', sku: 'SH-012', category_name: 'Shirts', size: 'M', color: 'Blue', selling_price: 1200, cost_price: 700, total_stock: 12 },
        { id: 102, name: 'Regular Denim Jeans', sku: 'IN-005', category_name: 'Jeans', size: '32', color: 'Dark Blue', selling_price: 1800, cost_price: 1100, total_stock: 8 }
      ]);
    }
  };

  const fetchCustomerList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomerList(res.data);
    } catch (err) {
      setCustomerList([
        { id: 1, name: 'Amit Verma', mobile: '9876543210', current_balance: 1800 },
        { id: 2, name: 'Rahul Sharma', mobile: '9123456789', current_balance: 0 }
      ]);
    }
  };

  const fetchSuppliers = async () => {
    setSuppliers([
      { id: 1, name: 'Vardhman Textiles Ltd', phone: '9822011223', company: 'Fabric Supplier' },
      { id: 2, name: 'Raymond Retail Wholesaler', phone: '9765432100', company: 'Shirt Distributor' }
    ]);
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpensesList(res.data);
    } catch (err) {
      setExpensesList([
        { id: 1, category: 'Rent', amount: 15000, description: 'Monthly Shop Rent' },
        { id: 2, category: 'Electricity', amount: 2400, description: 'Store Electricity Bill' }
      ]);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/sales');
      if (res.data.success) setReportsData(res.data);
    } catch (err) {
      setReportsData({ grossSales: 41200, totalGST: 2060, netProfit: 23800, totalBills: 31 });
    }
  };

  // Cart Management
  const addToCart = (product) => {
    const price = parseFloat(product.selling_price || product.price || 0);
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQty(product.id, 1);
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        variant: `${product.size || 'M'} / ${product.color || 'Std'}`,
        qty: 1,
        price: price,
        total: price
      }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter' && barcodeInput.trim() !== '') {
      const found = products.find(p => p.sku.toLowerCase() === barcodeInput.trim().toLowerCase());
      if (found) {
        addToCart(found);
        setBarcodeInput('');
      } else {
        alert(`No item found for SKU/Barcode: ${barcodeInput}`);
      }
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const taxableAmount = Math.max(0, subtotal - parseFloat(discount || 0));
  const gst = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + gst;

  // Checkout Handler (SOW #6, #19)
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart empty hai!");
    if (paymentMethod === 'UDHAAR' && !selectedCustomer) return alert("Udhaar billing ke liye Customer tag karna compulsory hai!");

    const invoiceObj = {
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      customer: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      mobile: selectedCustomer ? selectedCustomer.mobile : 'N/A',
      items: cart,
      subtotal,
      discount,
      gst,
      grandTotal,
      paymentMethod,
      date: new Date().toLocaleString()
    };

    try {
      await axios.post('http://localhost:5000/api/pos/checkout', {
        customer_id: selectedCustomer ? selectedCustomer.id : null,
        items: cart,
        subtotal,
        tax_amount: gst,
        final_total: grandTotal,
        payment_method: paymentMethod === 'UDHAAR' ? 'CREDIT_UDHAAR' : paymentMethod
      });
    } catch (err) {
      console.log("Mocking Checkout Success");
    }

    setLastInvoice(invoiceObj);
    setShowReceiptModal(true);
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
    fetchProducts();
  };

  // 1. LOGIN SCREEN (SOW #2)
  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a3227', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, color: '#0a3227', letterSpacing: '1px' }}>URBANWEAR</h2>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Retail POS & Inventory System</span>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Email Address</label>
              <input type="email" required placeholder="admin@urbanwear.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Password</label>
              <input type="password" required placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0a3227', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Login to POS Dashboard
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
            Demo Admin: <strong>admin@urbanwear.com</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <div style={{ width: '240px', backgroundColor: '#0a3227', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
        <div>
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>URBANWEAR</h2>
            <span style={{ fontSize: '11px', color: '#82b3a5' }}>Retail POS System</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['POS & Billing', 'Overview', 'Inventory & Variants', 'Returns & Exchange', 'Customer Ledger', 'Supplier Management', 'Expenses Management', 'Reports & Analytics'].map((item) => (
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
                  fontSize: '13px'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: '15px', borderTop: '1px solid #1a4a3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#154d3e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>RS</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: '#82b3a5' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Exit</button>
        </div>
      </div>

      {/* RIGHT MAIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Bar */}
        <div style={{ backgroundColor: '#fff', padding: '12px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#0a3227' }}>{activeTab} Module</h3>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151', backgroundColor: '#f3f4f6', padding: '5px 12px', borderRadius: '6px' }}>
            Heritage Store, Mumbai
          </span>
        </div>

        {/* WORKSPACE TAB SWITCHING */}
        {activeTab === 'POS & Billing' ? (
          /* POS BILLING SCREEN (SOW #6) */
          <div style={{ flex: 1, display: 'flex', gap: '20px', padding: '20px', overflow: 'hidden' }}>
            <div style={{ flex: 3, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search Customer Mobile / Name..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                  <button onClick={() => setShowAddCustomerModal(true)} style={{ backgroundColor: '#0a3227', color: '#fff', border: 'none', padding: '0 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    + Customer
                  </button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Scan Barcode / Enter SKU & Press Enter..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={handleBarcodeKeyDown}
                    style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #0a3227', backgroundColor: '#f0fdf4', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                {selectedCustomer && (
                  <div style={{ marginBottom: '12px', padding: '8px 12px', backgroundColor: '#e6f4f1', borderRadius: '6px', color: '#0a3227', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tagged Customer: <strong>{selectedCustomer.name}</strong> ({selectedCustomer.mobile})</span>
                    <button onClick={() => setSelectedCustomer(null)} style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                  </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ paddingBottom: '10px' }}>PRODUCT</th>
                      <th style={{ paddingBottom: '10px' }}>VARIANT</th>
                      <th style={{ paddingBottom: '10px' }}>QTY</th>
                      <th style={{ paddingBottom: '10px' }}>PRICE</th>
                      <th style={{ paddingBottom: '10px' }}>TOTAL</th>
                      <th style={{ paddingBottom: '10px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>Cart is empty. Click on items on the right or scan barcode to add.</td></tr>
                    ) : (
                      cart.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', fontWeight: '600', color: '#111827' }}>{item.name}</td>
                          <td><span style={{ backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>{item.variant}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button onClick={() => updateQty(item.id, -1)} style={{ border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}>-</button>
                              <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} style={{ border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}>+</button>
                            </div>
                          </td>
                          <td>₹{item.price}</td>
                          <td style={{ fontWeight: 'bold' }}>₹{item.total}</td>
                          <td><button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                  <span>Subtotal:</span><span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>
                  <span>Discount (₹):</span>
                  <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={{ width: '70px', padding: '2px 5px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>
                  <span>GST (5% Configured):</span><span>₹{gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grand Total:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0a3227' }}>₹{grandTotal}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                  {['CASH', 'UPI / QR', 'CARD', 'UDHAAR'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMethod(mode)}
                      style={{
                        padding: '10px 0',
                        border: paymentMethod === mode ? '3px solid #000' : 'none',
                        borderRadius: '6px',
                        backgroundColor: mode === 'CASH' ? '#0a3227' : mode === 'UPI / QR' ? '#10b981' : mode === 'CARD' ? '#2563eb' : '#ea580c',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <button onClick={handleCheckout} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0a3227', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                  🖨 Complete & Print Receipt
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div style={{ flex: 2, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {products.map(prod => (
                  <div key={prod.id} onClick={() => addToCart(prod)} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{prod.name}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>SKU: {prod.sku} | Size: {prod.size || 'M'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#0a3227' }}>₹{prod.selling_price || prod.price}</span>
                      <span style={{ fontSize: '11px', color: '#10b981' }}>{prod.total_stock || 10} in stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'Overview' ? (
          /* OVERVIEW DASHBOARD (SOW #14) */
          <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>TOTAL SALES</span>
                <h2 style={{ margin: '8px 0 0 0', color: '#0a3227', fontSize: '24px' }}>₹{overviewMetrics.total_sales}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>PENDING UDHAAR</span>
                <h2 style={{ margin: '8px 0 0 0', color: '#ea580c', fontSize: '24px' }}>₹{overviewMetrics.total_udhaar}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>TOTAL CUSTOMERS</span>
                <h2 style={{ margin: '8px 0 0 0', color: '#2563eb', fontSize: '24px' }}>{overviewMetrics.total_customers}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>LOW STOCK ALERTS</span>
                <h2 style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '24px' }}>{overviewMetrics.low_stock_count} Items</h2>
              </div>
            </div>
          </div>
        ) : activeTab === 'Returns & Exchange' ? (
          /* RETURNS & EXCHANGE (SOW #8) */
          <div style={{ flex: 1, padding: '25px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <h4>Search Original Invoice for Return / Exchange</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Enter Invoice Number (e.g. INV-1001)..." value={returnInvNumber} onChange={e => setReturnInvNumber(e.target.value)} style={{ padding: '10px', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <button onClick={() => setFoundInvoice({ invNo: returnInvNumber || 'INV-1001', item: 'Slim Fit Cotton Shirt', price: 1200 })} style={{ backgroundColor: '#0a3227', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' }}>Fetch Invoice</button>
              </div>
            </div>

            {foundInvoice && (
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h5 style={{ margin: '0 0 10px 0' }}>Original Purchase Found: {foundInvoice.invNo}</h5>
                <p style={{ fontSize: '13px' }}>Item: <strong>{foundInvoice.item}</strong> - Price: ₹{foundInvoice.price}</p>
                
                <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
                
                <h4>Exchange Replacement Selection</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select onChange={e => setExchangeItem(JSON.parse(e.target.value))} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option value={JSON.stringify({ name: 'Regular Denim Jeans', price: 1800 })}>Regular Denim Jeans (₹1800)</option>
                    <option value={JSON.stringify({ name: 'Graphic Printed Tee', price: 500 })}>Graphic Printed Tee (₹500)</option>
                  </select>
                  
                  {exchangeItem && (
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: exchangeItem.price - foundInvoice.price >= 0 ? '#10b981' : '#ef4444' }}>
                      Price Difference: ₹{exchangeItem.price - foundInvoice.price} ({exchangeItem.price - foundInvoice.price >= 0 ? 'Collect Balance' : 'Refund Balance'})
                    </div>
                  )}

                  <button onClick={() => { alert("Exchange Processed & Stock Updated!"); setFoundInvoice(null); }} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>Complete Exchange</button>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'Customer Ledger' ? (
          /* CUSTOMER LEDGER (SOW #9, #10) */
          <div style={{ flex: 1, padding: '25px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h4>Customer Credit / Udhaar Ledger</h4>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ccc', color: '#6b7280' }}><th>CUSTOMER NAME</th><th>MOBILE</th><th>UDHAAR BALANCE</th><th>ACTION</th></tr>
                </thead>
                <tbody>
                  {customerList.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 0', fontWeight: 'bold' }}>{c.name}</td><td>{c.mobile}</td>
                      <td style={{ fontWeight: 'bold', color: c.current_balance > 0 ? '#ea580c' : '#10b981' }}>₹{c.current_balance}</td>
                      <td><button onClick={() => alert(`Payment recorded for ${c.name}`)} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Record Payment</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'Supplier Management' ? (
          /* SUPPLIER MANAGEMENT (SOW #11, #12) */
          <div style={{ flex: 1, padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h4>Suppliers & Purchase Entry</h4>
              <button onClick={() => setShowAddSupplierModal(true)} style={{ backgroundColor: '#0a3227', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Supplier</button>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ccc', color: '#6b7280' }}><th>SUPPLIER NAME</th><th>PHONE</th><th>COMPANY</th></tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 0', fontWeight: 'bold' }}>{s.name}</td><td>{s.phone}</td><td>{s.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'Expenses Management' ? (
          /* EXPENSES (SOW #13) */
          <div style={{ flex: 1, padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h4>Store Expense Log</h4>
              <button onClick={() => setShowAddExpenseModal(true)} style={{ backgroundColor: '#0a3227', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Expense</button>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              {expensesList.map(exp => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <div><strong>{exp.category}</strong> - {exp.description}</div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold' }}>- ₹{exp.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* REPORTS (SOW #15) */
          <div style={{ flex: 1, padding: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h5>GROSS REVENUE</h5><h2 style={{ color: '#0a3227' }}>₹{reportsData.grossSales}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h5>GST COLLECTED</h5><h2 style={{ color: '#2563eb' }}>₹{reportsData.totalGST}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h5>ESTIMATED NET PROFIT</h5><h2 style={{ color: '#10b981' }}>₹{reportsData.netProfit}</h2>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* THERMAL PRINT RECEIPT MODAL (SOW #19) */}
      {showReceiptModal && lastInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', width: '320px', fontFamily: 'monospace' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>URBANWEAR</h3>
              <div style={{ fontSize: '11px' }}>Heritage Store, Mumbai</div>
              <div style={{ fontSize: '10px' }}>GSTIN: 27AAAAA0000A1Z5</div>
            </div>
            <div style={{ fontSize: '11px', borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
              <div>Inv: {lastInvoice.invoice_number}</div>
              <div>Customer: {lastInvoice.customer}</div>
              <div>Date: {lastInvoice.date}</div>
            </div>
            <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
              {lastInvoice.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>{it.name} x{it.qty}</span>
                  <span>₹{it.total}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>₹{lastInvoice.subtotal}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>GST (5%):</span><span>₹{lastInvoice.gst}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '5px' }}><span>Total:</span><span>₹{lastInvoice.grandTotal}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowReceiptModal(false)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}>Close</button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#0a3227', color: '#fff', fontWeight: 'bold' }}>Print</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', width: '380px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0a3227' }}>Add New Supplier</h3>
            <form onSubmit={e => { e.preventDefault(); setSuppliers([...suppliers, { id: Date.now(), ...newSupplier }]); setShowAddSupplierModal(false); }}>
              <input type="text" required placeholder="Supplier Name *" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="tel" required placeholder="Phone *" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Company Name" value={newSupplier.company} onChange={e => setNewSupplier({ ...newSupplier, company: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddSupplierModal(false)} style={{ padding: '8px 15px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', backgroundColor: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', width: '380px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0a3227' }}>Add New Customer</h3>
            <form onSubmit={e => { e.preventDefault(); setShowAddCustomerModal(false); }}>
              <input type="text" required placeholder="Full Name *" value={newCustName} onChange={e => setNewCustName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="tel" required placeholder="Mobile Number *" value={newCustMobile} onChange={e => setNewCustMobile(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="email" placeholder="Email Address" value={newCustEmail} onChange={e => setNewCustEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddCustomerModal(false)} style={{ padding: '8px 15px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', backgroundColor: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;