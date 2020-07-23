var express = require('express');
var fs = require('fs');

var router = express.Router();

router.post("/testcase", (req, res) => {
    console.log("received " + req.body.text);
    fs.appendFile('./testcase.txt', "\n" + req.body.text, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json({
            success:true
        })
    });
});

router.get("/fetch", (req, res) => {

    fs.readFile('./testcase.txt', 'utf8', (err, data) => {
        if (err){
            return console.log(err);
        }
        console.log(data);
        res.json({
            success: true,
            fetchedTest: data
        });
        console.log("sent");
    })
});


module.exports = router;