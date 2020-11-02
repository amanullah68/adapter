const Tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;
var caddress = "";
var web31 = require('./constant');

exports.setContract = async (req, res) => {

  try {
    var web3 = web31.url;
    var abi = req.body.abi;

    var account_address = req.body.txHash.trim();
    var message = JSON.parse(req.body.params);
    var address = req.body.address.trim();
    var key = req.body.privateKey.trim();
    var method = req.body.method.trim();
    const args = [];

    // console.log('address', address);
    // console.log('key', key);

    // putting params in array
    for (var i in message) {
      args.push(message[i]);
    }

    // console.log('message', args);
    // var MyContract = web3.eth.contract(abi, account_address);
    await web3.eth.getTransactionReceipt(account_address, async function (err, receipt) {

      try {
        console.log('nonce', web3.utils.toHex(await web3.eth.getTransactionCount(address)));
        var txOptions =
        {
          nonce: web3.utils.toHex(await web3.eth.getTransactionCount(address)),
          gasLimit: web3.utils.toHex(3000000),
          gasPrice: web3.utils.toHex(2000000000),
          to: receipt.contractAddress,
          // chainId:"4",
        }

        var rawTx = await txutils.functionTx(JSON.parse(abi), method, args, txOptions);
        await sendRaw(rawTx, async function (Result) {
          var a = [];
          a.push(Result);
          var b = a.toString();
          str = b.substring(7);

          if (b.includes('Error:')) {
            res.status(406).send({ status: 0, txHash: str });
          }
          else {
            res.status(201).send({ status: 1, txHash: Result });
          }
        });
      } catch (error) {
        res.status(403).send({ errorcode: "ER0002-come", message: error.message })
      }
    });

  } catch (error) {
    res.status(403).send({ errorcode: "ER0002", Error: error.message })
  }
  async function sendRaw(rawTx, flag) {
    console.log('rawTx', rawTx);
    var privateKey = new Buffer.from(key, 'hex');
    var res;
    // changes made here
    var transaction = new Tx(rawTx, { chain: 'rinkeby', hardfork: 'petersburg' });
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    await web3.eth.sendSignedTransaction(
      '0x' + serializedTx,
      async function (err, result) {
        // console.log('1');
        if (err) {
          flag(err);
        }
        else {
          //  console.log('wait');
          console.log('tx', result);
          res = result;
          flag(res);
        }
      });
  }
}

exports.getContract = (req, res) => {
  // console.log("getContract method run");

  // var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/e8b3281648bd4aa4b019c9c09b239efb'));
  var web3 = web31.url;
  var abi = req.body.abi;
  var address = req.body.txHash;
  var method = req.body.method;
  var params = req.body.params;
  console.log("address", address);
  console.log("method", method);
  console.log("params", params);
  try {
    //console.log("abi"+abi);
    console.log("address1", address);
    console.log("method1", method);
    console.log("params1", params);
    //console.log(req.jwt);
    web3.eth.getTransactionReceipt(address, function (err, receipt) {
      // console.log(err);
      console.log(receipt);
      //  console.log(receipt.contractAddress);
      if (err) {
        res.status(403).send({ status: 2, errorcode: "ER0002", message: err })
      } else {
        try {
          if (receipt.contractAddress === null) {
            res.status(404).send({ status: 2, errorcode: "ER0002", message: "No contract address found" });
          } else {
            caddress = receipt.contractAddress;
            var contract = new web3.eth.Contract(JSON.parse(abi), caddress);

            var data = contract.methods[method](...args).call();

            // var instance = contract.at(receipt.contractAddress);

            console.log('params................', params);
            // console.log('loging end ');
            // var data = instance[method].call(params).toString();
            console.log('data...........', data);
            res.status(201).send({ status: 1, result: data })
          }
        } catch (err) {
          // console.log(err);
          res.status(403).send({ status: 2, errorcode: "ER0002", message: err.message });
        }
      }
    });
  } catch (error) {
    res.status(403).send({ status: 2, errorcode: "ER0002", message: error.message })
  }

}

exports.getContractWithParams = (req, res) => {
  // console.log("getContract method run");

  // var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/e8b3281648bd4aa4b019c9c09b239efb'));
  var web3 = web31.url;
  var abi = req.body.abi;
  var address = req.body.txHash;
  var method = req.body.method;
  var params = JSON.parse(req.body.params);
  const args = [];
  for (var i in params) {
    args.push(params[i]);
  }

  try {
    //console.log("abi"+abi);
    console.log("address2", address);
    console.log("method2", method);
    console.log("params2", args);
    //console.log(req.jwt);
    web3.eth.getTransactionReceipt(address, async function (err, receipt) {
      // console.log(err);
      // console.log(receipt);
      //  console.log(receipt.contractAddress);
      if (err) {
        res.status(403).send({ status: 2, errorcode: "ER0002", message: err })
      } else {
        try {
          if (receipt.contractAddress === null) {
            res.status(404).send({ status: 2, errorcode: "ER0003", message: "No contract address found" });
          } else {
            caddress = receipt.contractAddress;
            var contract = new web3.eth.Contract(JSON.parse(abi), receipt.contractAddress);

            var data = await contract.methods[method](args[0]).call();
            console.log('data...........111', await contract.methods[method](args[0]).call());
            res.status(201).send({ status: 1, result: data })
          }
        } catch (err) {
          // console.log(err);
          res.status(403).send({ status: 2, errorcode: "ER0004", message: err.message });
        }
      }
    });
  } catch (error) {
    res.status(403).send({ status: 2, errorcode: "ER0005", message: error.message })
  }
}

exports.transferBalance = async (req, res) => {
  var web3 = web31.url;
  sender = req.body.sender;
  console.log('sender', sender);
  reciever = req.body.reciever;
  console.log('reciever', reciever);
  amount = req.body.amount;
  console.log('amount', amount);
  privateKey = req.body.privateKey;

  try {
    var gasPrice = 3000000;//or get with web3.eth.gasPrice
    var gasLimit = 3000000;

    var price = web3.eth.gasPrice;
    console.log('price........', Number(price));

    var limit = web3.eth.estimateGas({
      "from": sender,
      "price": price
    });
    console.log('value', web3.toWei(amount / 100000000, 'ether'));

    var rawTransaction = {
      "from": sender,
      "nonce": web3.utils.toHex(await web3.eth.getTransactionCount(sender)),
      "gasPrice": Number(price),
      "gasLimit": limit,
      "to": reciever,
      "value": Number(web3.toWei(amount, 'ether')),
      "chainId": 4 //remember to change this
    };

    console.log('raw TRanasction ');
    console.log(rawTransaction);

    var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);
    // console.log('tx', tx);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, result) {
      // console.log(err);
      console.log(result);
      //  console.log(receipt.contractAddress);
      if (err) {
        console.log({ status: 2, errorcode: "ER0002", message: err });
        res.status(403).send({ status: 2, errorcode: "ER0002", message: err });
      } else {
        try {
          if (result === null) {
            res.status(404).send({ status: 2, errorcode: "ER0003", message: "Not transfered some error" });
          } else {
            res.status(201).send({ status: 1, result: 'success' });
          }
        } catch (err) {
          // console.log(err);
          res.status(403).send({ status: 2, errorcode: "ER0004", message: err.message });
        }
      }
    });
  } catch (error) {
    res.status(403).send({ status: 2, errorcode: "ER0005", message: error.message })
  }
}