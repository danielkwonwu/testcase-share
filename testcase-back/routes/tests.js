var express = require('express');
var fs = require('fs');
var connection = require('../db.js');

var router = express.Router();

function verifyTestCase(testcase){
    //integration point for verification
    return true;
}

router.post("/testcase", (req, res) => {
    if (req.body.text){
        var ownername = req.body.owner;
        var content = req.body.text;
        connection.query('SELECT * from users WHERE username = ?', [ownername], (err, results) =>{
            if (err) throw err;
            var ownerid = results[0].id;
            if (verifyTestCase(content)){
                connection.query('INSERT INTO testcases (ownerid,ownername,content) VALUES (?,?,?)', [ownerid, ownername, req.body.text], (err, results) => {
                    if (err) throw err;
                    connection.query('SELECT * from testcases', (err, results) =>{
                        console.log("select query");
                        console.log(results);
                        res.json({
                            success: true,
                            fetchedTest: results
                        })
                    });
                });
            }
            else{
                res.json({
                    success: false,
                    message: "Failed to verify testcase"
                })
            }
        });
    }
    /*fs.appendFile('./testcase.txt', "\n" + req.body.text, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
        fs.readFile('./testcase.txt', 'utf8', (err, data) => {
            if (err){
                res.json({
                    success: false,
                    fetchedTest: ""
                });
                return;
            }
            console.log(data);
            res.json({
                success: true,
                fetchedTest: data
            });
            console.log("sent");
        });
    });*/
});

router.get("/fetch", (req, res) => {
    connection.query('SELECT * from testcases', (err, results) =>{
        if (err) throw err;
        console.log("select query");
        console.log(results);
        res.json({
            success: true,
            fetchedTest: results
        })
    });
    /*fs.readFile('./testcase.txt', 'utf8', (err, data) => {
        if (err){
            return console.log(err);
        }
        console.log(data);
        res.json({
            success: true,
            fetchedTest: data
        });
        console.log("sent");
    })*/
});


module.exports = router;