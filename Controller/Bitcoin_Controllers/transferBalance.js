const rpc = require('../../services/rpc');

exports.transferBalance = (req , res, next)=>{
    const fromAddress = '2Mwi78PfRDT8w1PDWYmfvfLiGvBLBG13nPt';//req.body.fromAddress;
    const toAddress = '2NEKst3Ru1XojtmvEQj72UEDA9mg2ZeXP3G';//req.body.toAddress;
    const amount = 0.001;//req.body.amount;
    console.log(req.body);
    rpc.sendtoaddress(toAddress,amount, function (err, result) {
        if (err) {
            console.log('err in transfer');
            console.error(err);
            return res.status(501).send({message:"error "})
        }
        else {
            console.log(result);
            res.status(201).send({
                success: 'transfered'
            });
        }
    });

    //TODO transferBalance
}