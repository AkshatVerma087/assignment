const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = require('../src/models/user.model');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

async function createOrUpdateAdmin() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await userModel.findOne({ email: ADMIN_EMAIL });
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (existingUser) {
    existingUser.name = ADMIN_NAME;
    existingUser.password = hashedPassword;
    existingUser.role = 'admin';
    await existingUser.save();

    console.log(`Updated existing user as admin: ${ADMIN_EMAIL}`);
  } else {
    await userModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log(`Created new admin user: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

createOrUpdateAdmin()
  .then(() => {
    console.log('Admin setup completed successfully');
  })
  .catch(async (err) => {
    console.error('Failed to create admin user:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  });
