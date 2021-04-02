const mongoose = require('mongoose');

const url = 'mongodb+srv://athar:athar123@task-manager-cluster.w1cta.mongodb.net/task-manager-api?retryWrites=true&w=majority'

mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true},()=>console.log('connected!!'));

const table = mongoose.model('tasks',{
  description:{
    type:String
  },
  compeleted:{
    type:Boolean
  }
});

const task = new table({
  description:"Multiple Proxy",
  compeleted:false
});

task.save().then(res=>console.log(res))
           .catch(err=>console.log(err));
