import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader && authHeader.split(" ")[1];

  if (!authToken) return res.sendStatus(401);

  jwt.verify(authToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(401);

    req.user = payload;
    next();
  });
};
