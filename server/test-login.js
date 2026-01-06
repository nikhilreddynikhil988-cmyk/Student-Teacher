const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user');

async function testLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // List all users
        const users = await User.find({});
        console.log('\n📋 Users in database:', users.length);

        if (users.length === 0) {
            console.log('⚠️  No users found! You need to register first.');
            process.exit(0);
        }

        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User:`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
        });

        // Test password comparison for first user
        if (users.length > 0) {
            const testUser = users[0];
            console.log('\n🔍 Testing password comparison for first user...');
            console.log('Enter the password you used during registration to test:');

            // For testing, let's check if a common password works
            const testPasswords = ['password', 'test123', 'admin123', '123456'];

            for (const pwd of testPasswords) {
                const isMatch = await bcrypt.compare(pwd, testUser.password);
                if (isMatch) {
                    console.log(`✅ Password "${pwd}" matches for ${testUser.email}!`);
                }
            }
        }

        await mongoose.connection.close();
        console.log('\n✅ Test completed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
