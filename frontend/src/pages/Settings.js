import React, { useState } from 'react';

const Settings = ({ storeConfig, onSaveConfig }) => {
  const [formData, setFormData] = useState({
    storeName: storeConfig.storeName || 'URBANWEAR',
    subTitle: storeConfig.subTitle || 'POS Billing System',
    currency: storeConfig.currency || '₹',
    gstRate: storeConfig.gstRate || 12,
    address: storeConfig.address || '123 Fashion Street, City Mall',
    phone: storeConfig.phone || '+91 9876543210',
    logoUrl: storeConfig.logoUrl || '',
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    alert('Settings successfully updated!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0a3227' }}>⚙️ Dynamic POS & Branding Settings</h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Change company name, logo, receipt headers, and default tax rates</span>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', maxWidth: '650px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Logo Upload Section */}
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label style={{ ...labelStyle, fontSize: '12px' }}>Company Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Store Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #ccc' }} />
              ) : (
                <div style={{ width: '60px', height: '60px', background: '#0a3227', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '6px' }}>
                  {formData.storeName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Company / Store Name</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>System Tagline / Subtitle</label>
            <input
              type="text"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Currency Symbol</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Default GST Tax Rate (%)</label>
              <input
                type="number"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Store Address (Appears on Invoice)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Store Phone / Contact</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={{ padding: '12px 20px', background: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            💾 Save Branding Changes
          </button>
        </form>
      </div>

    </div>
  );
};

const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' };

export default Settings;