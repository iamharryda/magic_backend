import mongoose from 'mongoose';
import User from './src/entities/auth/auth.model.js';
import { mongoURI } from './src/core/config/config.js';
import RoleType from './src/lib/types.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to DB');

    const adminEmail = 'winstonharry96@gmail.com';
    
    // Check if exists
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log('Admin already exists. Updating password and role to ADMIN.');
      admin.password = '123456';
      admin.role = RoleType.ADMIN;
      admin.isVerified = true;
      await admin.save();
    } else {
      console.log('Creating new admin.');
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: '123456',
        role: RoleType.ADMIN,
        isVerified: true
      });
      await admin.save();
    }
    console.log('Admin seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
