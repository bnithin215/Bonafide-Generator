const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BonafideRequest = require('../models/BonafideRequest');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bonafide/request
// @desc    Submit a bonafide request
// @access  Private (User)
router.post('/request', [
  protect,
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('fatherName').trim().notEmpty().withMessage('Father name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('dateOfBirth').trim().notEmpty().withMessage('Date of birth is required'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required'),
  body('conduct').trim().notEmpty().withMessage('Conduct is required')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const bonafideRequest = await BonafideRequest.create({
      user: req.user._id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Bonafide request submitted successfully',
      request: bonafideRequest
    });
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting request'
    });
  }
});

// @route   GET /api/bonafide/my-requests
// @desc    Get all requests for logged in user
// @access  Private (User)
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await BonafideRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
});

// @route   GET /api/bonafide/all-requests
// @desc    Get all bonafide requests (Admin only)
// @access  Private (Admin)
router.get('/all-requests', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await BonafideRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email rollNumber department')
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all requests'
    });
  }
});

// @route   GET /api/bonafide/request/:id
// @desc    Get single bonafide request
// @access  Private
router.get('/request/:id', protect, async (req, res) => {
  try {
    const request = await BonafideRequest.findById(req.params.id)
      .populate('user', 'name email rollNumber department')
      .populate('approvedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
});

// @route   PUT /api/bonafide/approve/:id
// @desc    Approve a bonafide request
// @access  Private (Admin)
router.put('/approve/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const request = await BonafideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      request
    });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving request'
    });
  }
});

// @route   PUT /api/bonafide/reject/:id
// @desc    Reject a bonafide request
// @access  Private (Admin)
router.put('/reject/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const request = await BonafideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = 'rejected';
    request.approvedBy = req.user._id;
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting request'
    });
  }
});

// @route   DELETE /api/bonafide/request/:id
// @desc    Delete a bonafide request
// @access  Private (Admin or Owner)
router.delete('/request/:id', protect, async (req, res) => {
  try {
    const request = await BonafideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting request'
    });
  }
});

module.exports = router;
