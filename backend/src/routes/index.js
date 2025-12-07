const express = require('express');
const authRoutes = require('./auth');
const cropRoutes = require('./crops');
const bidRoutes = require('./bids');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/crops', cropRoutes);
router.use('/bids', bidRoutes);

module.exports = router;
