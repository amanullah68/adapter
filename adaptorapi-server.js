const express = require("express");
const bodyParser = require("body-parser")
//const mongoose = require('mongoose');
var app = express();

// const port = 3002 ;

// app.listen(app.get('port') , function(req , res){
//     console.log("server is listening on  port " +port)
// });

//for mongoo connection
/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ethereum_api', {
    useNewUrlParser: true
}).then(() => {
    console.log('Database Connnected');
}).catch((err) => {
    console.log(err);
})*/

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./Routes/routes'));

app.set('port', process.env.PORT || 3002);
            var server = app.listen(app.get('port'), function() {
            console.log('Express server listening on port ' + server.address().port);
        });