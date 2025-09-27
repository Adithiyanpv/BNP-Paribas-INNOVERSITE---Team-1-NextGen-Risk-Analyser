const mongoose = require('mongoose');
const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  funds: [
    {
      fundCode: String,
      amount: Number,
      holdings: Map,
      sectors: Map,
    },
  ],
});
module.exports = mongoose.model('Portfolio', PortfolioSchema);