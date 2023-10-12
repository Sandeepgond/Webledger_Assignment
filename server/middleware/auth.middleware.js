const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        req.user = {
          _id: decoded.authorId, 
          name: decoded.author,  
        };
        next();
      } else {
        res.status(401).send({ error: "Unauthorized Please Login" });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).send({ error: "Unauthorized" });
    }
  } else {
    res.status(401).send({ error: "Unauthorized Please Login" });
  }
};

module.exports = {
  auth,
};
