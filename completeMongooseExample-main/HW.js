// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

// ClassName, AssignmentName, Submitted, Score

const HWSchema = new Schema({
  className: {
    type: String,
    required: true
  },
  assignmentName: {
    type: String,
    required: true
  },
  submitted: {
    type: Boolean,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

// Collection name : HWAssignments
//module.exports = mongoose.model("HWs", HWSchema, "HWAssignments");
const hwModel = mongoose.model("HW", HWSchema, "hws");
module.exports = hwModel; // mongoose.model("HW", HWSchema);