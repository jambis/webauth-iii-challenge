const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./api-model");

module.exports = { restricted };

function restricted(req, res, next) {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "a3289rh3298fdn2983hj2nf90-9-n@!)@0";

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
}

// function checkDepartment(department) {
//     return async function (req,res,next) {
//         if (department) {
//             const users = await db.getBy({department})

//         }else{
//             res.status(403).json({message: "Don't have access"})
//         }
//     }
// }
