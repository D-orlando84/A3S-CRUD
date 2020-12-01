import * as express from 'express';
import * as sitemap from 'sitemap';
import { json, raw, text, urlencoded } from 'body-parser';
import * as path from 'path';
import { PagesDAO } from "./dao/PagesDAO";
const config = require('../config.json');

class App {
    public express;
    private pagesDAO: PagesDAO;

    constructor() {
        this.express = express();
        this.pagesDAO = new PagesDAO();
        this.mountRoutes();
    }

    private async mountRoutes(): Promise<void> {
        const router = express.Router();
        const sm = sitemap.createSitemap({
            hostname: "https://" + config.url,
            cacheTime: 600000
        });
              
        this.express.use(json());
        this.express.use(raw());
        this.express.use(text());
        this.express.use(urlencoded({ extended: true }));

        this.express.use('/', router);


        function setCustomCacheControl(_res) {
            _res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        }
        
        this.express.use(express.static(path.join(__dirname, '../static'),
            {
                "maxAge": '1d',
                "setHeaders": setCustomCacheControl
            }));
        this.express.set('views', path.join(__dirname, '../views'));
        this.express.set('view engine', 'pug');
        this.express.set('view cache', true);

        router.get('/', async function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            const data = await new PagesDAO().getPages();
            let page = [];
            for (let i=0;i<data.length;i++){
                page.push(data[i]);
            }
            return res.render('index',{'data': page});
        });
        router.get('/modif', async function (req,res){
            const id= req.query._id;
            //j'appelle la base de données, dans la collection pages pour récupérer tout le contenu dont l'id correspond à id
            const data = await new PagesDAO().getPageId(id);
            return res.render('modif',{'page': data[0]});
        });
        router.post('/modif', async function (req,res){
            const data = await new PagesDAO().postPage();
            const item = {
                id: req.body.id,
                title: req.body.title,
                content: req.body.content,
                order: req.body.order,
                type: req.body.type,
                meta_title: req.body.meta_title,
                meta_description: req.body.meta_description
            }
        })
    }
};

export { App };
