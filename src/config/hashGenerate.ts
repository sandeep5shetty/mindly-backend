/**
 * Generate a random string.
 * Characters: a-z, A-Z, 0-9
 */
export function generateHash(length = 10): string {
  if (length <= 0) return "";

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log(result);
  return result;
}

export default generateHash;
