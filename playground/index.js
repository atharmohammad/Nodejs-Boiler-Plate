const user = require('../src/models/User');
require('../src/db/mongoose');
//
// user.findByIdAndUpdate("60615eb198f2780cccdf0018",{
//   name:'Mr. Mohammad Athar'
// }).then(res=>{
//   console.log(res);
//   return user.countDocuments({age:21})
// }).then(res=>console.log(res))
//   .catch(err=>console.log(err));

const deleteAndCount = async(_id,age)=>{
  const remove = await user.findByIdAndDelete(_id);
  const count = await user.countDocuments({age});
  return count;
};

deleteAndCount("60615eb198f2780cccdf0018",21)
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
