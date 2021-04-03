const mongoose = require('mongoose');
const url = require('../../Utilities');
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true},(e,r)=>{
  if(e){
    return console.log(e)
  }
  console.log("Connected");
});


// user.save() //Saved the data and handled promises
//     .then(res=>console.log(res))
//     .catch(err=>console.log(err));
