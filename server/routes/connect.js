const express = require("express");
const router = express.Router();

router.get("/connect", (req, res) => {
  const ref = req.query.ref || "";
console.log("ref",ref);

  const appLink = `post24://connect?ref=${ref}`;
  const playStore =
    "https://play.google.com/store/apps/details?id=com.sajjan_node_dev.post24";

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Connecting...</title>
        <meta charset="utf-8" />
        <script>
          window.location.href = "${appLink}";
          setTimeout(function () {
            window.location.href = "${playStore}";
          }, 1500);
        </script>
      </head>
      <body>
        <p>Opening Post24 App...</p>
      </body>
    </html>
  `);
});

module.exports = router;

