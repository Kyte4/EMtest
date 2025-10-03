import { Repository } from "typeorm";
import { hashPassword } from "../utils/hash";
import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entities/user";

type CreateUserInput = {
  fullName: string;
  birthDate?: Date | string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

const repo = (): Repository<User> => AppDataSource.getRepository(User);

function sanitize(user: User) {
  const { password, ...rest } = user as any;
  return rest as Partial<User>;
}


export async function createUser(input: CreateUserInput) {
  const repository = repo();
  const user = repository.create({
    fullName: input.fullName,
    birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
    email: input.email,
    password: await hashPassword(input.password),
    role: input.role === "admin" ? "admin" : "user",
    isActive: true,
  });
  const saved = await repository.save(user);
  return sanitize(saved);
}

export async function findByEmail(email: string) {
  return repo().findOne({ where: { email } });
}

export async function findById(id: number) {
  return repo().findOne({ where: { id } });
}

export async function findAll() {
  const users = await repo().find();
  return users.map((u) => sanitize(u));
}

export async function blockUserById(id: number) {
  const repository = repo();
  const user = await repository.findOne({ where: { id } });
  if (!user) return null;
  user.isActive = false;
  const saved = await repository.save(user);
  return sanitize(saved);
}

export default {
  createUser,
  findByEmail,
  findById,
  findAll,
  blockUserById,
  hashPassword,
};
