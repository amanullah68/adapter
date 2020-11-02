const bcrypt = require('bcryptjs');
var db = require('../db');

var object = require('../services/object');

exports.haValidFields = (req, res, next) => {
    var errors = [];
    if (!object.isEmpty(req.body)) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (!req.body.firstName) {
            errors.push('Missing firstName field');
        }
        if (!req.body.lastName) {
            errors.push('Missing lastName field');
        }
        if (!req.body.permissionLevel) {
            errors.push('Missing permissionLevel field');
        }

        if (errors.length) {
            return res.status(400).send({ errors: errors.join(',') });
        } else {
            return next();
        }
    }
    else return res.status(400).send({ errors: 'Email,password,firstName,lastName,permissionLevel fields are missing' });

}

exports.hasAuthValidFields = (req, res, next) => {
    var errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({ errors: errors.join(',') });
        } else {
            return next();
        }
    } else {
        return res.status(400).send({ errors: 'Missing email and password fields' });
    }
}


exports.isPasswordAndUserMatch = (req, res, next) => {
    console.log('in isPasswordAndUserMatch');
    db.connection().query('SELECT * FROM users where email=?', req.body.email, function (error, results, fields) {
        if (error) throw error;
        if (!results) return    res.status(404).send({ errorcode: "404", messgage: 'invalid user/password' });
        db.closeConnection();
        const user = results[0];
        const salt = user.password;
        const hash = bcrypt.compareSync(req.body.password, salt);
        if(!hash)
            return  res.status(404).send({ errorcode: "404", messgage: 'invalid user/password' })
        else {
            req.body = {
                userId:user.id,
                email: user.email,
                permissionLevel: user.permissionLevel,
                provider: 'email',
                name: user.firstName + ' ' + user.lastName
            }
        }
        return next();
    });
}

