const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  placeBid,
  getBidsForCrop,
  getMyBids,
  getHighestBid,
} = require('../controllers/bidController');

router.post('/', auth, placeBid);
router.get('/my/bids', auth, getMyBids);
router.get('/crop/:cropId/bids', getBidsForCrop);
router.get('/crop/:cropId/highest', getHighestBid);

module.exports = router;
