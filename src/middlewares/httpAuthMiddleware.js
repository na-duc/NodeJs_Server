import dotenv from "dotenv";
dotenv.config();

const SOCKET_KEY = process.env.NODE_SOCKET_SECRET_KEY;

export const httpAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing Authorization header" });
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (token !== SOCKET_KEY) {
    console.log("[AUTH-BE] Check: Fail");
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
  console.log("[AUTH-BE] Check: Success");
  next();
};
