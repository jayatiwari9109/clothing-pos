import React, { useState } from 'react';

const SupplierModal = ({ isOpen, onClose, onSaveSupplier, onAddPurchaseLog, suppliers = [] }) => {
  const [activeTab, setActiveTab] = useState('ADD_SUPPLIER'); // 'ADD_SUPPLIER' | 'ADD_PURCHASE'
  const [selectedSupplierId, setSelectedSupplierId] = useState('');

  // Supplier Add Form State
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    company: '',
    phone: '',
    address: '',
  });

  // Purchase Log Form State
  const [purchaseForm, setPurchaseForm] = useState({
    item_name: '',
    qty: '',
    cost_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    payment_status: 'PAID', // PAID vs PENDING
  });

  if (!isOpen) return null;

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.phone) {
      alert('Kripya Supplier Name aur Phone Number zaroor bharein!');
      return;
    }

    const newSupplier = {
      id: Date.now(),
      name: supplierForm.name,
      company: supplierForm.company || 'Distributor',
      phone: supplierForm.phone,
      address: supplierForm.address || 'N/A',
      purchase_history: [],
    };

    onSaveSupplier(newSupplier);
    setSupplierForm({ name: '', company: '', phone: '', address: '' });
    alert('Supplier safaltapoorvak save ho gaya!');
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplierId || !purchaseForm.item_name || !purchaseForm.cost_price || !purchaseForm.qty) {
      alert('Kripya Supplier select karein aur Item, Qty, Cost Details bharein!');
      return;
    }

    const newLog = {
      id: `PO-${Math.floor(100 + Math.random() * 900)}`,
      date: purchaseForm.purchase_date,
      item: purchaseForm.item_name,
      qty: parseInt(purchaseForm.qty, 10),
      cost_price: parseFloat(purchaseForm.cost_price),
      total_amount: parseInt(purchaseForm.qty, 10) * parseFloat(purchaseForm.cost_price),
      status: purchaseForm.payment_status,
    };

    onAddPurchaseLog(selectedSupplierId, newLog);
    setPurchaseForm({
      item_name: '',
      qty: '',
      cost_price: '',
      purchase_date: new Date().toISOString().split('T')[0],
      payment_status: 'PAID',
    });
    alert('Purchase Log Entry Add Ho Gayi!');
  };

  const selectedSupplierObj = suppliers.find((s) => String(s.id) === String(selectedSupplierId));

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>🏭 Supplier & Purchase Management</h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ADD_SUPPLIER')}
            style={activeTab === 'ADD_SUPPLIER' ? activeTabStyle : tabStyle}
          >
            + Add New Supplier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ADD_PURCHASE')}
            style={activeTab === 'ADD_PURCHASE' ? activeTabStyle : tabStyle}
          >
            📦 Add Purchase Order / History
          </button>
        </div>

        {/* Tab 1: Add Supplier */}
        {activeTab === 'ADD_SUPPLIER' && (
          <form onSubmit={handleSupplierSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>Supplier / Wholesaler Name *</label>
              <input
                type="text"
                placeholder="e.g. Vardhman Fabrics"
                required
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Company / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Textiles Ltd"
                  value={supplierForm.company}
                  onChange={(e) => setSupplierForm({ ...supplierForm, company: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="text"
                  placeholder="10-digit Mobile"
                  required
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Address / Market Location</label>
              <input
                type="text"
                placeholder="e.g. Surat Textile Market"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                style={inputStyle}
              />
            </div>
            <button type="submit" style={saveButtonStyle}>Save Supplier Profile</button>
          </form>
        )}

        {/* Tab 2: Add Purchase Entry */}
        {activeTab === 'ADD_PURCHASE' && (
          <div>
            <form onSubmit={handlePurchaseSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.company})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 2 }}>
                  <label style={labelStyle}>Purchased Item / Stock Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cotton Shirts Batch #40"
                    required
                    value={purchaseForm.item_name}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, item_name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseForm.purchase_date}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, purchase_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Quantity Bought *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    required
                    value={purchaseForm.qty}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, qty: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Cost Price per Unit (₹) *</label>
                  <input
                    type="number"
                    placeholder="Cost Rate"
                    required
                    value={purchaseForm.cost_price}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, cost_price: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Payment Status</label>
                  <select
                    value={purchaseForm.payment_status}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_status: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{ ...saveButtonStyle, background: '#28a745' }}>+ Record Purchase Entry</button>
            </form>

            {/* Selected Supplier Purchase Logs History Table */}
            {selectedSupplierObj && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>
                  📜 Purchase History for: <strong>{selectedSupplierObj.name}</strong>
                </h4>
                {selectedSupplierObj.purchase_history && selectedSupplierObj.purchase_history.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                        <th style={thStyle}>PO ID</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Item</th>
                        <th style={thStyle}>Qty</th>
                        <th style={thStyle}>Cost/Unit</th>
                        <th style={thStyle}>Total Cost</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSupplierObj.purchase_history.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={tdStyle}>{log.id}</td>
                          <td style={tdStyle}>{log.date}</td>
                          <td style={{ ...tdStyle, textAlign: 'left' }}>{log.item}</td>
                          <td style={tdStyle}>{log.qty}</td>
                          <td style={tdStyle}>₹{log.cost_price}</td>
                          <td style={{ ...tdStyle, fontWeight: 'bold' }}>₹{log.total_amount}</td>
                          <td style={{ ...tdStyle, color: log.status === 'PAID' ? 'green' : 'red', fontWeight: 'bold' }}>
                            {log.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: '12px', color: '#888', italic: 'true' }}>Iss supplier ke liye abhi tak koi purchase history recorded nahi hai.</p>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  background: '#fff',
  padding: '25px',
  borderRadius: '8px',
  width: '580px',
  maxWidth: '92%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  marginBottom: '4px',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '7px 9px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const tabStyle = {
  padding: '6px 12px',
  border: 'none',
  background: '#e9ecef',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const activeTabStyle = {
  ...tabStyle,
  background: '#007bff',
  color: '#fff',
  fontWeight: 'bold',
};

const closeButtonStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: '18px',
  cursor: 'pointer',
};

const saveButtonStyle = {
  width: '100%',
  padding: '9px',
  borderRadius: '4px',
  border: 'none',
  background: '#007bff',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
};

const thStyle = {
  padding: '6px',
  textAlign: 'center',
  color: '#333',
};

const tdStyle = {
  padding: '6px',
  textAlign: 'center',
};

export default SupplierModal;