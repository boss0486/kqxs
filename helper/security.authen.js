const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Notyfication = require("../helper/helper.notification");
const SecurrityLib = require("../helper/helper.security");
const loginController = require("../model/controller/login.controller");


dotenv.config();
module.exports = async (req, res, next) => {
    //next();
    if (req.originalUrl.includes(`/api-2021-${process.env.API_SECRET}`)) {
        let token = req.header('auth-token');
        var userId = req.session.userId;
        if (userId != undefined || userId != null)  
            token = await loginController.getToken(userId); 
        // 
        if (!token)
            return res.json(await Notyfication.unAuthorized());
        //
        var result = await SecurrityLib.verifyToken(token);
        if (result)
            next();
        else
            return res.json(await Notyfication.unAuthorized());
    }
    else {
        // *********************************************************************************************************** 
        var url = req.originalUrl;
        if (url == undefined || url == null)
            url = ``
        else
            url = `?r=${url}`
        var userId = req.session.userId;
        if (userId == undefined || userId == null)
            return res.redirect(`/authen/login${url}`);
        //
        let token = await loginController.getToken(userId);
        if (token == undefined || token == null)
            return res.redirect(`/authen/login${url}`);
        //
        var result = await SecurrityLib.verifyToken(token);
        if (result)
            next();
        else
            return res.redirect(`/authen/login${url}`);
    }
};