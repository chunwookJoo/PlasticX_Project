const express = require("express");
const path = require("path");
const router = express.Router();
const slack = require(path.resolve(__dirname, "..", "config", "slack"));

// /web

router.get("/", (req, res) => {
  res.status(200).render("home");
});

module.exports = router;
