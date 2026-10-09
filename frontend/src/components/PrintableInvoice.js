import React from 'react';
import { COMPANY_DETAILS } from '../utils/mockData';

const PrintableInvoice = ({ invoiceData, onClose }) => {
  if (!invoiceData) return null;

  const {
    invoice_number = "INV-1001",
    date = new Date().toLocaleDateString(),
    time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    customer = { name: "Walk-in Customer", mobile: "N/A", current_balance: 0 },
    items = [],
    subtotal = 0,
    discount_amount = 0,
    tax_amount = 0,
    grand_total = 0,
    payment_mode = "CASH",
  } = invoiceData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {/* Print / Action Header (Screen view only) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <h3>📄 Invoice Preview</h3>
          <div>
            <button onClick={handlePrint} style={printButtonStyle}>🖨️ Print Receipt</button>
            <button onClick={onClose} style={closeButtonStyle}>✕ Close</button>
          </div>
        </div>

        {/* Printable Area Starts Here */}
        <div id="printable-area" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
          
          {/* Company Header */}
          <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '2px dashed #333', paddingBottom: '10px' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', letterSpacing: '1px' }}>{COMPANY_DETAILS.name}</h2>
            <p style={{ margin: '2px 0', fontSize: '12px', color: '#555' }}>{COMPANY_DETAILS.address}</p>
            <p style={{ margin: '2px 0', fontSize: '12px', color: '#555' }}>
              <strong>Ph:</strong> {COMPANY_DETAILS.phone} | <strong>GSTIN:</strong> {COMPANY_DETAILS.gstin}
            </p>
          </div>

          {/* Invoice & Customer Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '15px' }}>
            <div>
              <p style={{ margin: '3px 0' }}><strong>Invoice No:</strong> {invoice_number}</p>
              <p style={{ margin: '3px 0' }}><strong>Date & Time:</strong> {date} {time}</p>
              <p style={{ margin: '3px 0' }}><strong>Payment Mode:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{payment_mode}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '3px 0' }}><strong>Customer Name:</strong> {customer.name}</p>
              <p style={{ margin: '3px 0' }}><strong>Mobile:</strong> {customer.mobile}</p>
              {customer.current_balance > 0 && (
                <p style={{ margin: '3px 0', color: '#d9534f' }}>
                  <strong>Previous Udhaar Balance:</strong> ₹{customer.current_balance}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '15px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #333' }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Item Description</th>
                <th style={thStyle}>SKU / Barcode</th>
                <th style={thStyle}>Qty</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '10px', color: '#666' }}>Size: {item.size} | Color: {item.color}</div>
                  </td>
                  <td style={tdStyle}>{item.sku || item.barcode}</td>
                  <td style={tdStyle}>{item.qty}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{item.selling_price}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{(item.selling_price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bill Calculation Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', marginBottom: '15px' }}>
            <div style={{ width: '220px' }}>
              <div style={calcRowStyle}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount_amount > 0 && (
                <div style={calcRowStyle}>
                  <span>Discount:</span>
                  <span style={{ color: '#28a745' }}>- ₹{discount_amount.toFixed(2)}</span>
                </div>
              )}
              {tax_amount > 0 && (
                <div style={calcRowStyle}>
                  <span>GST/Tax:</span>
                  <span>+ ₹{tax_amount.toFixed(2)}</span>
                </div>
              )}
              <hr style={{ margin: '5px 0' }} />
              <div style={{ ...calcRowStyle, fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                <span>Grand Total:</span>
                <span>₹{grand_total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Footer */}
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '10px', color: '#555', textAlign: 'center' }}>
            <p style={{ margin: '2px 0', whiteSpace: 'pre-line' }}>{COMPANY_DETAILS.terms}</p>
            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>*** Thank You For Shopping With Us! ***</p>
          </div>

        </div>
      </div>

      {/* Print CSS to hide buttons during browser print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

// Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1100,
};

const modalContentStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '600px',
  maxWidth: '95%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
};

const thStyle = {
  padding: '6px',
  fontSize: '11px',
  color: '#333',
  textAlign: 'center',
};

const tdStyle = {
  padding: '6px',
  textAlign: 'center',
};

const calcRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '3px',
};

const printButtonStyle = {
  padding: '6px 14px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginRight: '8px',
};

const closeButtonStyle = {
  padding: '6px 12px',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default PrintableInvoice;