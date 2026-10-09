import React, { useState } from 'react';

const SupplierManagement = ({ suppliers = [], onOpenSupplierModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.phone.includes(searchTerm)
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>🏭 Supplier & Purchase Order History</h2>
          <span style={{ fontSize: '12px', color: '#6c757d' }}>Wholesalers Directory, Stock Inflows & Payment Statuses</span>
        </div>
        <button
          onClick={onOpenSupplierModal}
          style={{ padding: '10px 18px', background: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Add Supplier / Purchase Entry
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Search Supplier by Name, Company, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Supplier List */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>
              <th style={thStyle}>SUPPLIER / COMPANY</th>
              <th style={thStyle}>CONTACT PHONE</th>
              <th style={thStyle}>LOCATION</th>
              <th style={thStyle}>TOTAL ORDERS</th>
              <th style={thStyle}>PURCHASE HISTORY</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No supplier records found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((s) => {
                const history = s.purchase_history || [];
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                      {s.name}
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>{s.company || 'Distributor'}</div>
                    </td>
                    <td style={tdStyle}>{s.phone}</td>
                    <td style={tdStyle}>{s.address || 'N/A'}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '3px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 'bold' }}>
                        {history.length} Orders
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => setSelectedSupplier(s)}
                        style={{ padding: '4px 10px', fontSize: '11px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        📜 View Order Ledger
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Logs Modal */}
      {selectedSupplier && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>📜 Purchase Ledger: {selectedSupplier.name}</h3>
              <button onClick={() => setSelectedSupplier(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '12px', color: '#555', margin: '0 0 10px 0' }}>
              Company: <strong>{selectedSupplier.company}</strong> | Contact: <strong>{selectedSupplier.phone}</strong>
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
                  <th style={thStyle}>PO ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Item Bought</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Cost/Unit</th>
                  <th style={thStyle}>Total Amount</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedSupplier.purchase_history && selectedSupplier.purchase_history.length > 0 ? (
                  selectedSupplier.purchase_history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}>{h.id}</td>
                      <td style={tdStyle}>{h.date}</td>
                      <td style={{ ...tdStyle, textAlign: 'left' }}>{h.item}</td>
                      <td style={tdStyle}>{h.qty}</td>
                      <td style={tdStyle}>₹{h.cost_price}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>₹{h.total_amount}</td>
                      <td style={{ ...tdStyle, color: h.status === 'PAID' ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{h.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '15px', color: '#888' }}>No purchase history recorded for this supplier.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

const thStyle = { padding: '10px 12px', fontSize: '11px', fontWeight: 'bold' };
const tdStyle = { padding: '10px 12px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', padding: '20px', borderRadius: '8px', width: '600px', maxWidth: '92%', maxHeight: '85vh', overflowY: 'auto' };

export default SupplierManagement;