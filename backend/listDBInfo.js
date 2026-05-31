const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const listCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in database:');
        collections.forEach(c => console.log(' - ' + c.name));

        // Let's also check if there's a database with a similar name
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('\nAll Databases on server:');
        dbs.databases.forEach(db => console.log(' - ' + db.name));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listCollections();
