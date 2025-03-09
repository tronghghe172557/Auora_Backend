const jwt = require("jsonwebtoken"); // Add this line to import jwt

const authGuard = (req, res, next) => {
  try {
    const authHeader = req?.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[0];

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      req.user = user; // Attach user data to the request
      next();
    });
  } catch (error) {
    console.error("Auth guard error:", error.message);
    return res.status(500).json({ message: "Server error in auth" });
  }
};

module.exports = authGuard;
