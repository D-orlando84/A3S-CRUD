const MongoClient = require('mongodb').MongoClient;

class DAO {
    protected db;

    public async getDb() {
        require('dotenv').config();
        try {
            const db = await MongoClient.connect(process.env.MONGO_SERV);
            return db.db('a3s');
        } catch (err) {
            console.log('il ya eu un problème' + err);
        }
    }
}

export { DAO };