const Bid = require('../models/Bid');
const Crop = require('../models/Crop');
const User = require('../models/User');

const placeBid = async (req, res) => {
  try {
    const { cropId, bidAmount } = req.body;
    const buyerId = req.userId;

    if (!cropId || !bidAmount) {
      return res.status(400).json({ success: false, message: 'Crop ID and bid amount are required' });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Check if bid is higher than current
    const minimumBid = crop.currentBid > 0 ? crop.currentBid + 1 : crop.basePrice;
    if (bidAmount < minimumBid) {
      return res.status(400).json({ 
        success: false, 
        message: `Bid must be at least ₹${minimumBid}` 
      });
    }

    // Check buyer has sufficient wallet balance
    const buyer = await User.findById(buyerId);
    if (buyer.walletBalance < bidAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient wallet balance. You have ₹${buyer.walletBalance}` 
      });
    }

    // Create bid
    const bid = new Bid({
      cropId,
      buyerId,
      bidAmount,
    });

    await bid.save();

    // Update crop
    crop.currentBid = bidAmount;
    crop.bidCount += 1;
    crop.highestBidder = buyerId;
    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid,
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ success: false, message: 'Error placing bid', error: error.message });
  }
};

const getBidsForCrop = async (req, res) => {
  try {
    const { cropId } = req.params;

    const bids = await Bid.find({ cropId })
      .populate('buyerId', 'name mobile location')
      .sort({ bidAmount: -1 });

    res.json({ success: true, bids });
  } catch (error) {
    console.error('Get bids for crop error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bids', error: error.message });
  }
};

const getMyBids = async (req, res) => {
  try {
    const buyerId = req.userId;

    const bids = await Bid.find({ buyerId })
      .populate('cropId', 'cropName basePrice currentBid aiGrade category')
      .sort({ createdAt: -1 });

    res.json({ success: true, bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bids', error: error.message });
  }
};

const getHighestBid = async (req, res) => {
  try {
    const { cropId } = req.params;

    const highestBid = await Bid.findOne({ cropId })
      .populate('buyerId', 'name')
      .sort({ bidAmount: -1 });

    res.json({ success: true, highestBid });
  } catch (error) {
    console.error('Get highest bid error:', error);
    res.status(500).json({ success: false, message: 'Error fetching highest bid', error: error.message });
  }
};

module.exports = { placeBid, getBidsForCrop, getMyBids, getHighestBid };
