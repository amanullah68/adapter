const bcrypt = require('bcryptjs');

var db = require('../../db');

exports.register = (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    db.connection().query("INSERT INTO users SET ? ", { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hashedPassword, permissionLevel: req.body.permissionLevel }, function (error, results, fields) {
        if (error) throw error;
        db.closeConnection();
        console.log('id: ' + results.insertId);
        res.status(201).send({ id: results.insertId });
    });
}