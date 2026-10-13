import React, { useState } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Rohit Sharma', email: 'admin@urbanwear.com', role: 'Super Admin', phone: '+91 9876543210' },
    { id: 2, name: 'Cashier Staff', email: 'cashier@urbanwear.com', role: 'Cashier', phone: '+91 9123456789' },
    { id: 3, name: 'Amit Verma', email: 'amit@urbanwear.com', role: 'Employee', phone: '+91 9988776655' },
  ]);

  const [formData, setFormData] = useState({ name: '', email: '', role: 'Employee', phone: '', password: '' });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert('Name aur Email zaroori hai!');

    const newEmp = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone || 'N/A',
    };

    setEmployees([newEmp, ...employees]);
    setFormData({ name: '', email: '', role: 'Employee', phone: '', password: '' });
    alert('Employee successfully added!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0a3227' }}>👥 Employee & Staff Management</h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Manage staff access roles (Admin, Cashier, Employee)</span>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Form */}
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>+ Add New Staff / Employee</h4>
          <form onSubmit={handleAddEmployee}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" required placeholder="Rahul Verma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required placeholder="staff@urbanwear.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Assigned Role</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle}>
                <option value="Super Admin">Super Admin (Full Access)</option>
                <option value="Cashier">Cashier (POS & Returns Only)</option>
                <option value="Employee">Employee (Limited View)</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" placeholder="+91 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Employee
            </button>
          </form>
        </div>

        {/* List Table */}
        <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>📋 Active Staff Directory</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>EMAIL</th>
                <th style={thStyle}>ROLE</th>
                <th style={thStyle}>PHONE</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{emp.name}</td>
                  <td style={tdStyle}>{emp.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: emp.role === 'Super Admin' ? '#dcfce7' : emp.role === 'Cashier' ? '#e0f2fe' : '#f1f5f9', color: emp.role === 'Super Admin' ? '#166534' : emp.role === 'Cashier' ? '#0369a1' : '#475569', fontWeight: 'bold' }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={tdStyle}>{emp.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' };
const thStyle = { padding: '10px', fontSize: '11px' };
const tdStyle = { padding: '10px' };


export default EmployeeManagement;