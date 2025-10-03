import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Хэширует пароль
 * @param password обычный пароль
 * @returns хэш пароля
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Сравнивает пароль с хэшем
 * @param password обычный пароль
 * @param hash хэш из базы
 * @returns true если совпадает
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
