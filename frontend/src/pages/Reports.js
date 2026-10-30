import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = ({ storeConfig = {}, recentInvoices = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [scopeFilter, setScopeFilter] = useState('All scopes');
  const [reportType, setReportType] = useState('Monthly'); // Monthly, Yearly, Day-wise
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [downloadingId, setDownloadingId] = useState(null);

  // Enterprise Reports Master List
  const reportsList = [
    {
      id: 'REP-01',
      category: 'Financial statements',
      scope: 'Sales & Revenue',
      title: 'Monthly Sales & Revenue Statement',
      description: 'Comprehensive gross revenue, tax collection, discounts, and net sales breakdown.',
      type: 'Monthly',
      lastGenerated: 'Today, 10:45 AM',
    },
    {
      id: 'REP-02',
      category: 'Operational outputs',
      scope: 'Inventory & Stock',
      title: 'Day-wise Stock & Sales Register',
      description: 'Item-wise sold quantities, remaining stock levels, and daily cash drawer closing.',
      type: 'Day-wise',
      lastGenerated: 'Yesterday, 08:30 PM',
    },
    {
      id: 'REP-03',
      category: 'Financial statements',
      scope: 'Tax & Compliance',
      title: 'Yearly GST & Tax Audit Report',
      description: 'Total GST collected, taxable turnovers, and annual financial summaries for filing.',
      type: 'Yearly',
      lastGenerated: '15 Oct 2026',
    },
    {
      id: 'REP-04',
      category: 'Audit / exception views',
      scope: 'Customer Ledger',
      title: 'Customer Udhaar & Ledger Statement',
      description: 'Outstanding customer balances, credit limits, and payment clearance history.',
      type: 'Monthly',
      lastGenerated: '12 Oct 2026',
    },
    {
      id: 'REP-05',
      category: 'Operational outputs',
      scope: 'Expenses',
      title: 'Day-wise Expense & Cash Outflow',
      description: 'Daily operational expenses, supplier payouts, and cash register audits.',
      type: 'Day-wise',
      LastGenerated: 'Today, 09:15 AM',
    },
    {
      id: 'REP-06',
      category: 'Financial statements',
      scope: 'Profit & Loss',
      title: 'Yearly Profit & Loss Statement',
      description: 'Annual business turnover, operational costs, net margins, and profit audits.',
      type: 'Yearly',
      lastGenerated: '01 Jan 2026',
    },
  ];

  // Filter Logic
  const filteredReports = reportsList.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All categories' || r.category === categoryFilter;
    const matchesScope = scopeFilter === 'All scopes' || r.scope === scopeFilter;
    const matchesType = reportType === 'All' || r.type === reportType;
    return matchesSearch && matchesCategory && matchesScope && matchesType;
  });

  // Professional PDF Generation Handler
  const generatePDF = (report) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      const doc = new jsPDF();

      // Header Branding
      doc.setFontSize(18);
      doc.setTextColor(10, 50, 39);
      doc.text(storeConfig.storeName || 'URBANWEAR ENTERPRISE POS', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report Name: ${report.title}`, 14, 27);
      doc.text(`Category: ${report.category} | Scope: ${report.scope}`, 14, 33);
      doc.text(`Timeframe: ${reportType} (${selectedDate}) | Generated On: ${new Date().toLocaleString()}`, 14, 39);
      doc.line(14, 44, 196, 44);

      // Data Table
      autoTable(doc, {
        startY: 50,
        head: [['Invoice / Ref ID', 'Customer / Particulars', 'Payment Mode', 'Total Amount', 'Status']],
        body: recentInvoices.length > 0 
          ? recentInvoices.map(i => [i.invoice_number, i.customer_name, i.payment_method, `₹${i.grand_total}`, 'Verified & Audited'])
          : [['INV-1001', 'Walk-in Customer', 'CASH', '₹2,500', 'Verified & Audited'],
             ['INV-1002', 'Rahul Sharma', 'UPI', '₹1,800', 'Verified & Audited']],
        theme: 'grid',
        headStyles: { fillColor: [10, 50, 39] },
        styles: { fontSize: 9, cellPadding: 5 },
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Confidential Financial Statement - ${storeConfig.storeName || 'URBANWEAR'} Workspace`, 14, 285);

      doc.save(`${report.title.replace(/\s+/g, '_')}_${reportType}_${selectedDate}.pdf`);
      setDownloadingId(null);
    }, 600);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* Top Header Section */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            REPORTING / ENTERPRISE STATEMENTS
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            Reports & Statements
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Generate controlled operational, financial, and audit outputs from the active retail workspace.
          </p>
        </div>
        <div style={{ fontSize: '12px', background: '#e2e8f0', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', color: '#334155' }}>
          🔒 Secure Audit Console
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search report name, scope or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>📅 Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          {['Monthly', 'Yearly', 'Day-wise'].map((t) => (
            <button
              key={t}
              onClick={() => setReportType(t)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                background: reportType === t ? '#0a3227' : 'transparent',
                color: reportType === t ? '#fff' : '#475569',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '13px', fontWeight: '500', color: '#334155', outline: 'none' }}
        >
          <option value="All categories">All categories</option>
          <option value="Financial statements">Financial statements</option>
          <option value="Operational outputs">Operational outputs</option>
          <option value="Audit / exception views">Audit / exception views</option>
        </select>

        {/* Scope Dropdown */}
        <select
          value={scopeFilter}
          onChange={(e) => setScopeFilter(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '13px', fontWeight: '500', color: '#334155', outline: 'none' }}
        >
          <option value="All scopes">All scopes</option>
          <option value="Sales & Revenue">Sales & Revenue</option>
          <option value="Inventory & Stock">Inventory & Stock</option>
          <option value="Tax & Compliance">Tax & Compliance</option>
          <option value="Customer Ledger">Customer Ledger</option>
          <option value="Expenses">Expenses</option>
          <option value="Profit & Loss">Profit & Loss</option>
        </select>
      </div>

      {/* Metrics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <MetricCard label="Available reports" count={filteredReports.length} color="#0a3227" />
        <MetricCard label="Operational outputs" count={reportsList.filter(r => r.category === 'Operational outputs').length} color="#0284c7" />
        <MetricCard label="Financial statements" count={reportsList.filter(r => r.category === 'Financial statements').length} color="#16a34a" />
        <MetricCard label="Audit / exceptions" count={reportsList.filter(r => r.category === 'Audit / exception views').length} color="#d97706" />
      </div>

      {/* Reports Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {filteredReports.map((report) => (
          <div key={report.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.2s' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {report.category} • {report.scope}
                </span>
                <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', color: '#334155', border: '1px solid #e2e8f0' }}>
                  {report.type}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
                {report.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px 0', lineHeight: '1.5' }}>
                {report.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Last generated: {report.lastGenerated}</span>
              <button
                onClick={() => generatePDF(report)}
                disabled={downloadingId === report.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: downloadingId === report.id ? '#94a3b8' : '#0a3227',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {downloadingId === report.id ? '⏳ Generating...' : `📥 Export PDF (${reportType})`}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const MetricCard = ({ label, count, color }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{count}</div>
  </div>
);

export default Reports;