const User = require("../models/User");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  await User.updateMany(
    { "notificationSubscription.endDate": { $lt: new Date() } },
    { "notificationSubscription.isActive": false }
  );
});
