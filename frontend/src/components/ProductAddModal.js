import React, { useState } from 'react';

const ProductAddModal = ({ isOpen, onClose, onSaveProduct, suppliers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Casual Shirts',
    size: 'M',
    color: 'Black',
    selling_price: '',
    cost_price: '',
    total_stock: 10,
    min_sale_limit: 1,
    max_sale_limit: 10,
    supplier_id: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.selling_price) {
      return alert('Product Name aur Selling Price zaroori hai!');
    }

    const finalProduct = {
      id: Date.now(),
      ...formData,
      sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      barcode: formData.barcode || Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
      selling_price: parseFloat(formData.selling_price),
      cost_price: parseFloat(formData.cost_price || 0),
      total_stock: parseInt(formData.total_stock || 0),
      min_sale_limit: parseInt(formData.min_sale_limit || 1),
      max_sale_limit: parseInt(formData.max_sale_limit || 10),
    };

    onSaveProduct(finalProduct);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#0a3227' }}>📦 Add New Product Variant</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Slim Fit Denim Shirt"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="Casual Shirts">Casual Shirts</option>
              <option value="Formal Shirts">Formal Shirts</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Trousers & Chinos">Trousers & Chinos</option>
              <option value="Jackets & Blazers">Jackets & Blazers</option>
              <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
              <option value="Ethnic & Kurta">Ethnic & Kurta</option>
              <option value="Innerwear & Accessories">Innerwear & Accessories</option>
            </select>
          </div>

          {/* Size & Color Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Size</label>
              <select name="size" value={formData.size} onChange={handleChange} style={inputStyle}>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="30">30</option>
                <option value="32">32</option>
                <option value="34">34</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Color</label>
              <input type="text" name="color" placeholder="e.g. Black" value={formData.color} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* SKU & Barcode Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>SKU Code</label>
              <input type="text" name="sku" placeholder="Auto-generated if empty" value={formData.sku} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Barcode</label>
              <input type="text" name="barcode" placeholder="Auto-generated if empty" value={formData.barcode} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Cost Price & Selling Price Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cost Price (₹)</label>
              <input type="number" name="cost_price" placeholder="700" value={formData.cost_price} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Selling Price (₹)</label>
              <input type="number" name="selling_price" placeholder="1200" value={formData.selling_price} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* Total Stock & Limits Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Opening Stock</label>
              <input type="number" name="total_stock" value={formData.total_stock} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Min Sale Limit</label>
              <input type="number" name="min_sale_limit" value={formData.min_sale_limit} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Max Sale Limit</label>
              <input type="number" name="max_sale_limit" value={formData.max_sale_limit} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Supplier */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Supplier / Wholesaler</label>
            <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} style={inputStyle}>
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.company})</option>
              ))}
            </select>
          </div>

          <button type="submit" style={submitBtnStyle}>
            Save Product Variant
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#fff',
  padding: '20px 25px',
  borderRadius: '10px',
  width: '500px',
  maxWidth: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#374151',
  display: 'block',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const submitBtnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#0a3227',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default ProductAddModal;