import React from 'react';

const Overview = ({ products = [], customers = [], recentInvoices = [], overviewMetrics = {} }) => {
  // Low Stock Items (< 5)
  const lowStockProducts = products.filter((p) => (p.total_stock || 0) <= 5);

  // Top Selling Items (sorted by sold_qty)
  const topSellingProducts = [...products]
    .sort((a, b) => (b.sold_qty || 0) - (a.sold_qty || 0))
    .slice(0, 4);

  // Calculate Payment Mode Breakdown
  const cashSales = recentInvoices
    .filter((inv) => inv.payment_method === 'CASH' || inv.payment_mode === 'CASH')
    .reduce((sum, inv) => sum + (inv.grand_total || inv.grandTotal || 0), 0);

  const upiSales = recentInvoices
    .filter((inv) => inv.payment_method === 'UPI' || inv.payment_mode === 'UPI')
    .reduce((sum, inv) => sum + (inv.grand_total || inv.grandTotal || 0), 0);

  const udhaarSales = recentInvoices
    .filter((inv) => inv.payment_method === 'CREDIT_UDHAAR' || inv.payment_method === 'UDHAAR')
    .reduce((sum, inv) => sum + (inv.grand_total || inv.grandTotal || 0), 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* 1. TOP METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={cardStyle}>
          <span style={labelStyle}>TOTAL SALES REVENUE</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#0a3227', fontSize: '24px' }}>₹{overviewMetrics.total_sales || 14250}</h2>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>PENDING UDHAAR</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#ea580c', fontSize: '24px' }}>₹{overviewMetrics.total_udhaar || 3200}</h2>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>TOTAL CUSTOMERS</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#2563eb', fontSize: '24px' }}>{customers.length || overviewMetrics.total_customers || 18}</h2>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>LOW STOCK ALERTS</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#ef4444', fontSize: '24px' }}>{lowStockProducts.length} Items</h2>
        </div>
      </div>

      {/* 2. PAYMENT SPLIT BREAKDOWN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ ...cardStyle, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span style={{ ...labelStyle, color: '#166534' }}>💵 CASH SALES</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#15803d' }}>₹{cashSales.toLocaleString()}</h3>
        </div>
        <div style={{ ...cardStyle, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <span style={{ ...labelStyle, color: '#1e40af' }}>📲 UPI / ONLINE SALES</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#1d4ed8' }}>₹{upiSales.toLocaleString()}</h3>
        </div>
        <div style={{ ...cardStyle, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <span style={{ ...labelStyle, color: '#9a3412' }}>📝 CREDIT / UDHAAR SALES</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#c2410c' }}>₹{udhaarSales.toLocaleString()}</h3>
        </div>
      </div>

      {/* 3. RECENT INVOICES & TOP SELLING PRODUCTS ROW */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        
        {/* Left: Recent Invoices Table */}
        <div style={{ flex: 2, background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>📄 Recent Invoices (Transactions)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>INVOICE NO</th>
                <th style={thStyle}>CUSTOMER</th>
                <th style={thStyle}>PAYMENT MODE</th>
                <th style={thStyle}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No recent transactions recorded.</td></tr>
              ) : (
                recentInvoices.map((inv, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{inv.invoice_number}</td>
                    <td style={tdStyle}>{inv.customer_name || (inv.customer && inv.customer.name) || 'Walk-in'}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: '#e2e8f0' }}>
                        {inv.payment_method || inv.payment_mode || 'CASH'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0a3227' }}>₹{inv.grand_total || inv.grandTotal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Top Selling Products */}
        <div style={{ flex: 1, background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>🔥 Fast Moving Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topSellingProducts.map((prod) => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '12px', color: '#334155' }}>{prod.name}</strong>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>SKU: {prod.sku}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a' }}>{prod.sold_qty || 0} Sold</span>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>₹{prod.selling_price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. LOW STOCK WARNING PANEL */}
      {lowStockProducts.length > 0 && (
        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '13px' }}>⚠️ Critical Low Stock Warnings (Action Required)</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {lowStockProducts.map((p) => (
              <div key={p.id} style={{ background: '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '11px' }}>
                <strong>{p.name}</strong> ({p.sku}): Only <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{p.total_stock} Pcs</span> left!
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Styles
const cardStyle = { background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#64748b' };
const thStyle = { padding: '8px 10px', fontSize: '11px' };
const tdStyle = { padding: '8px 10px' };

export default Overview;