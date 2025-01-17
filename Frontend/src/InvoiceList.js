import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this imports your styles

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices', {
          withCredentials: true
        });
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Invoice List</h2>
      <ul className="invoice-list">
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            ID: {invoice.userId}, Amount: ${invoice.amount}, Due Date: {invoice.dueDate}, Recipient: {invoice.recipient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
