const mongoose = require('mongoose');
const url = 'mongodb+srv://athar:athar123@task-manager-cluster.w1cta.mongodb.net/task-manager-api?retryWrites=true&w=majority'
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true},(e,r)=>{
  if(e){
    return console.log(e)
  }
  console.log("Connected");
});


// user.save() //Saved the data and handled promises
//     .then(res=>console.log(res))
//     .catch(err=>console.log(err));
