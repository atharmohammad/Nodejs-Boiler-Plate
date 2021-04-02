const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const auth = async (req,res,next)=>{
  try{
    console.log('auth running')
    const token = req.header('Authorization').split(" ")[1];
    console.log(token)
    const decoded = jwt.verify(token, "mysecret123")
    const user = await User.findOne({_id:decoded._id,'tokens.token':token});
    console.log(user)
    if(!user){
      throw new Error();
    }
    req.token = token
    req.user = user;
    next();
  }catch(e){
    res.status(401).send({'error':'Please Authenticate !'});
  }
}

module.exports = auth
