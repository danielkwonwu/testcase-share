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
});

router.get("/fetch", (req, res) => {
    connection.query('SELECT * from testcases', (err, results) =>{
        if (err) throw err;
        var testList = {
            success: true,
            fetchedTest: Array()
        };
        for (var i = 0; i < results.length; i++){
            testList.fetchedTest.push({
                id: results[i].id,
                key : i,
                content: results[i].content,
                ownerid: results[i].ownerid,
                ownername : results[i].ownername
            })
        }
        res.json(testList);
    });
});

router.post("/single", (req, res) => {
    var id = req.body.id;
    connection.query('SELECT * FROM testcases WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({
            testcase: result,
            success: true
        })
    })
});

router.post("/delete", (req, res) =>{
    var id = req.body.id;
    connection.query('DELETE FROM testcases WHERE id = ?', [id], (err, results) =>{
        if (err) throw err;
        res.json({
            success: true
        })
    });
});


module.exports = router;