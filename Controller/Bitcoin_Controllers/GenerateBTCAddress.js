//bitcoind -testnet
//-deprecatedrpc=accounts
//sudo apt remove libcurl4
//sudo apt install curl
const rpc = require('../../services/rpc');
const db = require('../../db');

exports.generateBTCAddress = (req , res, next)=>{
    rpc.getnewaddress(function (err, result) {
        if (err) {
            console.log('err in address generation');
            console.error(err);
            return res.status(501).send({message:"error "})
        }
        else {
            console.log(result);
            const btcAddress = result.result;
            rpc.dumpprivkey(btcAddress, function (error, resultPK) {
                if (error) {
                    console.log('err in PK generation');
                    console.error(error);
                    return res.status(501).send({message:"error "})
                }
                else {
                    console.log(resultPK.result);
                    db.connection().query("INSERT INTO address SET ? ", { publicKey: btcAddress,userId: req.jwt.userId}, function (error, results, fields) {
                        if (error) throw error;
                        db.closeConnection();
                        console.log('id: ' + results.insertId);
                        res.status(201).send({
                            publicKey: btcAddress,
                            privateKey: resultPK.result
                        });
                    });
                }
            });
        }
    });
}