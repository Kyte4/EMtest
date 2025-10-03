import { User } from "../src/entities/user";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<Pick<User, "id" | "role" | "email">>;
    }
  }
}
export {};