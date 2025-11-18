const FirestoreService = require('../services/firestore');
const bcrypt = require('bcryptjs');

class UserModel {
  constructor() {
    this.db = new FirestoreService('users');
  }

  /**
   * Validate user data
   */
  validate(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Please provide a name');
    }

    if (!data.email || data.email.trim() === '') {
      errors.push('Please provide an email');
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      errors.push('Please provide a valid email');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Create a new user
   */
  async create(userData) {
    // Validate data
    const errors = this.validate(userData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await this.db.findOneByField('email', userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Prepare user data
    const user = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      role: userData.role || 'user',
      rollNumber: userData.rollNumber?.trim() || '',
      department: userData.department?.trim() || '',
      course: userData.course?.trim() || '',
      fatherName: userData.fatherName?.trim() || '',
      dateOfBirth: userData.dateOfBirth?.trim() || ''
    };

    return await this.db.create(user);
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    return await this.db.findById(id);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await this.db.findOneByField('email', email.toLowerCase());
  }

  /**
   * Find user by email with password (for authentication)
   */
  async findByEmailWithPassword(email) {
    const user = await this.findByEmail(email);
    return user; // In Firestore, password is not excluded by default
  }

  /**
   * Update user
   */
  async update(id, updateData) {
    // Don't allow updating password or email through this method
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    return await this.db.update(id, updateData);
  }

  /**
   * Delete user
   */
  async delete(id) {
    return await this.db.delete(id);
  }

  /**
   * Get all users
   */
  async findAll(options = {}) {
    return await this.db.findAll(options);
  }

  /**
   * Count users
   */
  async count() {
    return await this.db.count();
  }
}

module.exports = new UserModel();
