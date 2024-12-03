const authRouter = require("./authroute");
const achievementRouter = require("./achievementRoute");
const announcementRouter = require("./announcementRoute");
const equipmentRouter = require("./equipmentRoute");
const mediaRouter = require("./mediaRoute");
const sponsorRouter = require("./sponsorRoute");
const transactionRouter = require("./transactionRoute");
const locationRouter = require("./locationRoute");
const scoutAchievementsRouter = require("./scoutAchievementsRoute");
const apiRouter = require("express").Router();
const userRouter = require("./userRoute");
const authorization = require("../middlewares/authorization");

apiRouter.use("/auth", authRouter);
apiRouter.use("/achievements", achievementRouter);
apiRouter.use("/announcements", announcementRouter);
apiRouter.use("/equipment", equipmentRouter);
apiRouter.use("/media", mediaRouter);
apiRouter.use("/sponsors", sponsorRouter);
apiRouter.use("/transactions", transactionRouter);
apiRouter.use("/locations", locationRouter);
apiRouter.use("/scouts/:id/achievements", scoutAchievementsRouter);
apiRouter.use("/users", authorization, userRouter);

module.exports = apiRouter;
