var Web3 = require("web3");
// const solc = require('solc')
// var fs = require('file-system');
const Tx = require("ethereumjs-tx");
var lightwallet = require("eth-lightwallet");
var txutils = lightwallet.txutils;
var web31 = require('./constant');
// const ContractTransactionModel = require('../../Model/contractTransaction')
// const addressMo = require('../../Model/adresses')

exports.getTransactionReceipt = (req, res) => {
  // console.log("getContract method receipt");

  var web3 = web31.url;
  // var abi = req.body.abi;
  var address = req.body.txHash;
  // console.log('adaptor address', address);

  try {
    web3.eth.getTransactionReceipt(address, function (err, receipt) {
      // console.log(err);
      // console.log(receipt);
      if (err) {
        res.status(403).send({ status: 2, errorcode: "ER0002", message: err });
      }
      else if (err == null && receipt == null) {
        res.status(403).send({ status: 2, errorcode: "ER0002", message: "Null returned" });
      }
      else {
        try {
          const status = receipt.status;
          if (status == true) {
            res.status(201).send({ status: 1, result: "Confirmed" });
          } else if (status == false) {
            res.status(201).send({ status: 1, result: "Failed" });
          } else {
            res.status(201).send({ status: 1, result: "Pending" });
          }
        } catch (err) {
          // console.log(err);
          res
            .status(403)
            .send({ status: 2, errorcode: "ER0002", message: err.message });
        }
      }
    });
  } catch (error) {
    res
      .status(403)
      .send({ status: 2, errorcode: "ER0002", message: error.message });
  }
};
