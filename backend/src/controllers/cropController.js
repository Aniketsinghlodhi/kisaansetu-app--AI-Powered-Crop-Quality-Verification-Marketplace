const Crop = require('../models/Crop');
const User = require('../models/User');

const createCrop = async (req, res) => {
  try {
    const { cropName, category, quantity, unit, basePrice, imageUrl, location, description } = req.body;
    const farmerId = req.userId;

    if (!cropName || !category || !quantity || !basePrice || !location) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Mock AI grading - assign random grade
    const grades = ['A', 'B', 'C'];
    const aiGrade = grades[Math.floor(Math.random() * grades.length)];
    const qualityScore = Math.floor(Math.random() * 40 + 60); // 60-100

    const crop = new Crop({
      farmerId,
      cropName: cropName.trim(),
      category,
      quantity,
      unit: unit || 'Qt',
      basePrice,
      imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Crop+Image',
      aiGrade,
      qualityScore,
      location: location.trim(),
      description: description?.trim() || '',
    });

    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Crop listed successfully',
      crop,
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ success: false, message: 'Error creating crop', error: error.message });
  }
};

const getCrops = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, search } = req.query;
    const query = { status: 'active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.cropName = { $regex: search, $options: 'i' };
    }

    const crops = await Crop.find(query)
      .populate('farmerId', 'name location rating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ success: false, message: 'Error fetching crops', error: error.message });
  }
};

const getCropById = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await Crop.findById(id).populate('farmerId', 'name location rating');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.json({ success: true, crop });
  } catch (error) {
    console.error('Get crop by ID error:', error);
    res.status(500).json({ success: false, message: 'Error fetching crop', error: error.message });
  }
};

const getFarmerCrops = async (req, res) => {
  try {
    const farmerId = req.userId;

    const crops = await Crop.find({ farmerId }).sort({ createdAt: -1 });

    res.json({ success: true, crops });
  } catch (error) {
    console.error('Get farmer crops error:', error);
    res.status(500).json({ success: false, message: 'Error fetching farmer crops', error: error.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.userId;
    const updateData = req.body;

    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Only farmer who created can update
    if (crop.farmerId.toString() !== farmerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crop' });
    }

    // Only allow update if no bids
    if (crop.bidCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot update crop with existing bids' });
    }

    Object.assign(crop, updateData);
    await crop.save();

    res.json({ success: true, message: 'Crop updated successfully', crop });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ success: false, message: 'Error updating crop', error: error.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.userId;

    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmerId.toString() !== farmerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    if (crop.bidCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete crop with existing bids' });
    }

    await Crop.deleteOne({ _id: id });
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ success: false, message: 'Error deleting crop', error: error.message });
  }
};

module.exports = { createCrop, getCrops, getCropById, getFarmerCrops, updateCrop, deleteCrop };
