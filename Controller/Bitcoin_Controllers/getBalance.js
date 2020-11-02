const rpc = require('../../services/rpc');

exports.getBalance = (req , res, next)=>{
    const btcAddress = req.params.address;
    rpc.getbalance("*", btcAddress, function (err, result) {
        if (err) {
            console.log('err in getbalance');
            console.error(err);
            return res.status(501).send({error: err.message})
        }
        else {
            console.log(result);
            res.status(201).send({
                btcAddress: btcAddress,
                balance: result.result
            });
        }
    });
}