import { verifyJwt } from "./jwt.js";

export async function getAuthContext(req: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return { user: null };

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyJwt(token);
    return {
      user: { id: payload.userId },
    };
  } catch {
    return { user: null };
  }
}
