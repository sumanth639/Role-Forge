import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. Please add it to your .env file."
  );
}

const secret: string = JWT_SECRET;

export function signJwt(payload: { userId: string }) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
    return decoded as { userId: string };
  }
  throw new Error("Invalid token payload");
}
