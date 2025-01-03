const authRouter = require('./authroute');
const achievementRouter = require('./achievementRoute');
const announcementRouter = require('./announcementRoute');
const equipmentRouter = require('./equipmentRoute');
const mediaRouter = require('./mediaRoute');
const sponsorRouter = require('./sponsorRoute');
const transactionRouter = require('./transactionRoute');
const locationRouter = require('./locationRoute');
const parentRouter = require('./parentRoute');
const apiRouter = require('express').Router();
const userRouter = require('./userRoute');
const scoutRouter = require('./scoutRoute');
const troopRouter = require('./troopRoute');
const scoutLeaderRouter = require('./scoutleaderRoute');
const eventRouter = require('./eventRoute');
const gatheringRouter = require('./gatheringRoute');
const campRouter = require('./campRoute');
const statisticsRoute = require('./statisticsRoute');
const db = require('../config/DBmanager');
const authorization = require('../middlewares/authorization');

apiRouter.use('/auth', authRouter);
apiRouter.use('/achievements', authorization, achievementRouter);
apiRouter.use('/announcements', authorization, announcementRouter);
apiRouter.use('/equipment', authorization, equipmentRouter);
apiRouter.use('/media', authorization, mediaRouter);
apiRouter.use('/sponsors', authorization, sponsorRouter);
apiRouter.use('/transactions', authorization, transactionRouter);
apiRouter.use('/locations', authorization, locationRouter);
apiRouter.use('/gatherings', authorization, gatheringRouter);
apiRouter.use('/camps', authorization, campRouter);
apiRouter.use('/locations', authorization, locationRouter);
apiRouter.use('/users', authorization, userRouter);
apiRouter.use('/scouts', authorization, scoutRouter);
apiRouter.use('/troops', authorization, troopRouter);
apiRouter.use('/scoutleaders', authorization, scoutLeaderRouter);
apiRouter.use('/events', authorization, eventRouter);
apiRouter.use('/gatherings', authorization, gatheringRouter);
apiRouter.use('/camps', authorization, campRouter);
apiRouter.use('/parents', authorization, parentRouter);
apiRouter.use('/statistics', authorization, statisticsRoute);

apiRouter.get('/', async (req, res) => {
  db.testQuery(req, res);
});

module.exports = apiRouter;
