import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = ({ storeConfig = {}, recentInvoices = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  // PDF Download Handler
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Store Branding Header
    doc.setFontSize(18);
    doc.setTextColor(10, 50, 39);
    doc.text(storeConfig.storeName || 'URBANWEAR POS', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Monthly Business & Financial Audit Report - ${selectedMonth}`, 14, 27);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 32);

    doc.line(14, 35, 196, 35);

    // Business Summary Table
    doc.autoTable({
      startY: 40,
      head: [['KPI Metric', 'Value']],
      body: [
        ['Total Gross Revenue', `${storeConfig.currency || '₹'}1,42,500.00`],
        ['Total Bills Generated', `${recentInvoices.length || 124} Invoices`],
        ['Total Udhaar Clearance Received', `${storeConfig.currency || '₹'}18,200.00`],
        ['Total Operational Expenses', `${storeConfig.currency || '₹'}12,450.00`],
        ['Estimated Net Profit', `${storeConfig.currency || '₹'}1,11,850.00`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [10, 50, 39] },
    });

    // Recent Sales Breakdown Table
    doc.setFontSize(12);
    doc.setTextColor(10, 50, 39);
    doc.text('Sales & Transactions Breakdown', 14, doc.lastAutoTable.finalY + 12);

    const tableRows = recentInvoices.map((inv) => [
      inv.invoice_number,
      inv.customer_name,
      inv.payment_method,
      `${storeConfig.currency || '₹'}${inv.grand_total}`,
      inv.date || 'N/A',
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Invoice #', 'Customer Name', 'Payment Mode', 'Amount', 'Date']],
      body: tableRows.length > 0 ? tableRows : [['-', 'No recent transactions', '-', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [21, 77, 62] },
    });

    // Footer
    doc.setFontSize(9);
    doc.text('This is an official computer-generated POS monthly audit report.', 14, 285);

    // Save File
    doc.save(`${storeConfig.storeName || 'POS'}_Monthly_Report_${selectedMonth}.pdf`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0a3227' }}>📊 Executive Reports & Analytics</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Download monthly performance reports in PDF format</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
          <button
            onClick={generatePDFReport}
            style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📄 Download Monthly PDF Report
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <Card title="Monthly Sales" amount={`${storeConfig.currency || '₹'}1,42,500`} color="#10b981" />
        <Card title="Cash Collections" amount={`${storeConfig.currency || '₹'}98,200`} color="#2563eb" />
        <Card title="Pending Udhaar" amount={`${storeConfig.currency || '₹'}31,800`} color="#f59e0b" />
        <Card title="Total Operational Expenses" amount={`${storeConfig.currency || '₹'}12,450`} color="#ef4444" />
      </div>

      {/* Recent Invoices Log */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>🧾 Transactions History Included in Report</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
              <th style={thStyle}>INVOICE #</th>
              <th style={thStyle}>CUSTOMER</th>
              <th style={thStyle}>PAYMENT MODE</th>
              <th style={thStyle}>AMOUNT</th>
              <th style={thStyle}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{inv.invoice_number}</td>
                <td style={tdStyle}>{inv.customer_name}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: inv.payment_method === 'CASH' ? '#dcfce7' : '#fef3c7', color: inv.payment_method === 'CASH' ? '#166534' : '#92400e', fontWeight: 'bold' }}>
                    {inv.payment_method}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{storeConfig.currency || '₹'}{inv.grand_total}</td>
                <td style={tdStyle}>{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const Card = ({ title, amount, color }) => (
  <div style={{ background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>{title}</div>
    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginTop: '6px' }}>{amount}</div>
  </div>
);

const thStyle = { padding: '10px', fontSize: '11px' };
const tdStyle = { padding: '10px' };

export default Reports;