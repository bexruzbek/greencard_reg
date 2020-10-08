// const Admin = require('../models/Admin');

// module.exports = async function (req, res, next) {
//   try {
//       if(!req.session.user){
//         return next();
//       }
//       const {_id} = req.session.user;
//       req.user = await Admin.findOne({ _id });
//       return next();
//   } catch (e) {
//       console.log(e);
//   }
// };