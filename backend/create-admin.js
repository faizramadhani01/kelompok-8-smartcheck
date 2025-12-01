require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const adminName = 'admin';
    const adminEmail = 'admin@smartcheck.com';
    const adminPassword = 'admin';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert into users table
    // role_id: 1 = Admin, 3 = Customer
    const [result] = await pool.query(
      'INSERT INTO users (role_id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [1, adminName, adminEmail, hashedPassword]
    );

    console.log('✅ Admin user created successfully!');
    console.log('   ID:', result.insertId);
    console.log('   Username:', adminName);
    console.log('   Email:', adminEmail);
    console.log('   Role ID: 1 (Admin)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
    process.exit(1);
  }
}

createAdmin();
