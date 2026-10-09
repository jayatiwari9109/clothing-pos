import React, { useState } from 'react';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Shop Electricity Bill', category: 'Utilities', amount: 3450, date: '10/05/2026', time: '04:30 PM', addedBy: 'Rohit Sharma' },
    { id: 2, title: 'Packing Polybags Purchase', category: 'Supplies', amount: 1200, date: '10/07/2026', time: '11:15 AM', addedBy: 'Rohit Sharma' },
    { id: 3, title: 'Tea & Snacks for Staff', category: 'Refreshments', amount: 450, date: '10/09/2026', time: '01:20 PM', addedBy: 'Cashier Staff' },
  ]);

  const [formData, setFormData] = useState({ title: '', category: 'Utilities', amount: '' });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return alert('Expense Title aur Amount zaroori hai!');

    const newExpense = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      addedBy: 'Rohit Sharma'
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({ title: '', category: 'Utilities', amount: '' });
  };

  // CSV Report Export Handler (Date & Time Trail ke saath)
  const downloadExpenseReport = () => {
    if (expenses.length === 0) return alert('No expense records to export!');

    let csvContent = 'data:text/csv;charset=utf-8,ID,Expense Title,Category,Amount (INR),Date,Time,Added By\n';
    
    expenses.forEach((item) => {
      csvContent += `${item.id},"${item.title}",${item.category},${item.amount},${item.date},${item.time},"${item.addedBy}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalExpenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header & Export Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0a3227' }}>💸 Expense Management & Weekly Audits</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Track operational costs and export date-stamped CSV reports</span>
        </div>
        <button
          onClick={downloadExpenseReport}
          style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          📥 Download CSV Report
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Left: Add Expense Form */}
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>+ Add New Expense Entry</h4>
          <form onSubmit={handleAddExpense}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Tea/Snacks, Shop Rent"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
              >
                <option value="Utilities">Utilities (Electricity/Water)</option>
                <option value="Supplies">Supplies & Packaging</option>
                <option value="Refreshments">Refreshments & Staff</option>
                <option value="Maintenance">Maintenance & Repairs</option>
                <option value="Rent & Taxes">Rent & Taxes</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Amount (₹)</label>
              <input
                type="number"
                placeholder="500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={inputStyle}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#0a3227', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Record Expense Entry
            </button>
          </form>
        </div>

        {/* Right: Expenses Table */}
        <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#1e293b' }}>📋 Recent Expense Logs</h4>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#dc2626' }}>
              Total Expenses: ₹{totalExpenseAmount.toLocaleString()}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={thStyle}>TITLE</th>
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>AMOUNT</th>
                <th style={thStyle}>DATE & TIME</th>
                <th style={thStyle}>ADDED BY</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.title}</td>
                  <td style={tdStyle}>{item.category}</td>
                  <td style={{ ...tdStyle, color: '#dc2626', fontWeight: 'bold' }}>₹{item.amount}</td>
                  <td style={tdStyle}>{item.date} at {item.time}</td>
                  <td style={tdStyle}>{item.addedBy}</td>
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

export default ExpenseManagement;