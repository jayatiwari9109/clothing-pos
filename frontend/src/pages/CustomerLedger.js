import React, { useState } from 'react';

const CustomerLedger = ({ customers = [], onReceivePayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState(null);
  const [payModalCustomer, setPayModalCustomer] = useState(null);
  const [amountReceived, setAmountReceived] = useState('');

  // Search filter
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm)
  );

  // Totals
  const totalCustomers = customers.length;
  const totalUdhaar = customers.reduce((sum, c) => sum + (c.current_balance || 0), 0);

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!amountReceived || parseFloat(amountReceived) <= 0) return alert('Sahi amount bharein!');
    if (onReceivePayment) {
      onReceivePayment(payModalCustomer.id, parseFloat(amountReceived));
    }
    alert(`₹${amountReceived} payment successfully recorded for ${payModalCustomer.name}`);
    setPayModalCustomer(null);
    setAmountReceived('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={cardStyle}>
          <span style={labelStyle}>TOTAL REGISTERED CUSTOMERS</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#2c3e50' }}>{totalCustomers}</h2>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>TOTAL PENDING UDHAAR (OUTSTANDING)</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c' }}>₹{totalUdhaar.toLocaleString()}</h2>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>REGULAR MEMBERS</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#27ae60' }}>
            {customers.filter((c) => c.type === 'REGULAR').length}
          </h2>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Search Customer by Name or Mobile Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Customer Ledger Table */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={thStyle}>CUSTOMER NAME</th>
              <th style={thStyle}>TYPE</th>
              <th style={thStyle}>MOBILE / CONTACT</th>
              <th style={thStyle}>CREDIT LIMIT</th>
              <th style={thStyle}>CURRENT UDHAAR BALANCE</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                    {c.name}
                    {c.email && <div style={{ fontSize: '10px', color: '#666' }}>{c.email}</div>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: c.type === 'REGULAR' ? '#dcfce7' : '#f1f5f9', color: c.type === 'REGULAR' ? '#166534' : '#475569' }}>
                      {c.type || 'OCCASIONAL'}
                    </span>
                  </td>
                  <td style={tdStyle}>{c.mobile}</td>
                  <td style={tdStyle}>₹{c.credit_limit || 0}</td>
                  <td style={tdStyle}>
                    <strong style={{ color: (c.current_balance || 0) > 0 ? '#dc2626' : '#16a34a' }}>
                      ₹{c.current_balance || 0}
                    </strong>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedCustomerHistory(c)}
                        style={{ padding: '4px 8px', fontSize: '11px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        📜 History
                      </button>
                      {(c.current_balance || 0) > 0 && (
                        <button
                          onClick={() => setPayModalCustomer(c)}
                          style={{ padding: '4px 8px', fontSize: '11px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          💵 Pay Udhaar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      {selectedCustomerHistory && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>📜 Purchase & Invoice History: {selectedCustomerHistory.name}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={thStyle}>Invoice No</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Total Amount</th>
                  <th style={thStyle}>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerHistory.purchase_history && selectedCustomerHistory.purchase_history.length > 0 ? (
                  selectedCustomerHistory.purchase_history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={tdStyle}>{h.invoice_no}</td>
                      <td style={tdStyle}>{h.date}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>₹{h.total}</td>
                      <td style={tdStyle}>{h.payment_mode}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>No past invoices.</td></tr>
                )}
              </tbody>
            </table>
            <button onClick={() => setSelectedCustomerHistory(null)} style={{ marginTop: '15px', padding: '6px 12px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Udhaar Payment Receive Modal */}
      {payModalCustomer && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>💵 Receive Udhaar Payment: {payModalCustomer.name}</h3>
            <p>Current Pending Balance: <strong style={{ color: 'red' }}>₹{payModalCustomer.current_balance}</strong></p>
            <form onSubmit={handlePaySubmit}>
              <input
                type="number"
                placeholder="Enter Received Amount (₹)"
                required
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Payment</button>
                <button type="button" onClick={() => setPayModalCustomer(null)} style={{ padding: '8px 16px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const cardStyle = { background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#64748b' };
const thStyle = { padding: '10px', fontSize: '11px' };
const tdStyle = { padding: '10px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContent = { background: '#fff', padding: '20px', borderRadius: '8px', width: '450px' };

export default CustomerLedger;