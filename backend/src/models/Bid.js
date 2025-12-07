const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'won', 'lost'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Bid', bidSchema);
