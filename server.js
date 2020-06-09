require('dotenv').config()

const express = require('express');
const app = express();
var http = require('http').createServer(app);
const { resolve } = require("path");

app.use(express.json({ limit: '50mb' }));





const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@cluster0-k94hv.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });


client.connect(err => {
    app.post("/newDrawing", (req, res) => {
        client.db("Canvas").collection("Drawings_Waiting").insertOne({ drawing: req.body.drawing });
        res.status(200);
    });


    app.get("/getDrawingsAccepted", (req, res) => {
        client.db("Canvas").collection("Drawings").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });;
    });

    app.get("/getDrawingsWaiting", (req, res) => {
        client.db("Canvas").collection("Drawings_Waiting").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });;
    });


    app.post("/acceptDrawing", (req, res) => {
        client.db("Canvas").collection("Drawings_Waiting").deleteOne({ "drawing": req.body.drawing });
        client.db("Canvas").collection("Drawings").insertOne({ drawing: req.body.drawing });
        res.status(200);
    });

    app.post("/declineDrawing", (req, res) => {

        client.db("Canvas").collection("Drawings_Waiting").deleteOne({ "drawing": req.body.drawing });

        res.status(200);
    });
});





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

