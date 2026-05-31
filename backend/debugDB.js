const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Home = require('./src/models/Home');
const About = require('./src/models/About');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Home Content ---');
        const home = await Home.findOne();
        console.log(JSON.stringify(home, null, 2));

        console.log('--- About Content ---');
        const about = await About.findOne();
        console.log(JSON.stringify(about, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
