const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();
//
router.get(`/`, async(req, res, next) => {
    return res.render("index", { title: "Trang chủ", layout: 'layouts/_layout', sizeMap: "" });
}).get(`/index`, async(req, res, next) => {
    return res.render("index", { title: "Trang chủ", layout: 'layouts/_layout', sizeMap: "" });
});
// ************************************************************************************************************

//**********************************************************************************************************************************
module.exports = router;