const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  recipient: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
