var Web3 = require('web3');
const solc = require('solc')
var web31 = require('./constant');
///var fs = require('file-system');

//get the contract bytecode and abi  only before  pushing 
exports.contractExecution = (req, res) => {
  // "solc": "0.5.3",
  try {
    console.log('contract creation funtion');

    var fildata = req.body.fileData;
    var contractname = req.body.contractName.trim();
    //console.log(req.jwt);
    //console.log(req.body);
    //console.log(n);

    var Compiledata = solc.compile(fildata);
    console.log(Compiledata);
    var contract_Name = ':' + contractname;
    //console.log("get contract name")
    //console.log(contract_Name);
    var byteCode = Compiledata.contracts[contract_Name].bytecode;
    //console.log("get bytes code");
    //console.log(byteCode);
    var abiDefinition = JSON.parse(Compiledata.contracts[contract_Name].interface);

    //   for (var contractName in Compiledata.contracts) {


    //     var bc = Compiledata.contracts[contractName].bytecode;
    //     var abi =  Compiledata.contracts[contractName].interface;


    //     var contact = web3.eth.contract.new(abi,{from: web3.eth.accounts[0], data: bc});


    //     if (typeof contact.address !== 'undefined') {
    //          console.log('Contract mined! address: ' + contact.address + ' transactionHash: ' + contact.transactionHash);
    //     }

    // }
  }
  catch (error) {
    //console.log(error);

    res.status(403).send({ errorcode: "ER0004", error: error.message })

  }
  finally {

    res.status(201).send({ ByteCode: byteCode, abi: JSON.stringify(abiDefinition) });
  }
}
