import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_for_dev_if_not_set";
const jwtAuthMiddleware = (socket, next) => {

  const authHeader = socket.handshake.auth.token;

  const token = authHeader?.replace("bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;
    if (userId) {
      socket.userId = String(userId);
      console.log(
        `[AUTH] Kết nối thành công. User ID: ${socket.userId}, Socket ID: ${socket.id}`
      );
      return next();
    } else {
      console.error("[AUTH] Lỗi xác thực: Không tìm thấy User ID trong token.");
      return next(new Error("Unauthorized: User ID missing in token"));
    }
  } catch (error) {
    let errorMessage = "Unauthorized: Invalid token";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Unauthorized: Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Unauthorized: Invalid token signature";
    }

    console.error(`[AUTH] Lỗi JWT: ${error.message}`);
    return next(new Error(errorMessage));
  }
};
export { jwtAuthMiddleware };