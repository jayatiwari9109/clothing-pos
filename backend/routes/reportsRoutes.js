const express = require("express");
const router = express.Router();

router.get("/sales", (req, res) => {
  res.json({ grossSales: 41200, totalGST: 2060, netProfit: 23800 });
});

module.exports = router;