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
            const pages = await collection.find({"type": 'page'}).sort({ order: 1 }).toArray();
            return pages;
        } catch (err) {
            throw new Error("Impossible de récupérer les pages." + err);
        }
    }

    public async getPageId(_id){
        try {
            const db = await super.getDb();
            const collection = db.collection('pages');
            const pagesId = await collection.find({"_id":_id}).toArray();
            return pagesId;

        } catch (err) {
            throw new Error("Impossible de trouver la page" + err);
        }
    }

    public async postPage(){
        try{
            const db = await super.getDb();
            const collection = db.collection('pages'); 
            const doc = {id: "toto", title: "", content: "", order: 1, type: "page", meta_title: "Mention Légles", meta_description: ""}
            const result = await collection.insertOne(doc);
            return result;
        } catch(err){
            throw new Error("Impossible d'insérer du contenue");
        }
    }
}
export { PagesDAO };