const User = require('../models/users');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. ADMIN LOGIN
// ==========================================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log("Login body:", req.body);
    // Check email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET ,
      {
        expiresIn: '1d'
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// 2. GET ALL USERS
// ==========================================
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select('-password');

    return res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {

    console.error('Get All Users Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// 3. GET ADMIN STATS
// ==========================================
exports.getAdminStats = async (req, res) => {
  try {

    // Total users
    const totalUsers = await User.countDocuments();

    // Total expense amount
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: '$amount'
          }
        }
      }
    ]);

    const totalExpensesAmount =
      totalExpenses.length > 0
        ? totalExpenses[0].totalAmount
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers,
        totalExpensesAmount: totalExpensesAmount
      }
    });

  } catch (error) {

    console.error('Admin Stats Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};