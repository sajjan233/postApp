const User = require("../models/User");


const cron = require("node-cron");
const Post = require("../models/Post");
const Device = require("../models/Device");
const sendPush = require("./sendNotification");

cron.schedule("*/10 * * * *", async () => {

  const now = new Date();

  try {
    const posts = await Post.find({
      nextSendAt: { $lte: now },   // 🔥 sirf jinka time aa gaya
      expireTime: { $gte: now },
      isCompleted: false,
      $expr: { $lt: ["$sentCount", "$maxAllowed"] }
    });

    for (let post of posts) {

      if (!post.maxAllowed || post.maxAllowed <= 0) continue;

      const intervalMinutes = (24 * 60) / post.maxAllowed;

      if (post.lastSentAt) {
        const diffMinutes = (now - post.lastSentAt) / 1000 / 60;

        if (diffMinutes < intervalMinutes) continue;
      }

      const devices = await Device.find(
        { fcmToken: { $exists: true, $ne: null } },
        { fcmToken: 1, _id: 0 }
      );

      const tokens = devices.map(d => d.fcmToken);
      if (!tokens.length) continue;

      const chunkArray = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size)
        );

      const tokenChunks = chunkArray(tokens, 500);

      for (let chunk of tokenChunks) {
        await sendPush(chunk, post.title, post.description);
      }

      post.sentCount += 1;
      post.lastSentAt = now;

      if (post.sentCount >= post.maxAllowed) {
        post.isCompleted = true;
      }

     

      post.nextSendAt = new Date(
        now.getTime() + intervalMinutes * 60 * 1000
      );
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