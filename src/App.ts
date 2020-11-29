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

        const data = await this.pagesDAO.getPages();
              
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

        router.get('/sitemap.xml', function (req, res) {
            res.setHeader('Content-Type', 'application/xml');
            res.send(sm.toString());
        });
    }
};

export { App };
