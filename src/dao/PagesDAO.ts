import { DAO } from './DAO';

class PagesDAO extends DAO {
    private _pages: any = null;

    constructor() {
        super();
    }
    // recuperation de toutes les pages
    public async getPages() {
        try {
            const db = await super.getDb();
            const collection = db.collection('pages');
            const pages = await collection.find().sort({ order: 1 }).toArray();
            console.log(pages);
            return pages;
        } catch (err) {
            throw new Error("Impossible de récupérer les pages." + err);
        }
    }
}
export { PagesDAO };