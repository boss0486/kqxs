const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

const HelperLogger = require('../helper/helper.logger');
// ***********************************************************************************************************************************
const orderController = require("../model/controller/order.controller");
// api get all
router.post(`/all`, async(req, res, next) => {
    return res.json(await orderController.dataListEx(req.body, req.header('auth-token'), req.session));
});
// api get by id
router.get(`/:id`, async(req, res, next) => {
    return res.json(await orderController.get(req.params.id));
});
// api create
router.post(`/buy`, async(req, res, next) => {
    HelperLogger.logged(`buy1: ${JSON.stringify(req.body)}`);
    return res.json(await orderController.buy(req.body, req.header('auth-token')));
});
// api check buy
router.post(`/check-buy`, async(req, res, next) => {
    return res.json(await orderController.checkBuy(req.body.areaId, req.body.bosoId, req.header('auth-token')));
});
// api delete
router.delete(`/delete`, async(req, res, next) => {
    return res.json(await bosoController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;