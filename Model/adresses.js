const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const AddressSchema = new Schema({
   Public_key:{
       type:String
   },
   Private_key:{
       type:String
   },
   user_id:{
       type:String
   }
});

const userAddress = mongoose.model('Address' , AddressSchema)
module.exports = userAddress;

