const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

module.exports = { generateToken, verifyToken };
