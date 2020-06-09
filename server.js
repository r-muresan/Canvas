require('dotenv').config()

const express = require('express');
const app = express();
var http = require('http').createServer(app);
const { resolve } = require("path");

app.use(express.json({ limit: '50mb' }));


var MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";





app.post("/newDrawing", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("GraffitiWall");
        dbo.collection("Drawing_Waiting").insertOne({ drawing: req.body.drawing }, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
    res.status(200);
});


app.get("/getDrawingsAccepted", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("GraffitiWall");
        dbo.collection("Drawing").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});
app.get("/getDrawingsWaiting", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("GraffitiWall");
        dbo.collection("Drawing_Waiting").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.post("/acceptDrawing", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("GraffitiWall");
        dbo.collection("Drawing_Waiting").deleteOne({ "drawing": req.body.drawing }, function (err, obj) {
            if (err) throw err;
            db.close();
        });
        dbo.collection("Drawing").insertOne({ drawing: req.body.drawing }, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
    res.status(200);
});

app.post("/declineDrawing", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("GraffitiWall");
        dbo.collection("Drawing_Waiting").deleteOne({ "drawing": req.body.drawing }, function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });
    res.status(200);
});



// perform actions on the collection object




app.get("/", (req, res) => {
    const path = resolve(__dirname + "/public/draw.html");
    res.sendFile(path);
});

app.get("/admin", (req, res) => {
    const path = resolve(__dirname + "/public/admin.html");
    res.sendFile(path);
});

app.use(express.static(__dirname + "/public"));

http.listen(process.env.PORT || 8888, function () {
    console.log(`Your port is ${process.env.PORT || 8888}`);
});




// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("GraffitiWall");
//     var myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("Drawing").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

