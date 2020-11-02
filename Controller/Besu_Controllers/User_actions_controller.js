const Usermodel = require('../../Model/user');
const db = require('../../db');

exports.list = (req, res) => {
    db.connection().query('SELECT * FROM users', function (error, users, fields) {
        if (error) throw error;
        db.closeConnection();
        res.status(201).send({ users });
    });
}

exports.getbyid = (req, res) => {
    db.connection().query('SELECT * FROM users WHERE id = ?', req.params.userId, function (error, user, fields) {
        if (error) throw error;
        db.closeConnection();
        if (user && user.length > 0) res.status(501).send(user);
        else return res.status(401).send();
    });
}

exports.RemovebyId = (req, res) => {
    db.connection().query('DELETE FROM users WHERE id = ?', req.params.userId, function (error, user, fields) {
        if (error) throw error;
        db.closeConnection();
        if (user.affectedRows) res.status(200).send({ message: "Deleted successful" });
        else return res.status(401).send({ message: "Record not found" });
    });
}

exports.patchById = (req, res) => {
    Usermodel.findByIdAndUpdate(req.params.userId, { firstName: req.body.firstName, lastName: req.body.lastName }).exec(function (err, data) {
        db.connection().query("UPDATE users SET firstName = ?, lastName = ? WHERE id = ?", [req.body.firstName, req.body.lastName, req.params.userId], function (error, results, fields) {
            if (error) throw error;
            db.closeConnection();
            if (results.affectedRows) res.status(201).json({ data: "record updated sucessfully !" })
            else return res.status(401).send({ message: "Record not found" });
        });
    });
}