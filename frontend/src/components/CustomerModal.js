import React, { useState } from 'react';

const CustomerModal = ({ isOpen, onClose, onSaveCustomer }) => {
  const [customerType, setCustomerType] = useState('REGULAR'); // REGULAR vs OCCASIONAL
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    default_discount: 0,
    credit_limit: 0,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert('Kripya Name aur Mobile Number zaroor bharein!');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      type: customerType,
      name: formData.name,
      mobile: formData.mobile,
      email: customerType === 'REGULAR' ? formData.email : '',
      address: customerType === 'REGULAR' ? formData.address : '',
      default_discount: customerType === 'REGULAR' ? parseFloat(formData.default_discount || 0) : 0,
      credit_limit: customerType === 'REGULAR' ? parseFloat(formData.credit_limit || 0) : 0,
      current_balance: 0,
      purchase_history: [],
    };

    onSaveCustomer(newCustomer);
    onClose();
    // Reset Form
    setFormData({ name: '', mobile: '', email: '', address: '', default_discount: 0, credit_limit: 0 });
    setCustomerType('REGULAR');
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>+ Add New Customer</h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Type Selector */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Customer Type:</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="REGULAR"
                  checked={customerType === 'REGULAR'}
                  onChange={() => setCustomerType('REGULAR')}
                />{' '}
                <strong>Regular Customer</strong> (Discount & Credit Limit)
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="OCCASIONAL"
                  checked={customerType === 'OCCASIONAL'}
                  onChange={() => setCustomerType('OCCASIONAL')}
                />{' '}
                <strong>Occasional / Walk-in</strong> (Simple)
              </label>
            </div>
          </div>

          {/* Common Fields */}
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Customer Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Mobile Number *</label>
            <input
              type="text"
              name="mobile"
              placeholder="10-digit Mobile Number"
              required
              value={formData.mobile}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Regular Customer Specific Fields */}
          {customerType === 'REGULAR' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="customer@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  placeholder="City / Address"
                  value={formData.address}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Default Discount (%)</label>
                  <input
                    type="number"
                    name="default_discount"
                    placeholder="e.g. 5 or 10"
                    min="0"
                    max="100"
                    value={formData.default_discount}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Max Credit Limit (₹)</label>
                  <input
                    type="number"
                    name="credit_limit"
                    placeholder="e.g. 5000"
                    min="0"
                    value={formData.credit_limit}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={saveButtonStyle}>
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple Inline CSS Styles
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
  width: '450px',
  maxWidth: '90%',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '4px',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const closeButtonStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: '18px',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  background: '#f5f5f5',
  cursor: 'pointer',
};

const saveButtonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  background: '#28a745',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default CustomerModal;