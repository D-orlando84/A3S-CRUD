import { DAO } from './DAO';
const ObjectId = require('mongodb').ObjectId;

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
            const pagesId = await collection.find({"_id":ObjectId(_id)}).toArray();
            return pagesId;

        } catch (err) {
            throw new Error("Impossible de trouver la page" + err);
        }
    }

    public async postPage(objet){
        try{
            const db = await super.getDb();
            const collection = db.collection('pages');
            const result = await collection.updateOne({"_id":ObjectId(objet._id)},{$set:{"id":objet.id, "title": objet.title, "content": objet.content, "order":objet.order, "type": objet.type, "meta_title": objet.meta_title, "meta_description": objet.meta_description}});
            return result;
        } catch(err){
            throw new Error("Impossible d'insérer du contenue" +err);
        }
    }

    public async postNewPage(item){
        try{
            const db = await super.getDb();
            const collection = db.collection('pages');
            const newPage = await collection.insertOne(item);
            return newPage;
        } catch{

        }
    }

    public async deletePage(_id){
        try{
            const db = await super.getDb();
            const collection = db.collection('pages');
            const delPage = await collection.deleteOne(_id);
            return delPage;
        } catch(err){
            throw new Error("Impossible de suprimer le contenue"+err);
        }
    }
}
export { PagesDAO };

//UPDATE table SET colonne = 'valeur'
