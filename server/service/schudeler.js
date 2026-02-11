const User = require("../models/User");
const cron = require("node-cron");


const cron = require("node-cron");
const Post = require("../models/Post");
const Device = require("../models/Device");
const sendPush = require("./sendNotification");

cron.schedule("*/1 * * * *", async () => {  // every 1 minute
  console.log("Checking scheduled notifications...");

  const now = new Date();

  try {
    const posts = await Post.find({
      startTime: { $lte: now },
      expireTime: { $gte: now },
      isCompleted: false,
      $expr: { $lt: ["$sentCount", "$maxAllowed"] }
    });

    for (let post of posts) {

      const intervalMinutes = (24 * 60) / post.maxAllowed;

      // 🔥 First time (never sent)
      if (!post.lastSentAt) {
        // allow send immediately
      } else {
        const diffMinutes = (now - post.lastSentAt) / 1000 / 60;

        if (diffMinutes < intervalMinutes) {
          continue; // skip if interval not completed
        }
      }

      // 🔥 Get tokens
      const devices = await Device.find({});
      const tokens = devices.map(d => d.fcmToken);

      if (!tokens.length) continue;

      await sendPush(tokens, post.title, post.description);

      post.sentCount += 1;
      post.lastSentAt = now;

      if (post.sentCount >= post.maxAllowed) {
        post.isCompleted = true;
      }

      await post.save();
    }

  } catch (err) {
    console.error("Scheduler error:", err);
  }
});


cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏰ Checking expired notification subscriptions");

    await User.updateMany(
      {
        "notificationSubscription.isActive": true,
        "notificationSubscription.endDate": { $lt: new Date() }
      },
      {
        $set: { "notificationSubscription.isActive": false }
      }
    );

  } catch (err) {
    console.error("Scheduler error:", err);
  }
});