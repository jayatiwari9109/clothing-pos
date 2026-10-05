import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamic API URL for local dev and production deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const POS = () => {
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState(0);

  // Customer Management States
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', mobile: '', email: '', address: '' });

  // Dynamic Customer Search
  useEffect(() => {
    const fetchCustomers = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/customers/search?query=${searchQuery}`);
          const data = res.data;
          setCustomers(Array.isArray(data) ? data : data.customers || []);
        } catch (err) {
          console.error("Error searching customers:", err);
          setCustomers([]);
        }
      } else {
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, [searchQuery]);

  // Barcode Scan Handler
  const handleBarcodeScan = async (e) => {
    if (e.key === 'Enter' && barcodeInput.trim() !== '') {
      e.preventDefault();
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/search?barcode=${barcodeInput.trim()}`);
        const product = res.data;

        if (product && (product.id || product._id)) {
          const productId = product.id || product._id;
          const existingIndex = cart.findIndex((item) => item.id === productId);

          if (existingIndex > -1) {
            const updatedCart = [...cart];
            const updatedQty = updatedCart[existingIndex].quantity + 1;
            updatedCart[existingIndex].quantity = updatedQty;
            updatedCart[existingIndex].total_price = updatedQty * updatedCart[existingIndex].unit_price;
            setCart(updatedCart);
          } else {
            const unitPrice = parseFloat(product.selling_price || product.price || 0);
            setCart([
              ...cart,
              {
                id: productId,
                name: product.name || 'Unknown Product',
                variant: product.variant || 'Standard',
                quantity: 1,
                unit_price: unitPrice,
                total_price: unitPrice
              }
            ]);
          }
          setBarcodeInput('');
        } else {
          alert('Product not found for barcode: ' + barcodeInput);
        }
      } catch (err) {
        alert('Error scanning product: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Cart Quantity Controls
  const updateQuantity = (index, delta) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[index].quantity + delta;

    if (newQty <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = newQty;
      updatedCart[index].total_price = newQty * updatedCart[index].unit_price;
    }
    setCart(updatedCart);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Create Quick Customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/customers`, newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCustomer(res.data.customer || res.data);
      setShowAddCustomerModal(false);
      setNewCustomer({ name: '', mobile: '', email: '', address: '' });
      alert('Customer added successfully!');
    } catch (err) {
      alert('Error adding customer: ' + (err.response?.data?.error || err.message));
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.total_price || 0), 0);
  const tax = subtotal * 0.05; // 5% GST
  const finalTotal = Math.max(0, subtotal + tax - parseFloat(discount || 0));

  // Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (paymentMethod === 'CREDIT_UDHAAR' && !selectedCustomer) {
      alert('Please select or add a customer for Udhaar (Credit) sale!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        customer_id: selectedCustomer ? selectedCustomer.id : null,
        items: cart,
        subtotal,
        discount_amount: parseFloat(discount || 0),
        tax_amount: tax,
        final_total: finalTotal,
        payment_method: paymentMethod
      };

      const res = await axios.post(`${API_BASE_URL}/api/pos/checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const invoiceNum = res.data?.invoice?.invoice_number || res.data?.invoice_number || 'N/A';
      alert(`Sale completed! Invoice No: ${invoiceNum}`);
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Left Area: Barcode & Cart Table */}
      <div style={{ flex: 2 }}>
        <h2>Barcode Scanner & Cart</h2>
        <input
          type="text"
          placeholder="Scan Barcode or enter SKU & press Enter..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={handleBarcodeScan}
          autoFocus
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '15px' }}
        />

        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th>Item</th>
              <th>Variant</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(cart) || cart.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cart is empty</td></tr>
            ) : (
              cart.map((item, index) => (
                <tr key={item.id || index}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.variant}</td>
                  <td>
                    <button onClick={() => updateQuantity(index, -1)} style={{ padding: '2px 6px', marginRight: '5px' }}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(index, 1)} style={{ padding: '2px 6px', marginLeft: '5px' }}>+</button>
                  </td>
                  <td>₹{item.unit_price}</td>
                  <td>₹{item.total_price}</td>
                  <td>
                    <button onClick={() => removeItem(index)} style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Right Area: Customer & Bill Summary */}
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h3>Customer Tagging</h3>
        {selectedCustomer ? (
          <div style={{ background: '#e6f7ff', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <strong>{selectedCustomer.name}</strong> ({selectedCustomer.mobile})
            <br />
            <small>Credit Balance: ₹{selectedCustomer.credit_balance || 0}</small>
            <button 
              onClick={() => setSelectedCustomer(null)} 
              style={{ display: 'block', marginTop: '5px', color: 'red', cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Search Customer by name/mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
            />
            {Array.isArray(customers) && customers.length > 0 && (
              <ul style={{ border: '1px solid #ddd', listStyle: 'none', padding: '5px', margin: 0, maxHeight: '100px', overflowY: 'auto' }}>
                {customers.map((c) => (
                  <li 
                    key={c.id || c._id} 
                    onClick={() => { setSelectedCustomer(c); setCustomers([]); setSearchQuery(''); }}
                    style={{ padding: '5px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  >
                    {c.name} ({c.mobile})
                  </li>
                ))}
              </ul>
            )}
            <button 
              onClick={() => setShowAddCustomerModal(true)} 
              style={{ marginTop: '5px', width: '100%', padding: '6px', cursor: 'pointer' }}
            >
              + Add New Customer
            </button>
          </div>
        )}

        <hr />

        <h3>Bill Summary</h3>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax (5% GST): ₹{tax.toFixed(2)}</p>
        <p>
          Discount: ₹
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{ width: '60px', marginLeft: '5px' }}
          />
        </p>
        <h2>Final Total: ₹{finalTotal.toFixed(2)}</h2>

        <div style={{ margin: '15px 0' }}>
          <label><strong>Payment Method:</strong></label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="CASH">Cash</option>
            <option value="UPI_CARD">UPI / Card</option>
            <option value="CREDIT_UDHAAR">Credit (Udhaar)</option>
          </select>
        </div>

        <button
          onClick={handleCheckout}
          style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
        >
          Complete Sale & Print Receipt
        </button>

        {/* Quick Add Customer Modal */}
        {showAddCustomerModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '300px' }}>
              <h4>Add New Customer</h4>
              <form onSubmit={handleCreateCustomer}>
                <input type="text" placeholder="Name" required value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                <input type="text" placeholder="Mobile" required value={newCustomer.mobile} onChange={(e) => setNewCustomer({...newCustomer, mobile: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                <input type="email" placeholder="Email (Optional)" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                <input type="text" placeholder="Address (Optional)" value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} style={{ width: '100%', marginBottom: '8px', padding: '6px' }} />
                <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '5px' }}>Save</button>
                <button type="button" onClick={() => setShowAddCustomerModal(false)} style={{ padding: '8px 15px', cursor: 'pointer' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;