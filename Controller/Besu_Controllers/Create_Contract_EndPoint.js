const solc = require('solc')

//get the contract bytecode and abi  only before  pushing 
exports.contractExecution = (req, res) => {
  try {

    var fildata = req.body.fileData;
    var contractname = req.body.contractName.trim();

    var Compiledata = solc.compile(fildata);
    console.log(Compiledata);
    var contract_Name = ':' + contractname;

    var byteCode = Compiledata.contracts[contract_Name].bytecode;
    var abiDefinition = JSON.parse(Compiledata.contracts[contract_Name].interface);
  }
  catch (error) {
    res.status(403).send({ errorcode: "ER0004", error: error.message })
  }
  finally {

    res.status(201).send({ ByteCode: byteCode, abi: JSON.stringify(abiDefinition) });
  }
}
