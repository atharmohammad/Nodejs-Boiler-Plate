const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
  description:{
    type:String,
    required:true
  },
  compeleted:{
    type:Boolean,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }
},{
  timestamps:true
})

const table = mongoose.model('tasks',taskSchema);

module.exports = table;
