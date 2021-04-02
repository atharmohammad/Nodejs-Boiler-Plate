const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./Tasks');

const userSchema = new mongoose.Schema({
  //Created a Model and specified their fields and its properties
  name:{
    type:String,
    trim:true,
    required:true
  },
  Email:{
    type:String,
    trim:true,
    unique:true,
    required:true,
    validate:(value)=>{
      if(!validator.isEmail(value))
        throw new Error("Email is Invalid!")
    }
  },
  password:{
    type:String,
    trim:true,
    required:true,
    validate:(value)=>{
      if(value.trim() === "password"){
        throw new Error("Password is very weak!")
      }
    }
  },
  age:{
    type:Number,
    validate:(value)=>{
      if(value  <= 0)
        throw new Error("Age Should be a Positive Number")
    },
    default:1
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }],
  avatar:{
    type:Buffer
  }
},{
  timestamps:true
});

userSchema.virtual('tasks',{ //virtual is used to set foreign Fields or you can say connecting the User with Tasks model
  ref:'tasks',
  localField:'_id', //field that is representing in  foreign field in the tasks models
  foreignField:'owner'
})

userSchema.methods.toJSON = function(){ //this toJSON is a special function
    //whenever any user object is send on request it will transfrom to JSON.stringify()
    //this toJSON decides what to give back to stringify
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

userSchema.methods.generateToken = async function(){
  console.log('generateToken is running')
  const user = this;
  const token = jwt.sign({_id : user._id.toString()},"mysecret123");
  user.tokens = user.tokens.concat({token});
  await user.save();
  console.log(token)
  return token;
}

userSchema.statics.findByCredentials = async function(email,password){
  const user = await this.model('User').findOne({Email:email});
  if(!user){
    throw new Error ('User not found!');
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    throw new Error('email password not matched');
  }

  return user

}

userSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8);
  }
  next();
})

userSchema.pre('remove',async function(next){
  console.log("running delete")
  const user = this;
  await Tasks.deleteMany({owner:user._id});
  next();
})

const table = mongoose.model('User',userSchema);



module.exports = table
//
// const user = new table({  //Created a Table instance with its data
//   name:"Athar",
//   Email:'mohd.rule@gmail.com',
//   password:"Mynameisathar",
//   age:2
// });
