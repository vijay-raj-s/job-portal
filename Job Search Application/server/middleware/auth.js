const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "secret");
    console.log('Auth');
    console.log(decoded);
    if(decoded.jobSeeker) {
        req.jobSeeker = decoded.jobSeeker 
    }else{
        req.employer = decoded.employer 
    }
    console.log('decoded succesfully');
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
