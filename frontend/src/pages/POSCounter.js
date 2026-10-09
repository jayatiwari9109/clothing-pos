import React, { useState } from 'react';
import CustomerModal from '../components/CustomerModal';
import PrintableInvoice from '../components/PrintableInvoice';

const POSCounter = ({
  products = [],
  customers = [],
  onSaveCustomer,
  onUpdateProductStock,
}) => {
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH'); // CASH | UPI | CREDIT_UDHAAR
  
  // Modals visibility
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Selected Customer Object
  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(selectedCustomerId)
  ) || {
    name: 'Walk-in / Occasional Customer',
    mobile: 'N/A',
    type: 'OCCASIONAL',
    default_discount: 0,
    credit_limit: 0,
    current_balance: 0,
  };

  // Add Item to Cart by Product Object or Barcode / SKU match
  const addToCart = (product) => {
    // 1. Check Total Stock
    if (product.total_stock <= 0) {
      alert(`⚠️ Stock Alert: "${product.name}" ka stock khatam ho chuka hai!`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].qty;
      const newQty = currentQty + 1;

      // Check Max Sale Limit
      if (product.max_sale_limit && newQty > product.max_sale_limit) {
        alert(`⚠️ Sale Limit Alert: Aap "${product.name}" ki ek bill mein maximum ${product.max_sale_limit} units hi bech sakte hain!`);
        return;
      }

      // Check Stock Availability
      if (newQty > product.total_stock) {
        alert(`⚠️ Stock Limit: Available stock sirf ${product.total_stock} hai!`);
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingIndex].qty = newQty;
      setCart(updatedCart);
    } else {
      // Check Min Sale Limit
      const initialQty = product.min_sale_limit || 1;
      if (initialQty > product.total_stock) {
        alert(`⚠️ Stock Insufficient for minimum sale quantity of ${initialQty}`);
        return;
      }

      setCart([
        ...cart,
        {
          ...product,
          qty: initialQty,
        },
      ]);
    }
  };

  // Barcode / SKU Scan Handler
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matchedProduct = products.find(
      (p) =>
        p.barcode === barcodeInput.trim() ||
        p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matchedProduct) {
      addToCart(matchedProduct);
      setBarcodeInput('');
    } else {
      alert(`❌ Product nahi mila with Barcode/SKU: "${barcodeInput}"`);
    }
  };

  // Quantity Change in Cart
  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);

    if (targetProduct) {
      if (targetProduct.max_sale_limit && newQty > targetProduct.max_sale_limit) {
        alert(`⚠️ Limit Reached: Max sale limit per bill is ${targetProduct.max_sale_limit}`);
        return;
      }
      if (newQty > targetProduct.total_stock) {
        alert(`⚠️ Stock Limit: Available stock is ${targetProduct.total_stock}`);
        return;
      }
    }

    setCart(
      cart.map((item) => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Bill Calculations
  const subtotal = cart.reduce(
    (acc, item) => acc + item.selling_price * item.qty,
    0
  );

  // Auto-apply Regular Customer Discount %
  const customerDiscountPercent = selectedCustomer.default_discount || 0;
  const discountAmount = (subtotal * customerDiscountPercent) / 100;

  // Standard GST 12% calculation on net subtotal
  const taxableSubtotal = subtotal - discountAmount;
  const taxAmount = (taxableSubtotal * 0.12); // 12% GST
  const grandTotal = taxableSubtotal + taxAmount;

  // Final Checkout Execution
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('🛒 Cart khali hai! Kripya pehle products add karein.');
      return;
    }

    // Udhaar Limit Check for Regular Customers
    if (paymentMode === 'CREDIT_UDHAAR') {
      if (selectedCustomer.type !== 'REGULAR') {
        alert('⚠️ Udhaar facility sirf Regular Customers ke liye uplabdh hai!');
        return;
      }
      const newBalance = (selectedCustomer.current_balance || 0) + grandTotal;
      if (selectedCustomer.credit_limit > 0 && newBalance > selectedCustomer.credit_limit) {
        alert(`⚠️ Credit Limit Exceeded! Customer limit: ₹${selectedCustomer.credit_limit}, New Balance will be: ₹${newBalance}`);
        return;
      }
    }

    // Build Invoice Object
    const invoiceData = {
      invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: selectedCustomer,
      items: cart,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      payment_mode: paymentMode,
    };

    // Deduct stock from main inventory
    if (onUpdateProductStock) {
      cart.forEach((item) => {
        onUpdateProductStock(item.id, item.qty);
      });
    }

    // Open Printable Invoice Modal & Reset Cart
    setActiveInvoice(invoiceData);
    setCart([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f4f6f9', minHeight: '100vh' }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>🛍️ Billing & POS Counter (Level-2)</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* LEFT PANEL: Barcode Scan & Product Selection Grid */}
        <div style={{ flex: 2, minWidth: '320px' }}>
          
          {/* Barcode Search Bar */}
          <form onSubmit={handleBarcodeSubmit} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="🔍 Scan Barcode or Enter SKU (e.g. 890123456789)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '14px',
                border: '2px solid #007bff',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ padding: '10px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Scan / Add
            </button>
          </form>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {products.map((p) => {
              const isOutOfStock = p.total_stock <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && addToCart(p)}
                  style={{
                    background: isOutOfStock ? '#ffebee' : '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    opacity: isOutOfStock ? 0.6 : 1,
                    transition: 'transform 0.1s',
                  }}
                >
                  <strong style={{ fontSize: '13px', display: 'block', color: '#333' }}>{p.name}</strong>
                  <div style={{ fontSize: '11px', color: '#666', margin: '4px 0' }}>
                    SKU: {p.sku} | Size: {p.size}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '14px' }}>₹{p.selling_price}</span>
                    <span style={{ fontSize: '11px', background: isOutOfStock ? '#d32f2f' : '#e8f5e9', color: isOutOfStock ? '#fff' : '#2e7d32', padding: '2px 6px', borderRadius: '4px' }}>
                      Stock: {p.total_stock}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Customer Tagging & Cart Calculation */}
        <div style={{ flex: 1, minWidth: '300px', background: '#fff', padding: '18px', borderRadius: '8px', boxShadow: '0 3px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          
          {/* Customer Selection Section */}
          <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#444' }}>👤 Select Customer:</label>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(true)}
                style={{ background: '#28a745', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + New Customer
              </button>
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
            >
              <option value="">-- Walk-in / Occasional Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === 'REGULAR' ? `Regular - ${c.default_discount}% Off` : 'Occasional'})
                </option>
              ))}
            </select>

            {/* Selected Customer Info Badge */}
            {selectedCustomer.type === 'REGULAR' && (
              <div style={{ background: '#e3f2fd', padding: '8px', borderRadius: '4px', marginTop: '8px', fontSize: '11px', color: '#0d47a1' }}>
                ⭐ <strong>Regular Tier:</strong> {selectedCustomer.default_discount}% Auto-Discount applied! <br />
                💳 Credit Limit: ₹{selectedCustomer.credit_limit} | Due Udhaar: ₹{selectedCustomer.current_balance}
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>🛒 Cart Summary ({cart.length} items)</h4>
          
          <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '15px' }}>
            {cart.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', margin: '20px 0' }}>Cart is empty. Scan product barcode to add.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '8px 0', fontSize: '12px' }}>
                  <div style={{ flex: 2 }}>
                    <strong>{item.name}</strong>
                    <div style={{ color: '#666', fontSize: '10px' }}>₹{item.selling_price} x {item.qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={qtyBtnStyle}>-</button>
                    <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={qtyBtnStyle}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ ...qtyBtnStyle, background: '#ff4d4f', color: '#fff' }}>✕</button>
                  </div>
                  <div style={{ fontWeight: 'bold', width: '60px', textAlign: 'right' }}>
                    ₹{(item.selling_price * item.qty).toFixed(0)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculations Summary */}
          <div style={{ borderTop: '2px solid #333', paddingTop: '10px', fontSize: '13px' }}>
            <div style={calcRow}><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
            {discountAmount > 0 && (
              <div style={{ ...calcRow, color: '#27ae60' }}>
                <span>Regular Discount ({customerDiscountPercent}%):</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={calcRow}><span>GST (12%):</span><span>+ ₹{taxAmount.toFixed(2)}</span></div>
            <hr style={{ margin: '8px 0' }} />
            <div style={{ ...calcRow, fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>Payment Method:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['CASH', 'UPI', 'CREDIT_UDHAAR'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: paymentMode === mode ? '#007bff' : '#f8f9fa',
                    color: paymentMode === mode ? '#fff' : '#333',
                  }}
                >
                  {mode === 'CREDIT_UDHAAR' ? 'UDHAAR' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '12px',
              background: '#27ae60',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            💳 Complete Sale & Print Bill
          </button>
        </div>

      </div>

      {/* Customer Modal Popup */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSaveCustomer={onSaveCustomer}
      />

      {/* Invoice Receipt Popup */}
      {activeInvoice && (
        <PrintableInvoice
          invoiceData={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
};

// Styles
const calcRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '5px',
};

const qtyBtnStyle = {
  width: '22px',
  height: '22px',
  border: '1px solid #ccc',
  background: '#e9ecef',
  borderRadius: '3px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default POSCounter;