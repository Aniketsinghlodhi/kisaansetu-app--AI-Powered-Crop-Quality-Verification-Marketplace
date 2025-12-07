const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, mobile, password, email, role, location } = req.body;

    // Validation
    if (!name || !mobile || !password || !role || !location) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate role
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this mobile or email' });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      mobile: mobile.trim(),
      passwordHash: password,
      email: email?.trim() || undefined,
      role,
      location: location.trim(),
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: 'Mobile and password are required' });
    }

    // Find user
    const user = await User.findOne({ mobile: mobile.trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

module.exports = { signup, login, getProfile };
