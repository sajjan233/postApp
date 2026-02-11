const express = require("express");
const router = express.Router();

router.get("/connect", (req, res) => {
  const ref = req.query.ref || "";
  const packageName = "com.sajjan_node_dev.post24";

  const playStoreWeb =
    `https://play.google.com/store/apps/details?id=${packageName}` +
    (ref ? `&referrer=utm_content=${ref}` : "");

  const intentLink =
    `intent://connect?ref=${ref}` +
    `#Intent;scheme=post24;package=${packageName};end`;

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Opening Post24…</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script>
    // Try open app via intent (BEST for Android)
    window.location.href = "${intentLink}";

    // Fallback to Play Store
    setTimeout(() => {
      window.location.href = "${playStoreWeb}";
    }, 1200);
  </script>
</head>
<body style="font-family: Arial; text-align:center; padding-top:40px">
  <h3>Opening Post24 App…</h3>
  <p>If nothing happens, tap below</p>
  <a href="${playStoreWeb}" style="font-size:16px">Open Play Store</a>
</body>
</html>
`);
});

module.exports = router;
