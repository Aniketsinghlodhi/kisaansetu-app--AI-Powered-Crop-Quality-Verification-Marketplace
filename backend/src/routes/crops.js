const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCrop,
  getCrops,
  getCropById,
  getFarmerCrops,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

router.post('/', auth, createCrop);
router.get('/', getCrops);
router.get('/farmer/my-crops', auth, getFarmerCrops);
router.get('/:id', getCropById);
router.put('/:id', auth, updateCrop);
router.delete('/:id', auth, deleteCrop);

module.exports = router;
