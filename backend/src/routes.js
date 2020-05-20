const { Router } = require('express')

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');
const BlingController = require('./controllers/BlingController');

const routes = Router();

routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);

routes.get('/search', SearchController.index);
routes.get('/editBling', BlingController.edit);
routes.get('/getBling', BlingController.get);
routes.get('/paiBling', BlingController.corrigePai);

module.exports = routes;