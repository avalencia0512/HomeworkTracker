var express = require('express');
// const app = express();
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const HW = require("../HW");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 "mongodb+srv://ServerUser:Ruby1997@trupticluster.z4ylf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};


mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all HWs */
router.get('/HWs', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  HW.find({}, (err, AllHWs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllHWs);
  });
});




/* post a new HW and push to Mongo */
router.post('/NewHW', function(req, res) {

    let oneNewHW = new HW(req.body);  // call constuctor in HWs code that makes a new mongo HW object
    console.log(req.body);
    oneNewHW.save((err, hw) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(hw);
      res.status(201).json(hw);
      }
    });
});


router.delete('/DeleteHW/:id', function (req, res) {
  HW.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "HWAssignment successfully deleted" });
  });
});


router.put('/UpdateHW/:id', function (req, res) {
  HW.findOneAndUpdate(
    { _id: req.params.id },
    { className: req.body.className, assignmentName: req.body.assignmentName, submitted: req.body.submitted, score: req.body.score },
   { new: true },
    (err, hw) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(hw);
    })
  });


  /* GET one HWs */
router.get('/FindHW/:id', function(req, res) {
  console.log(req.params.id );
  HW.find({ _id: req.params.id }, (err, oneHW) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneHW);
  });
});

module.exports = router;
