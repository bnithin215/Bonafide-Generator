const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BonafideRequest = require('../models/BonafideRequest');
const User = require('../models/User');
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
      userId: req.user.id,
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
    const requests = await BonafideRequest.findByUserId(req.user.id);

    // Populate approvedBy user info
    const requestsWithApprover = await Promise.all(
      requests.map(async (request) => {
        if (request.approvedBy) {
          const approver = await User.findById(request.approvedBy);
          if (approver) {
            request.approverInfo = {
              name: approver.name,
              email: approver.email
            };
          }
        }
        return request;
      })
    );

    res.status(200).json({
      success: true,
      count: requestsWithApprover.length,
      requests: requestsWithApprover
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

    let requests;
    if (status) {
      requests = await BonafideRequest.findByStatus(status);
    } else {
      requests = await BonafideRequest.findAll({
        orderBy: { field: 'createdAt', direction: 'desc' }
      });
    }

    // Populate user and approvedBy info
    const requestsWithInfo = await Promise.all(
      requests.map(async (request) => {
        const user = await User.findById(request.userId);
        if (user) {
          request.userInfo = {
            name: user.name,
            email: user.email,
            rollNumber: user.rollNumber,
            department: user.department
          };
        }

        if (request.approvedBy) {
          const approver = await User.findById(request.approvedBy);
          if (approver) {
            request.approverInfo = {
              name: approver.name,
              email: approver.email
            };
          }
        }

        return request;
      })
    );

    res.status(200).json({
      success: true,
      count: requestsWithInfo.length,
      requests: requestsWithInfo
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
    const request = await BonafideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    // Populate user info
    const user = await User.findById(request.userId);
    if (user) {
      request.userInfo = {
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department
      };
    }

    // Populate approver info
    if (request.approvedBy) {
      const approver = await User.findById(request.approvedBy);
      if (approver) {
        request.approverInfo = {
          name: approver.name,
          email: approver.email
        };
      }
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

    const updatedRequest = await BonafideRequest.approve(
      req.params.id,
      req.user.id,
      adminNotes || ''
    );

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      request: updatedRequest
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

    const updatedRequest = await BonafideRequest.reject(
      req.params.id,
      req.user.id,
      adminNotes || ''
    );

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request: updatedRequest
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
    if (request.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await BonafideRequest.delete(req.params.id);

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
