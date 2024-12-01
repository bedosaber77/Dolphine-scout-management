const authRouter = require("./authroute");
const achievementRouter = require("./achievementRoute");
const announcementRouter = require("./announcementRoute");
const equipmentRouter = require("./equipmentRoute");
const mediaRouter = require("./mediaRoute");
const sponsorRouter = require("./sponsorRoute");
const transactionRouter = require("./transactionRoute");
const locationRouter = require("./locationRoute");
const apiRouter = require("express").Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/achievements", achievementRouter);
apiRouter.use("/announcements", announcementRouter);
apiRouter.use("/equipments", equipmentRouter);
apiRouter.use("/medias", mediaRouter);
apiRouter.use("/sponsors", sponsorRouter);
apiRouter.use("/transactions", transactionRouter);
apiRouter.use("/locations", locationRouter);

module.exports = apiRouter;
