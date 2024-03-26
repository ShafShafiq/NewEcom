const jwt = require('jsonwebtoken');
const User = require('../models/users');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401); // No token, unauthorized
  

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // Token not valid

    req.user = user;
    const seller =  await User.findById(user.userId);
    
    if (!seller.verified){
        return res.status(401).send({ error:{message: "Account not verifired "} });
        }
      
    next(); // Proceed to the protected route's controller
  });
};

module.exports = authenticateToken;