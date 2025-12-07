const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Cereals', 'Pulses', 'Oilseeds', 'Cotton', 'Sugarcane', 'Spices', 'Vegetables', 'Fruits', 'Other'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'Qt',
      enum: ['Kg', 'Qt', 'Ton', 'Bag'],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    aiGrade: {
      type: String,
      default: 'N/A',
      enum: ['A', 'B', 'C', 'N/A'],
    },
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'sold', 'expired'],
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    bidCount: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
