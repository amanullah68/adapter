const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ContractTransactionSchema = new Schema({
   address_id:{
       type:String
   },
   TransactionId:{
       type:String
   },
   TransactionType:{
    type:String
   },
   TransactionObject:{
    type:String
   }

});

const userAddress = mongoose.model('ContractTransaction' , ContractTransactionSchema)
module.exports = userAddress;

