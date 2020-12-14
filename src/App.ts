import * as express from 'express';
import * as sitemap from 'sitemap';
import { json, raw, text, urlencoded } from 'body-parser';
import * as path from 'path';
import { PagesDAO } from "./dao/PagesDAO";
const bcrypt = require('bcrypt');
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
            for (let i = 0; i < data.length; i++) {
                page.push(data[i]);
            }
            return res.render('index', { 'data': page });
        });
        router.get('/modif', async function (req, res) {
            const id = req.query._id;
            //j'appelle la base de données, dans la collection pages pour récupérer tout le contenu dont l'id correspond à id
            const data = await new PagesDAO().getPageId(id);
            return res.render('modif', { 'page': data[0] });
        });
        //voici ce que je fais si je reçois un appel post sur /modif
        router.post('/modif', async function (req, res) {
            try {
                const item = {
                    _id: req.query._id,
                    id: req.body.id,
                    title: req.body.title,
                    content: req.body.content,
                    order: req.body.order,
                    type: req.body.type,
                    meta_title: req.body.meta_title,
                    meta_description: req.body.meta_description
                };
                const data = await new PagesDAO().postPage(item);
                return res.redirect('/');
            } catch (err) {
                return res.status(500);
            }
        })
        router.get('/newPage', async function (req, res) {
            const id = req.query._id;
            const data = await new PagesDAO().getPageId(id);
            return res.render('newPage', { 'page': data[0] });
        });

        router.post('/newPage', async function (req, res) {
            try {
                const objet = {
                    id: req.body.id,
                    title: req.body.title,
                    content: req.body.content,
                    order: req.body.order,
                    type: req.body.type,
                    meta_title: req.body.meta_title,
                    meta_description: req.body.meta_description
                }
                const data = await new PagesDAO().postNewPage(objet);
                return res.redirect('/');
            } catch (err) {
                return res.status(500);
            }
        })

        router.post('/delete', async function (req, res) {
            const _id = req.query._id;
            try {
                const data = await new PagesDAO().deletePage(_id);
                return res.redirect('/');
            } catch (err) {
                return res.status(500);
            }
        })

        router.get('/test', async function (req, res) {
            const data = await new PagesDAO().getAnyPages();
            return res.json(data);
        });

        router.post('/test', async function (req, res) {
            try {
                const objet = {
                    id: req.body.id,
                    title: req.body.title,
                    content: req.body.content,
                    order: req.body.order,
                    type: req.body.type,
                    meta_title: req.body.meta_title,
                    meta_description: req.body.meta_description
                }
                const data = await new PagesDAO().postNewPage(objet);
                return res.json(data);
            } catch (err) {
                return res.status(500);
            }
        })

        router.get('/register', async function (req, res) {
            const id = req.query._id;
            const data = await new PagesDAO().getUser(id);
            return res.render('register', { 'user': data[0] });
        });

        router.post('/api/users', function (req, res) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    try {
                        const objet = {
                            name: req.body.name,
                            password: hash
                        }
                        const data = await new PagesDAO().postUser(objet);
                        return res.redirect('/');
                    } catch (err) {

                    }
                })
            })
        })
        router.post('/register', async function (req, res) {
            try {
                const objet = {
                    utilisateur: req.body.utilisateur,
                    password: req.body.password
                }
                const data = await new PagesDAO().postUser(objet);
                return res.redirect('/');
            } catch (err) {
                return res.status(500);
            }
        })
    }
};

export { App };
