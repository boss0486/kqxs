 const express = require('express');
 const router = express.Router();

 //  const MatchedKqxsModel = require("../../model/entities/app_kqxs_matched");
 //  const BosoCategoryModel = require('../../model/entities/app_boso_category');
 const AreaGeographical = require("../../model/entities/area_geographical");

 // read .env file
 require('dotenv').config();
 router.get(`/index`, async(req, res, next) => {
     var areas = await AreaGeographical.find({}, { __v: 0, icon: 0, _id: 0 });
     return res.render("order/index", {
         title: "Đơn hàng: danh sách",
         layout: './layouts/_layout',
         sizeMap: "",
         models: areas
     });
 });
 // ***********************************************************************************************************************************
 module.exports = router;