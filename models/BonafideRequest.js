const FirestoreService = require('../services/firestore');

class BonafideRequestModel {
  constructor() {
    this.db = new FirestoreService('bonafide_requests');
  }

  /**
   * Validate bonafide request data
   */
  validate(data) {
    const errors = [];
    const requiredFields = [
      'userId',
      'studentName',
      'rollNumber',
      'fatherName',
      'department',
      'course',
      'academicYear',
      'dateOfBirth',
      'purpose',
      'conduct'
    ];

    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${field} is required`);
      }
    });

    if (data.status && !['pending', 'approved', 'rejected'].includes(data.status)) {
      errors.push('Invalid status value');
    }

    return errors;
  }

  /**
   * Create a new bonafide request
   */
  async create(requestData) {
    // Validate data
    const errors = this.validate(requestData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Prepare request data
    const request = {
      userId: requestData.userId,
      studentName: requestData.studentName.trim(),
      rollNumber: requestData.rollNumber.trim(),
      fatherName: requestData.fatherName.trim(),
      department: requestData.department.trim(),
      course: requestData.course.trim(),
      academicYear: requestData.academicYear.trim(),
      dateOfBirth: requestData.dateOfBirth.trim(),
      purpose: requestData.purpose.trim(),
      conduct: requestData.conduct.trim(),
      status: requestData.status || 'pending',
      adminNotes: requestData.adminNotes?.trim() || '',
      approvedBy: requestData.approvedBy || null,
      approvedAt: requestData.approvedAt || null,
      pdfGenerated: requestData.pdfGenerated || false
    };

    return await this.db.create(request);
  }

  /**
   * Find request by ID
   */
  async findById(id) {
    return await this.db.findById(id);
  }

  /**
   * Find requests by user ID
   */
  async findByUserId(userId) {
    return await this.db.findByField('userId', userId);
  }

  /**
   * Find requests by status
   */
  async findByStatus(status) {
    return await this.db.findByField('status', status);
  }

  /**
   * Get all requests
   */
  async findAll(options = {}) {
    return await this.db.findAll(options);
  }

  /**
   * Update request
   */
  async update(id, updateData) {
    // Prepare update data
    const allowedFields = [
      'studentName',
      'rollNumber',
      'fatherName',
      'department',
      'course',
      'academicYear',
      'dateOfBirth',
      'purpose',
      'conduct',
      'status',
      'adminNotes',
      'approvedBy',
      'approvedAt',
      'pdfGenerated'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    return await this.db.update(id, filteredData);
  }

  /**
   * Approve request
   */
  async approve(id, adminId, notes = '') {
    const updateData = {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date().toISOString(),
      adminNotes: notes
    };

    return await this.db.update(id, updateData);
  }

  /**
   * Reject request
   */
  async reject(id, adminId, notes = '') {
    const updateData = {
      status: 'rejected',
      approvedBy: adminId,
      approvedAt: new Date().toISOString(),
      adminNotes: notes
    };

    return await this.db.update(id, updateData);
  }

  /**
   * Delete request
   */
  async delete(id) {
    return await this.db.delete(id);
  }

  /**
   * Count requests
   */
  async count(status = null) {
    if (status) {
      return await this.db.count({ field: 'status', operator: '==', value: status });
    }
    return await this.db.count();
  }
}

module.exports = new BonafideRequestModel();
