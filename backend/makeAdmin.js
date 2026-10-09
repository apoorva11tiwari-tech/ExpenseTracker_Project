const mongoose = require('mongoose');
const User = require('./models/users');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    const email = 'Admincashmate@gmail.com';
    const password = 'cashmate123';

    let admin = await User.findOne({ email });

    if (admin) {
      admin.password = password;
      admin.role = 'admin';

      await admin.save();

      console.log('================================');
      console.log('ADMIN UPDATED SUCCESSFULLY');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Role:', admin.role);
      console.log('================================');
    } else {
      admin = await User.create({
        email: email,
        password: password,
        role: 'admin'
      });

      console.log('================================');
      console.log('ADMIN CREATED SUCCESSFULLY');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Role:', admin.role);
      console.log('================================');
    }

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
};

createAdmin();