var solc = require('solc');
var tx = require('ethereumjs-tx');
var web31 = require('./constant');

const createGroup = require("./privacyGroupManagement/createPrivacyGroup");
const { orion, besu } = require("./privacyGroupManagement/keys.js");



exports.getContractAddress = (req, res) => {
  var address = req.params.TransactionID.trim();
  var web3 = web31.url;
  try {
    web3.eth.getTransactionReceipt(address, function (err, receipt) {
      try {
        if (receipt.contractAddress === null) {
          res.status(404).send({ error: "No contract address found" });
        } else {
          res.status(201).send({ contractAddress: receipt.contractAddress });
        }
      } catch (error) {
        res.status(404).send({ error: "No contract address found" });
      }
    });
  } catch (err) {
    res.status(403).send({ error: err });
  }
}

exports.getTransactionDetail = (req, res) => {
  var address = req.params.TransactionID.trim();
  var web3 = web31.url;

  try {
    web3.eth.getTransactionReceipt(address, function (err, receipt) {
      res.status(201).send({ receipt: receipt });
    });
  } catch (err) {
    res.status(403).send({ error: err });
  }
}

exports.contractdeploy = (req, res) => {
  try {
    console.log(req.body);
    var params;
    if (req.body.params != null && req.body.params !== undefined) {
      console.log('1');
      params = JSON.parse(req.body.params);
    }
    var contract_Name = ':' + req.body.contractName;
    contract_Name = contract_Name.trim();
    var fildata = req.body.fileData;
    var account_Address = req.body.address;
    console.log(account_Address);
    var web3 = web31.url;

    if (web3.utils.isAddress(account_Address.trim())) {
      console.log('reached');
    }
    else {
      res.status(403).send({ errorcode: "ER0004", message: "provider address " + account_Address + " is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted" })
    }

    var private_key = req.body.privateKey;
    var sourceCode = fildata;
    var compileCode = solc.compile(sourceCode);
    var args = [];

    if (params !== null && params !== undefined) {
      console.log('2');
      console.log(params);
      for (var i in params) {
        args.push(params[i]);
      }
    }

    console.log('args:', args);
    var helloByteCode = compileCode.contracts[contract_Name].bytecode;
    var abiDefinition = compileCode.contracts[contract_Name].interface;

    create();

    async function create() {
      var MyContract = new web3.eth.Contract(JSON.parse(abiDefinition));
      console.log('privacyGroupID..........');
      // privacyGroupId = await createGroup.createPrivacyGroup();
      // console.log('privacyGroupID', privacyGroupId);

      var rawTx;
      if (args.length != 0) {
        console.log('inside if condition');
        var contractData = MyContract.deploy({ arguments: args, data: '0x' + helloByteCode }).encodeABI();
        address = account_Address;//'0x32b57771F6De109b4876e3d1385Fb798cc5198eE';
        key = private_key;//"d4b3ef05dac459e2c25f04f51123325aade40ab6b96cc85b8291bc746231d62a";
        rawTx =
        {
          nonce: web3.utils.toHex(await web3.eth.getTransactionCount(address)),
          gasLimit: web3.utils.toHex(3000000),//800000
          gasPrice: web3.utils.toHex(20000000000),//20000000000
          data: contractData
          // privateFrom: orion.node1.publicKey,
          // privacyGroupId,
          // privateKey: besu.node1.privateKey
        };
        console.log('3.5')
      }
      else {
        address = account_Address;//'0x32b57771F6De109b4876e3d1385Fb798cc5198eE';
        key = private_key;//"d4b3ef05dac459e2c25f04f51123325aade40ab6b96cc85b8291bc746231d62a";
        rawTx =
        {
          nonce: web3.utils.toHex(await web3.eth.getTransactionCount(address)),
          gasLimit: web3.utils.toHex(3000000),//800000
          gasPrice: web3.utils.toHex(2000000000),//20000000000
          data: '0x' + helloByteCode
        };
      }

      // console.log('reached');
      sendRaw(rawTx, function (Result) {
        var a = [];
        a.push(Result);
        var b = a.toString();
        str = b.substring(7);
        if (b.includes('Error:')) {
          res.status(406).send({ status: 0, txHash: str, abi: abiDefinition });
        }
        else {
          res.status(201).send({ status: 1, txHash: Result, abi: abiDefinition });
        }
      });
    }

  } catch (error) {
    res.status(403).send({ errorcode: "ER0004", message: error.message })
  }

  async function sendRaw(rawTx, flag) {
    var privateKey = new Buffer.from(key, 'hex');
    var transaction = new tx(rawTx, { chain: 'rinkeby', hardfork: 'petersburg' });
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    console.log('hereeeeeeeeeeeeeeeeeeeeeeeee')
    await web3.eth.sendSignedTransaction(
      '0x' + serializedTx, function (err, result) {
        if (err) {
          console.log('err ', err);
          flag(err);
        } else {
          console.log('result ', result);
          flag(result);
        }
      });
  }
}
