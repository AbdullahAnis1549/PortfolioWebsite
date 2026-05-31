const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/portfolio_db';
const ATLAS_URI = 'mongodb+srv://abdullahanis266_db_user:IOb3fnj6PqTNfi5d@cluster0.cbffxxl.mongodb.net/portfolio_db?appName=Cluster0';

async function migrate() {
    console.log('Starting MongoDB Migration...');
    let localClient, atlasClient;
    try {
        console.log('Connecting to local database...');
        localClient = await MongoClient.connect(LOCAL_URI);
        const localDb = localClient.db();

        console.log('Connecting to MongoDB Atlas...');
        atlasClient = await MongoClient.connect(ATLAS_URI);
        const atlasDb = atlasClient.db();

        console.log('Fetching collections from local database...');
        const collections = await localDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections.`);

        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName.startsWith('system.')) continue; // skip system collections

            console.log(`\nMigrating collection: "${colName}"...`);
            const localCol = localDb.collection(colName);
            const atlasCol = atlasDb.collection(colName);

            // Fetch local documents
            const docs = await localCol.find({}).toArray();
            console.log(`- Found ${docs.length} documents in "${colName}".`);

            if (docs.length > 0) {
                // Clear existing documents in Atlas for this collection first to avoid duplicates
                console.log(`- Clearing existing documents in Atlas collection "${colName}"...`);
                await atlasCol.deleteMany({});

                // Insert into Atlas
                console.log(`- Inserting ${docs.length} documents into Atlas...`);
                await atlasCol.insertMany(docs);
                console.log(`- Completed migration for "${colName}".`);
            } else {
                console.log(`- Collection "${colName}" is empty, skipping insert.`);
            }
        }
        console.log('\n🎉 MongoDB Migration completed successfully!');
    } catch (err) {
        console.error('\n❌ Migration failed:', err);
    } finally {
        if (localClient) await localClient.close();
        if (atlasClient) await atlasClient.close();
    }
}

migrate();
