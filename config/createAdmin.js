const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists by email
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tkrcollege.edu';
    const adminExists = await User.findByEmail(adminEmail);

    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });

      console.log('Default admin user created successfully');
      console.log('Email:', admin.email);
      console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
      console.log('⚠️  Please change the admin password after first login!');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

module.exports = createDefaultAdmin;
