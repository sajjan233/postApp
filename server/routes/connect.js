const express = require("express");
const router = express.Router();

router.get("/connect", (req, res) => {
  const ref = req.query.ref || "";

  // Play Store referral link
  const playStoreLink = `https://play.google.com/store/apps/details?id=com.sajjan_node_dev.post24&referrer=utm_content=${ref}`;

  // App deep link
  const appLink = `post24://connect?ref=${ref}`;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Connecting...</title>
        <script>
          // 1️⃣ Try open app directly
          const openApp = () => {
            window.location = "${appLink}";
            setTimeout(() => {
              // 2️⃣ Fallback: Play Store link if app not installed
              window.location = "${playStoreLink}";
            }, 1500);
          };

          openApp();
        </script>
      </head>
      <body>
        <p>Redirecting to Post24 App...</p>
        <a href="${playStoreLink}">Click here if not redirected</a>
      </body>
    </html>
  `);
});



module.exports = router;
