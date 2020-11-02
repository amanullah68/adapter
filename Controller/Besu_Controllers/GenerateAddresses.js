const nodeEth = require('node-eth-address');
const db = require('../../db');
var web31 = require('./constant');
var jwt_decode = require('jwt-decode');

// generate the private and public keys and store in database
exports.generateaddress = (req, res, next) => {
    // const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'));
    try {
        const web3 = web31.url;
        //add new
        const userDetails = jwt_decode(req.headers.authorization);
        const password = userDetails.userId;
        const address = nodeEth.getDefaultAddress(password.toString());

        if (typeof web3 !== 'undefined') {
            db.connection().query("INSERT INTO address SET ? ", { publicKey: address.address, userId: userDetails.userId }, function (error, results, fields) {
                if (error) throw error;
                db.closeConnection();
                console.log('id: ' + results.insertId);
                res.status(201).send({
                    publicKey: address.address,
                    privateKey: address.privateKey
                });
            });
        }
    }
    catch (err) {
        throw err;
    }

}

exports.getbalance = (req, res) => {

    web3 = web31.url;;
    if (typeof web3 !== 'undefined') {
        web3.eth.getBalance(req.params.address, function (error, result) {
            if (!error) {
                res.status(201).send({ adress: req.params.address, Ether: web3.fromWei(result, 'ether'), balance: result })
            } else
                return res.status(501).send({ message: "error " })
        });
    }
}