exports.healthCheck = async function (req, res) {
//exports.healthCheck = (req, res)=> {
    //for test purpose...working fine..
    /*db.query('SELECT * FROM test_table', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        //return res.send({ error: false, data: results, message: 'users list.' });
    });*/
    console.log('I am online');
    res.status(200).send({success: 'I am online'});
};