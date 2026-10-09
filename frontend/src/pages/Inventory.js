import React, { useState } from 'react';

const Inventory = ({ products = [], suppliers = [], onOpenAddProductModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSupplierHistory, setSelectedSupplierHistory] = useState(null);

  // Filter Products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory =
      selectedCategory === 'ALL' || (p.category || p.category_name) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Overall Inventory Metrics
  const totalStockAvailable = products.reduce((acc, p) => acc + (p.total_stock || 0), 0);
  const totalStockSold = products.reduce((acc, p) => acc + (p.sold_qty || 0), 0);
  const lowStockCount = products.filter((p) => (p.total_stock || 0) <= 5).length;
  const totalInventoryValuation = products.reduce(
    (acc, p) => acc + (p.total_stock || 0) * (p.purchase_price || p.cost_price || 0),
    0
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>📦 Advanced Inventory & Stock Management</h2>
          <span style={{ fontSize: '12px', color: '#6c757d' }}>Live Stock Levels, Sales Limits, & Supplier Purchase Logs</span>
        </div>
        <button
          onClick={onOpenAddProductModal}
          style={{ padding: '10px 18px', background: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Add New Product Variant
        </button>
      </div>

      {/* Analytics Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>AVAILABLE STOCK (REMAINING)</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#27ae60' }}>{totalStockAvailable} <span style={{ fontSize: '13px' }}>Pcs</span></h2>
        </div>
        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>TOTAL SOLD STOCK (TOTAL SALE)</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#2980b9' }}>{totalStockSold} <span style={{ fontSize: '13px' }}>Pcs</span></h2>
        </div>
        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>LOW STOCK ALERTS</span>
          <h2 style={{ margin: '5px 0 0 0', color: lowStockCount > 0 ? '#e74c3c' : '#27ae60' }}>{lowStockCount} <span style={{ fontSize: '13px' }}>Items</span></h2>
        </div>
        <div style={metricCardStyle}>
          <span style={metricLabelStyle}>TOTAL COST VALUATION</span>
          <h2 style={{ margin: '5px 0 0 0', color: '#8e44ad' }}>₹{totalInventoryValuation.toLocaleString()}</h2>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '15px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <input
          type="text"
          placeholder="🔍 Search by Product Name, SKU, or Barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
        />
        <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
>
  <option value="ALL">All Categories</option>
  <option value="Formal Shirts">Formal Shirts</option>
  <option value="Casual Shirts">Casual Shirts</option>
  <option value="T-Shirts">T-Shirts</option>
  <option value="Jeans">Jeans</option>
  <option value="Trousers & Chinos">Trousers & Chinos</option>
  <option value="Jackets & Blazers">Jackets & Blazers</option>
  <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
  <option value="Ethnic & Kurta">Ethnic & Kurta</option>
  <option value="Innerwear & Accessories">Innerwear & Accessories</option>
</select>
      </div>

      {/* Main Stock Table */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>
              <th style={thStyle}>PRODUCT DETAILS</th>
              <th style={thStyle}>SKU / BARCODE</th>
              <th style={thStyle}>COST / SELL PRICE</th>
              <th style={thStyle}>AVAILABLE STOCK</th>
              <th style={thStyle}>TOTAL SOLD</th>
              <th style={thStyle}>RECENT STOCK IN</th>
              <th style={thStyle}>SALE LIMITS (MIN / MAX)</th>
              <th style={thStyle}>SUPPLIER DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No stock items match your search.
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => {
                const available = item.total_stock || 0;
                const sold = item.sold_qty || 0;
                const recent = item.recent_added_stock || 0;
                const matchedSupplier = suppliers.find((s) => String(s.id) === String(item.supplier_id));

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                      {item.name}
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>
                        Size: {item.size || 'STD'} | Color: {item.color || 'N/A'} | Cat: {item.category || item.category_name}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontFamily: 'monospace' }}>{item.sku}</div>
                      <div style={{ fontSize: '10px', color: '#007bff' }}>{item.barcode || 'N/A'}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#64748b' }}>Cost: ₹{item.purchase_price || item.cost_price || 0}</span>
                      <br />
                      <strong style={{ color: '#27ae60' }}>Sell: ₹{item.selling_price}</strong>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          background: available <= 5 ? '#fee2e2' : '#dcfce7',
                          color: available <= 5 ? '#dc2626' : '#166534',
                        }}
                      >
                        {available} Pcs
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <strong style={{ color: '#2563eb' }}>{sold} Pcs</strong>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#059669', fontWeight: 'bold' }}>+{recent} Pcs</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '10px' }}>
                        Min: <strong>{item.min_sale_limit || 1}</strong> | Max: <strong>{item.max_sale_limit || 'Unlimited'}</strong>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div>{item.supplier_name || (matchedSupplier ? matchedSupplier.name : 'N/A')}</div>
                      {matchedSupplier && (
                        <button
                          onClick={() => setSelectedSupplierHistory(matchedSupplier)}
                          style={{ fontSize: '10px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        >
                          📜 View History
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier Purchase History Modal Popup */}
      {selectedSupplierHistory && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>📜 Purchase History: {selectedSupplierHistory.name}</h3>
              <button onClick={() => setSelectedSupplierHistory(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '12px', color: '#555', margin: '0 0 10px 0' }}>
              Company: <strong>{selectedSupplierHistory.company}</strong> | Phone: <strong>{selectedSupplierHistory.phone}</strong>
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
                  <th style={thStyle}>PO ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Stock Item</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Cost/Unit</th>
                  <th style={thStyle}>Total Cost</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedSupplierHistory.purchase_history && selectedSupplierHistory.purchase_history.length > 0 ? (
                  selectedSupplierHistory.purchase_history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}>{h.id}</td>
                      <td style={tdStyle}>{h.date}</td>
                      <td style={{ ...tdStyle, textAlign: 'left' }}>{h.item}</td>
                      <td style={tdStyle}>{h.qty}</td>
                      <td style={tdStyle}>₹{h.cost_price}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>₹{h.total_amount}</td>
                      <td style={{ ...tdStyle, color: h.status === 'PAID' ? 'green' : 'red', fontWeight: 'bold' }}>{h.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '15px', color: '#888' }}>No purchase order records found.</td>
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

// Component Styles
const metricCardStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
};

const metricLabelStyle = {
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#64748b',
};

const thStyle = {
  padding: '10px 12px',
  fontSize: '11px',
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '10px 12px',
};

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
  padding: '20px',
  borderRadius: '8px',
  width: '550px',
  maxWidth: '92%',
  maxHeight: '85vh',
  overflowY: 'auto',
};

export default Inventory;