var Web3 = require('web3');
var web31 = require('./constant');

//get the bytecode of contract  form the  given contract address  already deployed on ethersacan.io 
exports.getabifromaddress = (req, res) => {

    // var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'));
    var web3 = web31.url;
    if (typeof web3 !== 'undefined') {
        web3.eth.getCode(req.params.address, (err, byteCode) => {
            if (err) console.log(err)
            res.status(201).send({ bytecode: byteCode })
        })
    }
} 
