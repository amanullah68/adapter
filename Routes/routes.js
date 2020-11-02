const express = require('express');
const Router = express.Router();
const VerifyUserMiddleware = require('../Middleware/verifyUser.middeware');
const verifylogin = require('../Controller/Ethereum_Controllers/LoginController');
const healthCheck = require('../Controller/healthCheck');
const config = require('../Common/config/env.config');


const ADMIN =  config.permissionLevels.ADMIN ;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;


const PermissionMiddleware = require('../Common/permission_middleware/auth.permission.middleware');
const ValidationMiddleware = require('../Common/permission_middleware/auth.validation.middleware')

const User_actions = require('../Controller/Ethereum_Controllers/User_actions_controller')

Router.post('/ethereum/register' ,[
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    VerifyUserMiddleware.haValidFields
] , require('../Controller/Ethereum_Controllers/RegisterController').register);

//checking whether API is working or not
Router.get('/healthCheck' , [
    healthCheck.healthCheck
]);

Router.post('/login' , [
    VerifyUserMiddleware.hasAuthValidFields, 
    VerifyUserMiddleware.isPasswordAndUserMatch,
    verifylogin.login
]);

Router.get('/users' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    User_actions.list
])

Router.get('/users/:userId' , [
ValidationMiddleware.validJWTNeeded,
PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
User_actions.getbyid
] )

Router.delete('/users/:userId' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    User_actions.RemovebyId
] )

Router.patch('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    User_actions.patchById
]);

Router.post('/generateaddress' , [
    // ValidationMiddleware.validJWTNeeded,
], require('../Controller/Ethereum_Controllers/GenerateAddresses').generateaddress);

Router.get('/ethereum/getbalance/:address' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/GenerateAddresses').getbalance);

//get the contract bytecode and abi  only  before deploying
Router.post('/ethereum/contract' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
] , require('../Controller/Ethereum_Controllers/Create_Contract_EndPoint').contractExecution);

//deploy contract 
Router.post('/ethereum/contract/deploy' ,[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/deployContract').contractdeploy);

Router.get('/ethereum/getContractAddress/:TransactionID' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/deployContract').getContractAddress);

Router.get('/ethereum/getTransactionDetail/:TransactionID' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/deployContract').getTransactionDetail);

//get the bytecode of contract  form the  given contract address  already deployed on ethersacan.io 
Router.get('/ethereum/contract/:address' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/getContractAbiFromAddress').getabifromaddress);

Router.post('/ethereum/contract/setContractMethod'  , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/callContractMethod').setContract);

Router.post('/ethereum/contract/getContractMethod',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/callContractMethod').getContract);

Router.post('/ethereum/contract/getContractMethodWithParams',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/callContractMethod').getContractWithParams);

Router.post('/ethereum/contract/getTransactionReceipt',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/getTransactionReceipt').getTransactionReceipt);

Router.post('/ethereum/transferEthers' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Ethereum_Controllers/callContractMethod').transferBalance);



// Hyperledger Besu
Router.get('/besu/getbalance/:address' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/GenerateAddresses').getbalance);

//get the contract bytecode and abi  only  before deploying
Router.post('/besu/contract' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
] , require('../Controller/Besu_Controllers/Create_Contract_EndPoint').contractExecution);

//deploy contract 
Router.post('/besu/contract/deploy' ,[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/deployContract').contractdeploy);

Router.get('/besu/getContractAddress/:TransactionID' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/deployContract').getContractAddress);

Router.get('/besu/getTransactionDetail/:TransactionID' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/deployContract').getTransactionDetail);

//get the bytecode of contract  form the  given contract address  already deployed on ethersacan.io 
Router.get('/besu/contract/:address' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/getContractAbiFromAddress').getabifromaddress);

Router.post('/besu/contract/setContractMethod'  , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/callContractMethod').setContract);

Router.post('/besu/contract/getContractMethod',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/callContractMethod').getContract);

Router.post('/besu/contract/getContractMethodWithParams',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/callContractMethod').getContractWithParams);

Router.post('/besu/contract/getTransactionReceipt',[
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/getTransactionReceipt').getTransactionReceipt);

Router.post('/besu/transferEthers' , [
    // ValidationMiddleware.validJWTNeeded,
    // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Besu_Controllers/callContractMethod').transferBalance);


//BTC Routes starts
Router.get('/btc/generateBTCAddress' , [
    ValidationMiddleware.validJWTNeeded,
], require('../Controller/Bitcoin_Controllers/GenerateBTCAddress').generateBTCAddress);

Router.get('/btc/getBTCBalance/:address' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Bitcoin_Controllers/getBalance').getBalance);

Router.post('/btc/transferBalance' , [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
], require('../Controller/Bitcoin_Controllers/transferBalance').transferBalance);

//BTC Routes ends

// Router.post('/contract/:address/getMetadata' , [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ] ,  require('../Controller/callContractMethod').getMetadata);

// Router.post('/contract/:address/supply' , [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ],  require('../Controller/callContractMethod').supply);

// Router.post('/contract/:address/transfer' , [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ], require('../Controller/callContractMethod').transfer);


// Router.post('/contract/:address/balanceOf', [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ] , require('../Controller/callContractMethod').balanceof);


// Router.post('/contract/:address/owner', [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ] , require('../Controller/callContractMethod').owner)  


// Router.post('/contract/:address/transferownership' , [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ] , require('../Controller/callContractMethod').transferOwner) 

// Router.post('/contract/:address/getevent' , [
//     ValidationMiddleware.validJWTNeeded,
//     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN)
// ], require('../Controller/callContractMethod').getEvents)

module.exports = Router 