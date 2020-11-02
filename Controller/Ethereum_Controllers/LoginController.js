const Usermodel = require('../../Model/user')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../../Common/config/env.config').jwt_secret;
const refreshtokenSecret = require("../../Common/config/env.config").refreshTokenSecret;
const db = require('../../db');

exports.login = (req, res) => {
    try {
        console.log(req.body);
        console.log('in login controller');
        const refreshId = req.body.userId + jwtSecret;
        const token = jwt.sign(req.body, jwtSecret);
        const refresh_token = jwt.sign(req.body, refreshtokenSecret);
        db.connection().query("UPDATE users SET accessToken = ?, refreshToken = ? WHERE id = ?", [token, refresh_token, req.body.userId], function (error, results, fields) {
            if (error) throw error;
            db.closeConnection();
            res.status(201).send({ accessToken: token, refreshToken: refresh_token });
        });
    } catch (err) {
        res.status(500).send({ errorcode: "500", messgage: 'internal server error' })
    }
};



exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        console.log('req.jwtttttttttttttttttttttttt..............', req.jwt);
        const token = jwt.sign(req.body, refreshtokenSecret);
        res.status(201).send({ id: token });
    } catch (err) {
        res.status(500).send({ errorcode: "500", messgage: 'internal server error' })
    }
};
