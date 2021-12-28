const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// layout


// set template engine
router.get(`/index`, async (req, res, next) => {
  return res.render("index", { title: "Trang chủ", sizeMap: "" });
}); 
// ************************************************************************************************************
 
//**********************************************************************************************************************************
module.exports = router;
