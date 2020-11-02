var RpcClient = require('bitcoind-rpc');

var config = {
    protocol: 'http',
    user: 'root',
    pass: 'pwss',
    host: '127.0.0.1',
    port: '18332'
};
var rpc = new RpcClient(config);

module.exports = rpc;