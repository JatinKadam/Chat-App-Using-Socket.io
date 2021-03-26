const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("sv is running2");
});
module.exports = router;
