const Router = require('express').Router();
const troopController = require('../controllers/troopController');

Router.get('/', troopController.getAllTroops);
Router.get('/:id', troopController.getTroopById);
Router.get('/leader/:id', troopController.getTroopByLeader);
Router.post('/', troopController.addTroop);
Router.put('/:id', troopController.updateTroop);
Router.delete('/:id', troopController.deleteTroop);
Router.get('/:id/scouts', troopController.getScoutsInTroop);
Router.post('/:id/scouts', troopController.addScoutToTroop);
Router.delete('/:id/scouts/:scout_id', troopController.removeScoutFromTroop);

module.exports = Router;
